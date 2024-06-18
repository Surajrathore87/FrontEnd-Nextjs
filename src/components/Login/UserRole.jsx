import Cookies from 'js-cookie';
import React, { useState } from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import { useAuth } from '_contexts/auth';
import { callAPI } from '_services/CallAPI';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

function UserRole(props) {
  const { registerData, setShowProfileSetup, setShowRoleModal, setMobileNumber } = props;
  const [userRole, setUserRole] = useState('');
  const [userReferral, setUserReferral] = useState('');
  const [submitLoader, setSubmitLoader] = useState(false);
  const { setIsLoggedIn, setCurrentUser } = useAuth();
  const toastConfig = {
    position: 'bottom-left',
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  useEffect(() => {
    if (Cookies.get('refCode')) {
      setUserReferral(Cookies.get('refCode'));
    }
  }, []);

  function addUserRole() {
    const params = {
      role_type: userRole,
      referral_code: userReferral,
    };
    setSubmitLoader(true);
    callAPI('POST', process.env.SET_USER_ROLE, params, (res) => {
      if (res.status) {
        const data = res['data'];
        setCurrentUser(data);
        setSubmitLoader(false);
        if (data.role_name == 'Dealer') {
          setShowRoleModal(false);
          setShowProfileSetup(true);
        } else {
          Cookies.remove('user_token');
          Cookies.remove('refCode');
          Cookies.set('access_token', registerData.access_token);
          setIsLoggedIn(true);
          setShowRoleModal(false);
          toastConfig['type'] = 'success';
          toast('Login Successfully', toastConfig);
          setMobileNumber(null);
          setSubmitLoader(false);
        }
      }
    });
  }

  return (
    <>
      <Modal show={true} className="login-modal about-you-modal">
        <Modal.Body className="position-relative pt-md-5 pt-4">
          <div className="text-end position-absolute end-0 pe-md-4 pe-3 top-0  pt-3">
            <button
              onClick={() => setShowRoleModal(false)}
              className="bg-transparent p-0 m-0 ms-auto border-0 shadow-none"
              title="Close"
            >
              <img src="/images/close-square.svg" className="img-fluid" />
            </button>
          </div>
          <div className="login-content">
            <h4 className="text-center fw-600 fs-32 text-black">Tell us about you</h4>
            <p className="text-center fs-16 label-color-1 fw-400 mb-4">Set a role type you are</p>
            <div className="row pt-2">
              <div className="col-12 mb-4">
                <div
                  className={`d-flex align-items-center px-3 about-field cursor-pointer 
                  bg-white position-relative ${userRole == 'home-owner' ? 'active-field' : ''}`}
                  onClick={() => setUserRole('home-owner')}
                >
                  <img
                    src={`/images/${(userRole == 'home-owner' && 'home-icon-red.svg') || 'home-icon.svg'}`}
                    className="mb-0 me-4"
                  />
                  <p className="fs-16 label-color-1 fw-600 m-0">Home Owner</p>
                </div>
              </div>
              <div className="col-12 mb-4">
                <div
                  className={`d-flex align-items-center px-3 about-field cursor-pointer 
                  bg-white position-relative ${userRole == 'carpenter' ? 'active-field' : ''}`}
                  onClick={() => setUserRole('carpenter')}
                >
                  <img
                    src={`/images/${(userRole == 'carpenter' && 'carpenter-icon-red.svg') || 'carpenter-icon.svg'}`}
                    className="mb-0 me-4"
                  />

                  <p className="fs-16 label-color-1 fw-600 m-0">Carpenter</p>
                </div>
              </div>
              <div className="col-12 mb-4">
                <div
                  className={`d-flex align-items-center px-3 about-field cursor-pointer 
                  bg-white position-relative ${userRole == 'interior-designer' ? 'active-field' : ''}`}
                  onClick={() => setUserRole('interior-designer')}
                >
                  <img src="/images/designer-icon.svg" className="mb-0 me-4" />
                  <p className="fs-16 label-color-1 fw-600 m-0">Interior Designer</p>
                </div>
              </div>
              <div className="col-12 mb-4">
                <div
                  className={`d-flex align-items-center px-3 about-field cursor-pointer 
                  bg-white position-relative ${userRole == 'dealer' ? 'active-field' : ''}`}
                  onClick={() => setUserRole('dealer')}
                >
                  <img
                    src={`/images/${(userRole == 'dealer' && 'dealer-icon-red.svg') || 'dealer-icon.svg'}`}
                    className="mb-0 me-4"
                  />
                  <p className="fs-16 label-color-1 fw-600 m-0">Dealer</p>
                </div>
              </div>
            </div>
            <button
              className="w-100 mb-4 shadow-none text-white login-btn outline-none rounded bg-blue mt-3 fs-16 fw-600"
              title="Continue"
              onClick={addUserRole}
              disabled={userRole == '' || submitLoader}
            >
              Continue
              {submitLoader && <Spinner animation="border" variant="light" className="ms-2" size="sm" />}
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default UserRole;
