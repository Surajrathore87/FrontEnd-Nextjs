import React, { useCallback, useEffect, useState } from 'react';
import { callAPI, callPostAPI, setHeader } from '_services/CallAPI';
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';
import Router, { useRouter } from 'next/router';
import { useAuth } from '_contexts/auth';
import { encrypt } from '_helper/encryptDecrypt';
import { toast } from 'react-toastify';
import useRazorpay from 'react-razorpay';
import axios, { Axios } from 'axios';
import SuccessPlan from './Modal/SuccessPlan';

const CryptoJS = require('crypto-js');
function BuyPlan(props) {
  const { planData } = props;
  const [orderData, setOrderData] = useState(null);
  const [intervalId, setIntervalId] = useState(0);
  const [isProcessed, setIsProcessed] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const { isLoggedIn, checkActivePlan, isContextLoaded, setShowLogin, getUserDetails, setIsLoggedIn, logout } =
    useAuth();
  const router = useRouter();
  // const Razorpay = useRazorpay();

  const toastConfig = {
    position: 'bottom-left',
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  const handlePayment = async () => {
    if (isContextLoaded && isLoggedIn) {
      const params = {
        plan_id: planData,
        payment_gateway: 'instamojo',
      };

      const res = await axios.post(`https://devapi.dsigndpo.com/web-api/users/buy-plan`, params, setHeader());

      if (res.status == 200) {
        const isBlocked = res['data'].data._data.is_blocked;
        const data = res['data'].data._data.data;
        if (isBlocked) {
          logout();
          setIsLoggedIn(false);
        } else {
          getUserDetails();
          router.push(data?.gateway_url);
        }
      } else {
        toast.error(res['message'], toastConfig);
      }
    } else {
      setShowLogin(true);
    }
  };

  return (
    <>
      {showSuccess && <SuccessPlan setShowSuccess={setShowSuccess} />}
      {(isProcessed && (
        <div className="payment-pending d-flex vh-100 w-100 top-0 px-3 start-0 position-fixed overflow-hidden align-items-center justify-content-center">
          <div className="processing-box w-100 bg-white rounded-6 p-4 text-center p-lg-5 p-4">
            <img src="/images/page-loader-small.gif" alt="Loader" className="img-fluid" width={150} />
            <h4 className="label-color-2 fw-600">DsignDpo</h4>
            <p className="label-color-1 lh-26 m-0">
              Please do not refresh the page till you complete your transaction.
            </p>
          </div>
        </div>
      )) ||
        ''}
      <button onClick={handlePayment} className="btn blue-btn px-lg-4 px-3 mt-3 shadow-none py-2">
        Pay Now
      </button>
    </>
  );
}

BuyPlan.propTypes = {
  planData: PropTypes.number,
};

export default BuyPlan;

// paytm

// import React, { useEffect, useState } from 'react';
// import { callAPI } from '_services/CallAPI';
// import Cookies from 'js-cookie';
// import PropTypes from 'prop-types';
// import Router from 'next/router';
// import { useAuth } from '_contexts/auth';
// import { encrypt } from '_helper/encryptDecrypt';
// import { toast } from 'react-toastify';

// const CryptoJS = require('crypto-js');
// function BuyPlan(props) {
//   const { planData } = props;
//   const [orderData, setOrderData] = useState(null);
//   const [intervalId, setIntervalId] = useState(0);
//   const [isProcessed, setIsProcessed] = useState(false);
//   const [paymentStatus, setPaymentStatus] = useState(null);
//   const { isLoggedIn, checkActivePlan, isContextLoaded, setShowLogin, getUserDetails } = useAuth();

//   const toastConfig = {
//     position: 'bottom-left',
//     autoClose: 3000,
//     hideProgressBar: true,
//     closeOnClick: true,
//     pauseOnHover: true,
//     draggable: true,
//     progress: undefined,
//   };
//   useEffect(() => {
//     if (isProcessed) {
//       const id = setInterval(() => {
//         getPaymentStatus();
//       }, 1000 * 5);
//       setIntervalId(id);
//       Cookies.set('val', id);
//     }
//   }, [isProcessed]);

//   function getPaymentStatus() {
//     const params = {
//       order_id: orderData && orderData.data.plan_order_id,
//       payment_gateway: 'paytm',
//     };
//     callAPI('POST', process.env.PLANS_PAYMENT_STATUS, params, (res) => {
//       if (res.status) {
//         const status = (res['data'].STATUS == 'PENDING' && 'TXN_SUCCESS') || 'TXN_FAILURE';
//         Cookies.set('_pMsg', status);
//         setPaymentStatus(res['data'].STATUS);
//         const encryptOrderID = orderData && encrypt(orderData.data.plan_order_id).replace(/\//g, 'dpo');
//         if (res['data'].STATUS == 'TXN_SUCCESS') {
//           window.location.href = `/payment-status/${encryptOrderID}`;
//           setIsProcessed(false);
//         } else if (res['data'].STATUS == 'TXN_FAILURE') {
//           window.location.href = `/payment-status/${encryptOrderID}`;
//           setIsProcessed(false);
//         }
//         getUserDetails();
//         clearInterval(intervalId);
//       }
//     });
//   }

//   function isDate(val) {
//     // Cross realm comptatible
//     return Object.prototype.toString.call(val) === '[object Date]';
//   }

//   function isObj(val) {
//     return typeof val === 'object';
//   }

//   function stringifyValue(val) {
//     if (isObj(val) && !isDate(val)) {
//       return JSON.stringify(val);
//     } else {
//       return val;
//     }
//   }

//   function buildForm({ action, params }) {
//     const form = document.createElement('form');
//     form.setAttribute('method', 'post');
//     form.setAttribute('action', action);
//     form.setAttribute('target', '_blank');
//     Object.keys(params).map((key) => {
//       const input = document.createElement('input');
//       input.setAttribute('type', 'hidden');
//       input.setAttribute('name', key.toUpperCase());
//       input.setAttribute('value', stringifyValue(params[key]));
//       form.appendChild(input);
//     });
//     return form;
//   }

//   function postForm(details) {
//     const form = buildForm(details);
//     document.body.appendChild(form);
//     form.submit();
//     form.remove();
//   }

//   function payNow() {
//     if (isContextLoaded && isLoggedIn) {
//       const activePlan = (isLoggedIn && checkActivePlan > 0 && checkActivePlan) || 0;
//       const params = {
//         plan_id: planData,
//         check_active_plan: activePlan,
//       };
//       callAPI('POST', process.env.BUY_PLAN, params, (res) => {
//         if (res.status) {
//           setOrderData(res['data']);
//           localStorage.setItem('planOrderID', res['data'].data.plan_order_id);
//           const decryptParams = CryptoJS.AES.decrypt(
//             String(res['data'].data.paytm_params),
//             'meklvJqN0jZ0Q6uZP65Tz5WzZxZJd0BV'
//           );
//           const paramsData = CryptoJS.enc.Utf8.stringify(decryptParams);
//           const convertParams = JSON.parse(paramsData);
//           const paytmDetails = {
//             action: res['data'].data.url,
//             params: convertParams,
//           };
//           if (Number(convertParams.TXN_AMOUNT) != 0) {
//             postForm(paytmDetails);
//           } else {
//             Router.push('/payment-status/' + orderData && orderData.data.plan_order_id + '/01' + '/01/');
//           }
//           setIsProcessed(true);
//         } else {
//           toast.error(res['message'], toastConfig);
//         }
//       });
//     } else {
//       setShowLogin(true);
//     }
//   }

//   return (
//     <>
//       {(isProcessed && (
//         <div className="payment-pending d-flex vh-100 w-100 top-0 px-3 start-0 position-fixed overflow-hidden align-items-center justify-content-center">
//           <div className="processing-box w-100 bg-white rounded-6 p-4 text-center p-lg-5 p-4">
//             <img src="/images/page-loader-small.gif" alt="Loader" className="img-fluid" width={150} />
//             <h4 className="label-color-2 fw-600">DsignDpo</h4>
//             <p className="label-color-1 lh-26 m-0">
//               Please do not refresh the page till you complete your transaction.
//             </p>
//           </div>
//         </div>
//       )) ||
//         ''}
//       <button onClick={() => payNow()} className="btn blue-btn px-lg-4 px-3 mt-3 shadow-none py-2">
//         Pay Now
//       </button>
//     </>
//   );
// }

// BuyPlan.propTypes = {
//   planData: PropTypes.number,
// };

// export default BuyPlan;

// ================================================================================================
//    razorpay

// const options = {
//   key: 'rzp_test_zOAa3BnWo9nSva', // Enter the Key ID generated from the Dashboard
//   amount: data.transaction_amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
//   currency: data.currency,
//   name: 'DesignDpo',
//   description: '',
//   image: '/images/main-logo.svg',
//   order_id: data.razorpay_order_id,
//   handler: async function (response) {
//     const veryfyParam = {
//       order_id: data.plan_order_id,
//       payment_gateway: 'razorpay',
//       payment_id: response.razorpay_payment_id,
//     };

//     const res = await axios.post(
//       `https://devapi.dsigndpo.com/web-api/users/plan/payment-gateway-response`,
//       veryfyParam,
//       setHeader()
//     );
//     if (res.status == 200) {
//       const message = res['data'].data._message;
//       setShowSuccess(true);
//       toast.success(message, toastConfig);
//     } else {
//       toast.error(message, toastConfig);
//     }
//   },
//   prefill: {
//     name: '',
//     email: '',
//     contact: '',
//   },
//   notes: {
//     address: 'Razorpay Corporate Office',
//   },
//   theme: {
//     color: '#3399cc',
//   },
// };

// const rzp1 = new Razorpay(options);
// rzp1.on('payment.failed', function (response) {});

// rzp1.open();
