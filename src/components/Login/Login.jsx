import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Modal } from 'react-bootstrap';
import { callAPI } from '_services/CallAPI';
import { gapi } from 'gapi-script';
import GoogleLogin from 'react-google-login';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useAuth } from '_contexts/auth';

function Login(props) {
  const {
    setShowLogin,
    setShowOtpModal,
    setMobileNumber,
    mobileNumber,
    setSendOtp,
    setShowRoleModal,
    setShowProfileSetup,
  } = props;
  const [error, setError] = useState(false);
  const [checkTerms, setCheckTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { setIsLoggedIn, refCode } = useAuth();
  const [errorMessage, setErrorMessage] = useState({
    mobile: '',
    terms: '',
  });
  const toastConfig = {
    position: 'bottom-left',
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  useEffect(() => {
    function start() {
      gapi.auth2.init({
        clientId: clientId,
        scope: '',
      });
    }
    gapi.load('client:auth2', start);
  }, []);

  const socialLogin = (googleData) => {
    if (googleData) {
      const params = {
        email: googleData.profileObj.email,
        social_id: googleData.googleId,
        name: googleData.profileObj.givenName,
        platform: 'WEB',
        service: 'google',
        avatar: googleData.profileObj.imageUrl,
        referral_code: refCode,
      };
      callAPI('POST', process.env.SOCIAL_LOGIN, params, (res) => {
        if (res.status) {
          const data = res['data'];
          Cookies.set('user_token', data.access_token);
          if (data.user.account_status == 'PENDING' && data.user.role_name == 'Dealer') {
            setShowLogin(false);
            setShowProfileSetup(true);
            Cookies.set('access_token', data.access_token);
          } else if (data.user.account_status == 'APPROVE' && data.user.role_name != null) {
            Cookies.remove('user_token');
            Cookies.set('access_token', data.access_token, { expires: 365 });
            setIsLoggedIn(true);
            setShowLogin(false);
            toast.success('Login Successfully', toastConfig);
          } else {
            setShowLogin(false);
            setShowRoleModal(true);
          }
        } else {
          toast.error(res['message'], toastConfig);
        }
      });
    }
  };

  function getMobileOtp(e) {
    e.preventDefault();
    if (formValidation()) {
      setIsLoading(true);
      const params = {
        mobile_number: mobileNumber,
      };
      callAPI('POST', process.env.SEND_OTP, params, (res) => {
        setIsLoading(false);
        if (res.status) {
          const data = res['data'];
          setSendOtp(data);
          setShowOtpModal(true);
          setShowLogin(false);
        } else {
          toast.error(res['message'], toastConfig);
          setShowLogin(false);
        }
      });
    }
  }

  function onCheckTerms(e) {
    if (e.target.checked) {
      setCheckTerms(true);
    } else {
      setCheckTerms(false);
    }
  }

  function formValidation() {
    let mobileMsg = '';
    let termsMsg = '';

    let isValid = false;

    if (mobileNumber) {
      if (String(mobileNumber).length !== 10) {
        mobileMsg = 'Mobile number must be 10 digits only';
      }
    } else {
      mobileMsg = 'Please enter your mobile number';
    }
    if (!checkTerms) {
      termsMsg = 'Please accept terms of use.';
    }

    if (!mobileMsg && !termsMsg) {
      isValid = true;
    }
    if (isValid) {
      setError(true);
      setErrorMessage({
        mobile: '',
        terms: '',
      });
      return true;
    } else {
      setError(true);
      setErrorMessage({
        mobile: mobileMsg,
        terms: termsMsg,
      });
      return false;
    }
  }

  const maxLengthCheck = (object) => {
    if (object.target.value.length > object.target.maxLength) {
      object.target.value = object.target.value.slice(0, object.target.maxLength);
    }
  };

  return (
    <>
      <Modal show={true} onHide={() => setShowLogin(false)} className="login-modal" centered>
        <Modal.Body className="position-relative pt-md-5 pt-4">
          <div className="text-end position-absolute end-0 pe-md-4 pe-3 top-0  pt-3">
            <button
              onClick={() => setShowLogin(false)}
              className="bg-transparent p-0 m-0 ms-auto border-0 shadow-none"
              title="Close"
            >
              <img src="/images/close-square.svg" className="img-fluid" />
            </button>
          </div>
          <div className="login-content">
            <h4 className="text-center fw-600 fs-32 text-black">Sign In</h4>
            <p className="fs-16 label-color-1 fw-400 mb-4 text-center">
              We will send you an One Time Password on this mobile number
            </p>
            <form onSubmit={getMobileOtp}>
              <div>
                <label htmlFor="phone-number" className="fw-500 fs-16 text-black mb-2">
                  Phone number
                </label>
                <input
                  type="number"
                  id="phone-number"
                  maxLength="10"
                  onInput={maxLengthCheck}
                  className="form-control shadow-none label-color-1"
                  placeholder="Enter phone number"
                  onChange={(e) => setMobileNumber(e.target.value)}
                />
                {error && errorMessage.mobile && <small className="pt-2 text-red">{errorMessage.mobile}</small>}
              </div>
              <div className="d-flex align-items-center form-group-check pt-3">
                <input type="checkbox" id="check-terms" onChange={onCheckTerms} defaultChecked={checkTerms} />
                <label
                  htmlFor="check-terms"
                  className="fw-500 fs-13 label-color-1 cursor-pointer position-relative d-flex"
                >
                  <div>
                    {/* I have read and accept the Terms of Use */}I agree to all{' '}
                    <span className="text-red cursor-pointer">
                      <Link href="/terms-and-conditions">
                        <a className="text-red text-decoration-none" target="_blank" rel="noreferrer">
                          Terms &amp; Conditions
                        </a>
                      </Link>
                    </span>{' '}
                    and
                    <span className="text-red cursor-pointer">
                      {' '}
                      <Link href="/privacy-policy">
                        <a className="text-red text-decoration-none" target="_blank" rel="noreferrer">
                          Privacy Policy
                        </a>
                      </Link>
                    </span>{' '}
                    of DsignDpo.
                  </div>
                </label>
              </div>
              {error && errorMessage.terms && <small className="pt-2 text-red">{errorMessage.terms}</small>}
              <button
                className="w-100 shadow-none text-white login-btn outline-none rounded bg-blue mt-4 fs-16 fw-600"
                title="Continue"
                type="submit"
                disabled={isLoading}
              >
                Continue
              </button>
            </form>
            <div className="position-relative my-4">
              <div className="w-100 or-line position-absolute"></div>
              <div
                className="login-or d-flex align-items-center justify-content-center
                  text-black fs-12 fw-600 mx-auto position-relative"
              >
                OR
              </div>
            </div>
            <GoogleLogin
              clientId={clientId}
              buttonText="Continue With Google"
              onSuccess={socialLogin}
              // onFailure={handleFailure}
              cookiePolicy={'single_host_origin'}
              className="w-100 position-relative mb-4 login-google-btn outline-none bg-white p-0"
            />
            {/* <div className="mt-4">
              <p className='text-center label-color-1 fs-14 fw-500'>
                Don't have an account? <a className='cursor-pointer text-red decoration-none' title='Sign up'>Sign up</a>
              </p>
            </div> */}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Login;
