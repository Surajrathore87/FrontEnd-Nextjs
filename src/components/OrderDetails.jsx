import Link from 'next/link';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { callAPI } from '_services/CallAPI';

function OrderDetails(props) {
  const { orderId } = props;
  const [ordersDetails, setOrdersDetails] = useState(null);
  const [orderImagePath, setOrderImagePath] = useState(null);
  const [groupedData, setGroupedData] = useState(null);
  const [individualData, setIndividualData] = useState(null);

  useEffect(() => {
    if (orderId) {
      getOrderDetails();
    }
  }, [orderId]);

  function getOrderDetails() {
    const params = {
      order_id: orderId,
    };
    callAPI('POST', process.env.ORDER_DETAILS, params, (res) => {
      if (res.status) {
        const data = res['data'];
        setOrdersDetails(data.order_detail);
        setOrderImagePath(data.image_path);
        setGroupedData(data.order_detail.design_details.grouped_cart_data);
        setIndividualData(data.order_detail.design_details.individual_cart_data);
      } else {
      }
    });
  }

  function renderGroupOrders() {
    return groupedData.map((item, key) => {
      return (
        <div className="mb-lg-5 mb-4" key={key}>
          <div className="mb-3 mb-lg-4">
            <h5 className="fs-20 fw-600 mb-3">{item.root_category.name}</h5>
            <div className="cart-box main-border rounded-6 mb-3">
              <div className="d-lg-flex p-3 p-lg-4 align-items-center cart-item position-relative">
                <Link href={`/grouped-design/${item.slug}`}>
                  <a className="decoration-none cursor-pointer d-flex align-items-center">
                    <img
                      src={orderImagePath + item.main_image.image}
                      className="me-3 mb-2 mb-lg-0 img-fluid cart-preview-img"
                      width={155}
                      height={155}
                    />
                    <div className="mb-2 mb-lg-0 text-nowrap">
                      <h6 className="fs-18 fw-600 text-black mb-lg-2 mb-0">Main Image</h6>
                      <span className="label-color-1 fs-14 fw-500">{item.code}</span>
                    </div>
                  </a>
                </Link>
                <div className="d-flex align-items-center w-100">
                  <p className="m-0 label-color-1 fs-15 fw-500 ms-lg-auto">
                    Total design: {item.cart_group_designs.length}
                  </p>
                  {/* <h4 className="fs-20 fw-700 text-black mb-0 mx-lg-4 ms-auto">₹{item.price}</h4> */}
                  <h4 className="fs-20 fw-700 text-black mb-0 ms-auto me-4 d-flex align-items-center">
                    <img src="/images/credit-icon.png" className="img-fluid me-2" width={30} />
                    <span>{item.price}</span>
                  </h4>
                </div>
              </div>
              <div className="p-3 p-lg-4">
                <div className="row">
                  {item.cart_group_designs.map((groupItem, key) => (
                    <div className="col-lg-3 col-6 mb-3" key={key}>
                      <div className="position-relative">
                        <Link href={`/individual-design/${groupItem.design.slug}`}>
                          <a className="cursor-pointer decoration-none d-block">
                            <img
                              src={orderImagePath + groupItem.design.main_image.image}
                              alt="image"
                              className="img-fluid mb-3 cart-item-image"
                            />
                            <div className="d-flex align-items-center justify-content-between">
                              <div>
                                <h6 className="fs-15 fw-600 text-black mb-1">{groupItem.design.root_category.name}</h6>
                                <span className="label-color-1 fs-13 fw-500">{groupItem.design.code}</span>
                              </div>
                              {/* <h5 className="m-0 fs-16 fw-700 text-black">₹{groupItem.design.price}</h5> */}
                              <h5 className="m-0 fs-16 fw-700 text-black d-flex align-items-center">
                                <img src="/images/credit-icon.png" className="img-fluid me-1" width={20} />
                                <span>{groupItem.design.price}</span>
                              </h5>
                            </div>
                          </a>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });
  }

  function renderIndividualOrders() {
    return individualData.map((item, key) => {
      return (
        <div className="d-flex p-3 p-lg-4 align-items-center cart-item" key={key}>
          <Link href={`/individual-design/${item.slug}`}>
            <a className="decoration-none cursor-pointer d-flex align-items-center">
              <img
                src={orderImagePath + item.main_image.image}
                width={155}
                height={155}
                className="me-3 img-fluid cart-preview-img"
              />
              <div>
                <h6 className="fs-18 fw-600 text-black">{item.root_category.name}</h6>
                <span className="label-color-1 fs-14 fw-500">{item.code}</span>
              </div>
            </a>
          </Link>
          <h4 className="fs-20 fw-700 text-black mb-0 ms-auto me-4 d-flex align-items-center">
            <img src="/images/credit-icon.png" className="img-fluid me-2" width={30} />
            <span>{item.price}</span>
          </h4>
        </div>
      );
    });
  }

  return (
    <>
      <section className="my-orders-section my-cart-section">
        <div className="container">
          <div className="row">
            <div className="col-12 mb-5 pt-lg-5 pt-4">
              <div className="row mb-4">
                <div className="col-lg-8">
                  {groupedData?.length > 0 && renderGroupOrders()}
                  {individualData?.length > 0 && (
                    <div className="mb-lg-5 mb-4 indv-carts">
                      <h5 className="fs-20 fw-600 mb-3">Individual Designs</h5>
                      <div className="cart-box main-border rounded-6 mb-3">{renderIndividualOrders()}</div>
                    </div>
                  )}
                </div>
                <div className="col-lg-4 mb-4">
                  <div className="order-summary">
                    <h5 className="fs-20 fw-600 mb-3">Order Summary</h5>
                    <div className="summary-box main-border rounded-6">
                      <div className="order-detail px-4 border-0">
                        <h6 className="d-flex justify-content-between fw-500 mb-3 py-1 px-2 fs-16 text-black">
                          <span>Total Design</span>
                          <span>{ordersDetails && groupedData.length + individualData.length}</span>
                        </h6>
                        <h6 className="d-flex justify-content-between fw-500 mb-3 py-1 px-2 fs-16 text-black">
                          <span>Subtotal</span>
                          <span>
                            <img src="/images/credit-icon.png" className="img-fluid me-1 mb-1" width={20} />
                            {ordersDetails && ordersDetails.total_amount}
                          </span>
                        </h6>
                        {/* <h6 className="d-flex justify-content-between fw-500 mb-3 py-1 px-2 fs-16 text-black">
                          <span>Discount ({ordersDetails && ordersDetails.discount_percent}%)</span>
                          <span>₹{ordersDetails && ordersDetails.discount_amount}</span>
                        </h6> */}
                        <div className="order-total pt-4 pb-2 px-2">
                          <h6 className="d-flex justify-content-between fw-700 m-0 fs-20 text-black">
                            <span>Total</span>
                            <span>
                              <img src="/images/credit-icon.png" className="img-fluid me-1 mb-1" width={25} />
                              {ordersDetails && ordersDetails.order_amount.replace('.00', '')}
                            </span>
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default OrderDetails;
