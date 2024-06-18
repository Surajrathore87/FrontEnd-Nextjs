import { faCheckCircle, faClock, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useAuth } from '_contexts/auth';
import { callAPI } from '_services/CallAPI';
import InfiniteScroll from 'react-infinite-scroller';
import { Spinner } from 'react-bootstrap';
import { useRef } from 'react';

function MySubscription() {
  const [subsData, setSubsData] = useState([]);
  const { userDetails, isLoggedIn } = useAuth();
  const currentDate = moment(new Date());
  const [totalPageCount, setTotalPageCount] = useState(null);
  const [pages, setPages] = useState(1);
  const timelineRef = useRef();

  useEffect(() => {
    if (isLoggedIn) {
      subscriptionData();
    }
  }, [isLoggedIn]);

  function loadMore() {
    if (pages <= totalPageCount) {
      subscriptionData();
    }
  }

  function subscriptionData() {
    const params = {
      page: pages,
    };
    callAPI('POST', process.env.SUBSCRIPTIONS_DATA, params, (res) => {
      if (res.status) {
        const data = res['data'];
        setSubsData((prev) => [...prev, ...data.subscriptions]);
        setTotalPageCount(res['data'].paginate.last_page);

        setPages((prev) => prev + 1);
      }
    });
  }

  function renderSubscription() {
    return subsData.map((item, key) => {
      return (
        <div className="main-shadow bg-white mb-3 rounded-6 main-border table-responsive" key={key}>
          <div className="d-flex d-flex align-items-stretch">
            <div className="w-50 border-bottom p-3 border-end fs-15 fw-500">
              <p className="label-color-1 mb-2">Order id: #{item?.transaction.order_custom_id}</p>
              <span className="label-color-2">{moment(item?.created_at).format('DD/MM/YYYY')}</span>
            </div>
            <div className="w-50 border-bottom p-3 d-flex align-items-center fw-500">
              {(moment(item?.expiry_date) < currentDate && (
                <span>
                  <FontAwesomeIcon icon={faTimesCircle} width={22} className="text-red fs-20 me-2" />
                  Expired
                </span>
              )) || (
                <span>
                  <FontAwesomeIcon icon={faCheckCircle} width={22} className="text-success fs-20 me-2" />
                  Active
                </span>
              )}
            </div>
          </div>
          <div className="d-flex d-flex align-items-stretch">
            <div className="w-50 border-bottom p-3 border-end fs-15 fw-500">
              <p className="text-blue mb-0">{JSON.parse(item?.plan_details)?.plan_title}</p>
            </div>
            <div className="w-50 border-bottom p-3 d-flex align-items-center fs-15 label-color-2 fw-500">
              Plan Credits:
              <p className="mb-0">
                <img src="/images/credit-icon.png" className="img-fluid ms-2 me-1" width={20} height={20} />
                {JSON.parse(item?.plan_details)?.plan_credits}
              </p>
            </div>
          </div>
          <div className="d-flex d-flex align-items-stretch">
            <div className="w-50 p-3 border-end fw-500">
              <p className="label-color-2 fs-15 m-0 d-flex align-items-center">
                Plan Starting: <FontAwesomeIcon icon={faClock} width={15} className="ms-2 me-1 label-color-1" />
                <span className="label-color-1">{moment(item?.created_at).format('DD/MM/YYYY')}</span>
              </p>
            </div>
            <div className="w-50 p-3 d-flex align-items-center fw-500">
              <p className="label-color-2 fs-15 m-0 d-flex align-items-center">
                Date of Expiry: <FontAwesomeIcon icon={faClock} width={15} className="ms-2 me-1 label-color-1" />
                <span className="label-color-1">{moment(item?.expiry_date).format('DD/MM/YYYY')}</span>
              </p>
            </div>
          </div>
        </div>
      );
    });
  }
  return (
    <>
      <div className="col-lg-12">
        <div className="w-100 bg-white rounded-6 main-shadow py-4 main-border h-100">
          <div className="d-flex mb-3 px-4">
            {subsData?.length > 0 && <h2 className="label-color-2 fs-20">My Subscriptions</h2>}
          </div>
          <div className="subscription-tab h-100 px-4">
            {(subsData?.length > 0 && (
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
                {renderSubscription()}
              </InfiniteScroll>
            )) || (
              <div className="h-100 d-flex align-items-center w-100 justify-content-center">
                <div className="text-center">
                  <img src="/images/page-not-found.svg" alt="Empty Cart" className="img-fluid" width={450} />
                  <h4 className="text-black fw-600">You have no premium subscription</h4>
                  <Link href={'/plans'}>
                    <a className="w-max-content py-2 fs-16 fw-400 blue-btn mt-4 mx-auto btn" title="Buy Plan">
                      Buy Plan
                    </a>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default MySubscription;
