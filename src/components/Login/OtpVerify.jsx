import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import OTPInput, { ResendOTP } from 'otp-input-react';
import { callAPI } from '_services/CallAPI';
import Cookies from 'js-cookie';
import { useAuth } from '_contexts/auth';
import { toast } from 'react-toastify';

function OtpVerify(props) {
  const {
    setShowOtpModal,
    setShowRoleModal,
    mobileNumber,
    setMobileNumber,
    setRegisterData,
    registerData,
    setShowProfileSetup,
    sendOtp,
    setSendOtp,
  } = props;
  const [isError, setIsError] = useState(false);
  const [oneTimePassword, setOneTimePassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const { setIsLoggedIn } = useAuth();

  const toastConfig = {
    position: 'bottom-left',
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  function userRegister(e) {
    e.preventDefault();
    if (oneTimePassword.length != 6) {
      setIsError(true);
      return;
    }
    const params = {
      mobile_number: mobileNumber,
      one_time_password: oneTimePassword,
      platform: 'WEB',
    };
    callAPI('POST', process.env.REGISTER_LOGIN, params, (res) => {
      if (res.status) {
        const data = res['data'];
        setRegisterData(data);
        Cookies.set('user_token', data.access_token, { expires: 365 });
        if (data.user.account_status == 'PENDING' && data.user.role_name == 'Dealer') {
          setShowOtpModal(false);
          setShowProfileSetup(true);
        } else if (data.user.account_status == 'APPROVE' && data.user.role_name != null) {
          Cookies.remove('user_token');
          Cookies.set('access_token', data.access_token);
          setIsLoggedIn(true);
          setShowOtpModal(false);
          toastConfig['type'] = 'success';
          toast('Login Successfully', toastConfig);
          setMobileNumber(null);
        } else {
          setShowOtpModal(false);
          setShowRoleModal(true);
        }
      } else {
        setErrorMessage(res['message']);
      }
    });
  }

  function resendOtp() {
    const params = {
      mobile_number: mobileNumber,
    };
    callAPI('POST', process.env.SEND_OTP, params, (res) => {
      if (res.status) {
        const data = res['data'];
        setSendOtp(data);
        setOneTimePassword('');
      }
    });
  }

  const renderTime = (remainingTime) => {
    return (remainingTime && <span>{remainingTime} sec</span>) || '';
  };

  return (
    <>
      <Modal show={true} className="login-modal" centered>
        <Modal.Body className="position-relative pt-md-5 pt-4">
          <div className="text-end position-absolute end-0 pe-md-4 pe-3 top-0  pt-3">
            <button
              onClick={() => setShowOtpModal(false)}
              className="bg-transparent p-0 m-0 ms-auto border-0 shadow-none"
              title="Close"
            >
              <img src="/images/close-square.svg" className="img-fluid" />
            </button>
          </div>
          <div className="login-content pt-4 text-center">
            <h4 className="fw-600 fs-32 text-black">Enter Code</h4>
            <p className="fs-16 label-color-1 fw-400 mb-4">Enter the OTP send to {mobileNumber}</p>
            {/* <p className="fs-16 label-color-1 fw-400 m-0">Enter this OTP {sendOtp} temporary for login</p> */}
            {/* Using send OTP prop for direct otp from api for now after OTP service we can pass oneTimePassword state here */}
            <form onSubmit={userRegister}>
              <OTPInput
                value={oneTimePassword}
                onChange={setOneTimePassword}
                autoFocus
                OTPLength={6}
                otpType="number"
                disabled={false}
                className="otp-inputs justify-content-center py-2"
              />
              {isError && <small className="text-red">The one time password must be 6 digits.</small>}
              {errorMessage && (
                <div className="pt-3">
                  <small className="text-red">{errorMessage}</small>
                </div>
              )}
              <button
                className="w-100 shadow-none text-white login-btn outline-none rounded bg-blue my-4 fs-16 fw-600"
                title="Verify & Proceed"
                type="submit"
              >
                Verify & Proceed
              </button>
            </form>
            <div className="d-flex justify-content-center pt-3 align-items-center pb-4">
              <span className="fs-14 label-color-1 fw-400">Didn’t get the code?</span>
              <ResendOTP maxTime={30} onResendClick={resendOtp} renderTime={renderTime} className="resend-otp" />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default OtpVerify;
