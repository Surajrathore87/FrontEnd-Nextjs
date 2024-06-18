import dynamic from 'next/dynamic';
import Link from 'next/link';
import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';

const BuyPlan = dynamic(import('components/BuyPlan'));

function Plans(props) {
  const { planPageData } = props;
  const imagePath = planPageData && planPageData.data.image_path.plan_image_path;
  function renderPlans() {
    return planPageData.data.plans.map((item, key) => (
      <div className="col-lg-4 mb-3 text-center" key={key}>
        <div className="plan-box cursor-pointer p-lg-4 p-3 py-lg-5">
          {/* <img
            src={imagePath + item.plan_image}
            alt={item.image_alt || ''}
            title={item.image_alt || ''}
            className="img-fluid mb-4"
          /> */}
          <h4 className="fw-500 label-color-2">Plan For {item?.plan_credits} Designs</h4>
          <div className="d-flex align-items-end py-3 justify-content-center">
            <s className="label-color-1 fw-600 m-0">₹{item.actual_price}</s>
            <p className="label-color-2 fw-600 mx-2 m-0 fs-40 d-flex align-items-start">
              <span className="fs-22 lh-30">₹</span>
              <span className="me-2">{item.plan_amount.replace('.00', '')}/-</span>
            </p>
            {/* <p className="label-color-1 fw-600 m-0">/-</p> */}
          </div>
          <div className="plan_bottom_box"></div>
          <h4 className="fw-600 label-color-2">Benefits</h4>
          <div className="text-center">
            <ul className="list-unstyled text-start my-3 ps-md-5">
              <li className="label-color-1 fs-15 mb-2">
                <span className="me-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-blue" width={16} />
                </span>
                3D Design with high resolution.
              </li>
              <li className="label-color-1 fs-15 mb-2">
                <span className="me-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-blue" width={16} />
                </span>
                2D Working drawing.
              </li>
              <li className="label-color-1 fs-15 mb-2">
                <span className="me-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-blue" width={16} />
                </span>
                Material list for cost calculation.
              </li>
            </ul>
            <p className="label-color-1 fs-15 mb-2 px-md-4 p-2">
              You will get {item?.plan_credits}
              <img
                alt="Credits"
                src="/images/credit-icon.png"
                className="img-fluid mb-1 ms-1"
                width={20}
                height={20}
              />{' '}
              credit for purchasing a design and it is valid for {item.plan_month}{' '}
              {(item.plan_month == 1 && 'month') || 'months'}.
            </p>
          </div>
          {/* <button type="button" className="btn blue-btn px-lg-4 px-3 mt-3 shadow-none py-2">
            Pay Now
          </button> */}
          <BuyPlan planData={item.id} />
        </div>
      </div>
    ));
  }

  return (
    <>
      <section className="py-5 plans-section">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="text-center">
                <h1 className="label-color-2 fw-700 fs-30 heading-fonts">Upgrade to Premium</h1>
                <p className="label-color-3 fw-500 fs-18 mb-4">Full-fleged access to all Designs, along with content</p>
              </div>
              <div className="row justify-content-center pt-4">{planPageData && renderPlans()}</div>
              {!planPageData && (
                <div className="px-3 pb-5 d-flex align-items-center justify-content-center h-100">
                  <div className="text-center">
                    <p className=" fw-600 fs-18">No plans available</p>
                    <Link href={'/'}>
                      <a title="Back to Homepage" className="btn blue-btn fs-15 fw-600 mb-5 mt-4">
                        Back to Homepage
                      </a>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

Plans.propTypes = {
  planPageData: PropTypes.object,
};

export default Plans;
