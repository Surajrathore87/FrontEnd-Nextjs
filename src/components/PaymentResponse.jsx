import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { callAPI } from '_services/CallAPI';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '_contexts/auth';
import Link from 'next/link';

function PaymentResponse(props) {
  const { paymentId, paymentRequestId, paymentStatus } = props;
  const { getUserDetails } = useAuth();
  const { userDetails } = useAuth();
  const [paymentResponse, setPaymenResponse] = useState();

  useEffect(() => {
    if (paymentId || paymentRequestId) {
      getPaymentResponse();
    }
  }, [paymentId, paymentRequestId]);

  function getPaymentResponse() {
    const params = {
      payment_gateway: 'instamojo',
      payment_id: paymentId,
      payment_request_id: paymentRequestId,
    };
    callAPI('POST', process.env.PLANS_PAYMENT_RESPONSE, params, (res) => {
      if (res.status) {
        setPaymenResponse(res['data']);
        getUserDetails();
      }
    });
  }


  return (
    <>
      <div className="container py-5">
        <div className="row">
          <div className="col-12">
            <div className="contact-form p-4 p-lg-5 rounded-6">
              {(paymentResponse && paymentResponse.status === 'Failed' && (
                <div className="row align-items-center">
                  <div className="col-lg-6 text-center">
                    <img
                      src="/images/payment-faild.svg"
                      alt="Payment failed"
                      width={400}
                      className="img-fluid mb-3 mb-lg-0"
                    />
                  </div>
                  <div className="col-lg-6 text-center">
                    <div>
                      <FontAwesomeIcon icon={faExclamationTriangle} width={50} className="fs-55 text-red mb-3" />
                      <h4 className="fw-600 label-color-2">Transaction Failed</h4>
                      <p className="label-color-1 lh-26 mb-2">Hi {userDetails && userDetails?.name}</p>
                      <p className="label-color-1 lh-26 mb-2">
                        Unfortunately, your DsignDpo subscription has been failed.
                      </p>
                      <p className="label-color-1 lh-26 mb-2">
                        Your {paymentResponse?.plan_title} offer price ₹{paymentResponse?.txn_amount} payment was
                        processed but couldn't get your transaction status.
                      </p>
                      <p className="label-color-1 lh-26 mb-2">
                        We're really sorry to see you go, you miss the best offer.
                      </p>
                      <Link href={'/plans'}>
                        <a className="decoration-none btn blue-btn px-lg-4 px-3 mt-3 mb-3 shadow-none py-2 fw-500">
                          Retry!
                        </a>
                      </Link>
                      <p className="label-color-1 lh-26 mb-2">
                        Questions?{' '}
                        <Link href={'/contact-us'}>
                          <a className="text-blue decoration-none fw-500">Contact us</a>
                        </Link>{' '}
                        Anytime. If you have any questions or issues, don't hesitate to reach out, we're just an email
                        away.
                      </p>
                    </div>
                  </div>
                </div>
              )) ||
                ''}
              {(paymentResponse && paymentResponse.status === 'Completed' && (
                <div className="row align-items-center">
                  <div className="col-lg-6 text-center">
                    <img
                      src="/images/payment-success.svg"
                      alt="Payment success"
                      width={400}
                      className="img-fluid mb-3 mb-lg-0"
                    />
                  </div>
                  {paymentResponse && (
                    <div className="col-lg-6 text-center">
                      <div>
                        <FontAwesomeIcon icon={faCheckCircle} width={50} className="fs-55 text-successs mb-3" />
                        <h4 className="fw-600 label-color-2">Transaction Successful</h4>
                        <p className="label-color-1 lh-26 mb-2">Hi {userDetails && userDetails?.name}</p>
                        <p className="label-color-1 lh-26 mb-2">
                          Your {paymentResponse?.plan_title} offer price ₹{paymentResponse?.txn_amount} payment was
                          successfully processed.
                        </p>
                        <p className="label-color-1 lh-26 mb-2">
                          Congratulations, You have got
                          <img src="/images/credit-icon.png" className="img-fluid mx-1" width={20} height={20} />
                          <span className="fw-500">{paymentResponse?.plan_credits}</span> credits.
                        </p>
                        <p className="label-color-1 lh-26 mb-2">Your transaction id is:</p>
                        <p className="label-color-1 lh-26 mb-2">{paymentResponse?.txn_id}</p>
                        <h5 className="text-capitalize fw-600 label-color-2 mt-4">Welcome to DsignDpo Premium!</h5>
                        <p className="label-color-1 lh-26 mb-2">
                          Your membership is now active and benefits start immediately.
                        </p>
                        <Link href={'/'}>
                          <a className="decoration-none btn blue-btn px-lg-4 px-3 mt-3 shadow-none py-2 fw-500">
                            Back to Home
                          </a>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )) ||
                ''}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

PaymentResponse.propTypes = {};

export default PaymentResponse;
