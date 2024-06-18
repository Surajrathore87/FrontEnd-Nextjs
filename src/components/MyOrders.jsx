import dynamic from 'next/dynamic';
import Link from 'next/link';
import Router from 'next/router';
import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import { useAuth } from '_contexts/auth';
import { encrypt } from '_helper/encryptDecrypt';
import { callAPI } from '_services/CallAPI';
import InfiniteScroll from 'react-infinite-scroller';
import { Spinner } from 'react-bootstrap';

const MyOrdersLoader = dynamic(import('components/Loaders/MyOrdersLoader'));

function MyOrders() {
  const [ordersList, setOrdersList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isLoggedIn } = useAuth();
  const [totalPageCount, setTotalPageCount] = useState(null);
  const [pages, setPages] = useState(1);
  const timelineRef = useRef();

  useEffect(() => {
    if (isLoggedIn) {
      getOrdersList();
    }
  }, [isLoggedIn]);

  function loadMore() {
    if (pages <= totalPageCount) {
      getOrdersList();
    }
  }

  function getOrdersList() {
    const params = {
      page: pages,
    };
    callAPI('POST', process.env.ORDERS_LIST, params, (res) => {
      setIsLoading(false);
      if (res.status) {
        const data = res['data'];
        setOrdersList((prev) => [...prev, ...data.orders]);
        setTotalPageCount(res['data'].paginate.last_page);

        setPages((prev) => prev + 1);
      } else {
      }
    });
  }
  console.log('DATA', ordersList);

  function goToOrder(id) {
    const encryptCode = encrypt(id).replace(/\//g, 'dpo');
    Router.push(`/my-orders/${encryptCode}`);
  }

  function renderOrders() {
    return ordersList.map((item, key) => (
      <tr className="cursor-pointer" key={key} onClick={() => goToOrder(item.id)}>
        <td className="fs-16 fw-600 text-black border-0 border-bottom text-nowrap px-3 py-4">
          <div className="d-flex align-items-center">
            <div
              className="order-list-image rounded-6"
              style={{
                backgroundImage: `url(${
                  'https://d2rnec3x58xe5y.cloudfront.net/dsigndpo/images/designs/' +
                  `${
                    JSON.parse(item.design_details).groupedCartData?.[0]?.main_image?.image ||
                    JSON.parse(item.design_details).individualCartData?.[0]?.main_image?.image
                  }`
                })`,
              }}
            ></div>
            <div className="ms-3">
              <p className="mb-1">
                {JSON.parse(item.design_details).groupedCartData?.[0]?.root_category?.name ||
                  JSON.parse(item.design_details).individualCartData?.[0]?.root_category?.name}
              </p>
              <p className="m-0 label-color-1 fs-14 fw-500">
                {JSON.parse(item.design_details).groupedCartData?.[0]?.code ||
                  JSON.parse(item.design_details).individualCartData?.[0]?.code}
              </p>
            </div>
          </div>
        </td>
        <td className="fs-16 fw-600 text-black border-0 border-bottom text-nowrap px-3 py-4">
          #{item.transaction.order_custom_id}
        </td>
        <td className="fs-16 fw-600 text-black border-0 border-bottom text-nowrap px-3 py-4">{item.order_date}</td>
        <td className="fs-16 fw-600 text-black border-0 border-bottom text-nowrap px-3 py-4 text-end">
          {item.total_items}
        </td>
        <td className="fs-16 fw-600 text-black border-0 border-bottom text-nowrap px-3 py-4 text-end">
          <img src="/images/credit-icon.png" className="img-fluid me-1" width={25} />
          {item.order_amount.replace('.00', '')}
        </td>
      </tr>
    ));
  }

  function emptyOrders() {
    return (
      <div className="py-4 my-5 d-flex align-items-center w-100 justify-content-center">
        <div className="text-center">
          <img src="/images/empty-cart.svg" alt="Empty Cart" className="img-fluid mb-4" width={180} height={180} />
          <h4 className="text-black fw-700 heading-fonts">No orders found</h4>
          <Link href={'/home-interior-design'}>
            <a className="fs-16 fw-400 blue-btn mt-4 w-100 btn" title="Continue Searching">
              Continue Searching
            </a>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="my-orders-section">
        <div className="container">
          <div className="row">
            <div className="col-12 mb-5 pt-lg-5 pt-4">
              <div className="d-flex mb-4">
                <h1 className="inner-heading m-0 fw-700 heading-fonts">My Orders</h1>
              </div>
              {!isLoading && ordersList && (
                <div className="table-responsive orders-table-box">
                  <InfiniteScroll
                    pageStart={1}
                    loadMore={loadMore}
                    hasMore={pages <= totalPageCount}
                    loader={
                      <div className="text-center label-color-1">
                        <Spinner animation="border" variant="primary" className="text-blue mx-auto" size="md" />
                      </div>
                    }
                    useWindow={false} // Set this to true if the parent container has a fixed height
                    getScrollParent={() => timelineRef.current} // Set this to the ref of the container to be scrolled
                  >
                    <table className="orders-table orders-table-rounded w-100">
                      <thead>
                        <tr>
                          <th className="fw-500 fs-16 text-black px-3 text-nowrap py-2">Order</th>
                          <th className="fw-500 fs-16 text-black px-3 text-nowrap py-2">Order Id</th>
                          <th className="fw-500 fs-16 text-black px-3 text-nowrap py-2">Date & Time</th>
                          <th className="fw-500 fs-16 text-black px-3 text-nowrap py-2 text-end">Total Items</th>
                          <th className="fw-500 fs-16 text-black px-3 text-nowrap py-2 text-end">Total Credits</th>
                        </tr>
                      </thead>
                      <tbody>{renderOrders()}</tbody>
                    </table>
                  </InfiniteScroll>
                </div>
              )}
              {isLoading && <MyOrdersLoader />}
              {!isLoading && !ordersList && emptyOrders()}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default MyOrders;
