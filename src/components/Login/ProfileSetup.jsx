import React, { useEffect, useRef, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { callAPI } from '_services/CallAPI';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useAuth } from '_contexts/auth';
import { validGST } from '_helper/regex';
import Axios from 'axios';

function ProfileSetup(props) {
  const { setShowProfileSetup, setDealerInfo, registerData, setMobileNumber } = props;
  const [statesData, setStatesData] = useState(null);
  const [citiesData, setCitiesData] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userCompany, setUserCompany] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [stateId, setStateId] = useState(null);
  const [cityId, setCityId] = useState(null);
  const [pincode, setPincode] = useState(null);
  const [gstNumber, setGstNumber] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState(false);
  const { setIsLoggedIn } = useAuth();
  const [errorMessage, setErrorMessage] = useState({
    name: '',
    company_name: '',
    address: '',
    state: '',
    city: '',
    pincode: '',
    gst_number: '',
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

  useEffect(() => {
    getStates();
  }, []);

  function getStates() {
    const params = {
      country_id: 1,
    };
    callAPI('POST', process.env.STATES_DATA, params, (res) => {
      if (res.status) {
        const data = res['data'];
        setStatesData(data.states);
      }
    });
  }

  function selectState(event) {
    setStateId(event.target.value);
    const params = {
      state_id: event.target.value,
    };
    callAPI('POST', process.env.CITIES_DATA, params, (res) => {
      if (res.status) {
        const data = res['data'];
        setCitiesData(data.cities);
      }
    });
  }

  function renderStates() {
    return statesData.map((item, key) => (
      <option key={key} value={item.id}>
        {item.name}
      </option>
    ));
  }

  function renderCities() {
    return citiesData.map((item, key) => (
      <option key={key} value={item.id}>
        {item.name}
      </option>
    ));
  }

  const fileRef = useRef();
  const imgRef = useRef();
  let reader;

  useEffect(() => {
    reader = new FileReader();
    reader.onload = function (e) {
      imgRef.current.src = e.target.result;
    };
  }, [profileImage]);

  useEffect(() => {
    if (profileImage) {
      reader.readAsDataURL(profileImage);
    }
  }, [profileImage]);

  function formValidation() {
    let nameMsg = '';
    let companyMsg = '';
    let addressMsg = '';
    let stateMsg = '';
    let cityMsg = '';
    let pincodeMsg = '';
    let gstMsg = '';

    let isValid = false;

    if (!userName) {
      nameMsg = 'Please enter your name';
    }
    // if (userName.length < 3) {
    //   nameMsg = 'The name must be at least 3 characters';
    // }
    if (!userCompany) {
      companyMsg = 'Please enter company name';
    }
    if (!userAddress) {
      addressMsg = 'Please enter address';
    }
    if (!stateId) {
      stateMsg = 'Please enter state name';
    }
    if (!cityId) {
      cityMsg = 'Please enter city name';
    }
    if (!pincode) {
      pincodeMsg = 'Please enter pincode';
    }
    if (!gstNumber) {
      gstMsg = 'Please enter gst number';
    }
    if (gstNumber && !validGST.test(gstNumber)) {
      gstMsg = 'Please enter valid gst number';
    }

    if (!nameMsg && !companyMsg && !addressMsg && !stateMsg && !cityMsg && !pincodeMsg && !gstMsg) {
      isValid = true;
    }
    if (isValid) {
      setError(true);
      setErrorMessage({
        name: '',
        company_name: '',
        address: '',
        state: '',
        city: '',
        pincode: '',
        gst_number: '',
      });
      return true;
    } else {
      setError(true);
      setErrorMessage({
        name: nameMsg,
        company_name: companyMsg,
        address: addressMsg,
        state: stateMsg,
        city: cityMsg,
        pincode: pincodeMsg,
        gst_number: gstMsg,
      });
      return false;
    }
  }

  async function submitProfile() {
    if (formValidation()) {
      const params = {
        name: userName,
        company_name: userCompany,
        address: userAddress,
        state: stateId,
        city: cityId,
        pincode: pincode,
        gst_number: gstNumber,
        profile_image: profileImage,
      };
      const _headers = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'api-version': 'v1',
          Authorization: `Bearer ${Cookies.get('user_token')}`,
        },
      };
      const formData = new FormData();
      Object.keys(params).forEach((key) => formData.append(key, params[key]));
      const response = await Axios.post(`${process.env.BASE_API_URL}update-dealer-info`, formData, _headers);
      const res = response.data;
      if (res.code == 200) {
        const data = res['data'];
        setDealerInfo(data);
        Cookies.remove('user_token');
        Cookies.set('access_token', registerData.access_token);
        setIsLoggedIn(true);
        setShowProfileSetup(false);
        toastConfig['type'] = 'success';
        toast('Login Successfully', toastConfig);
        setMobileNumber(null);
      } else {
        const errorData = res['data'];
        toast.error(errorData._message, toastConfig);
      }
    }
  }

  return (
    <>
      <Modal show={true} className="login-modal about-you-modal">
        <Modal.Body>
          <div className="login-content login-profile-content pt-4">
            <h4 className="text-center fw-600 fs-32 text-black">Dealer Profile Setup</h4>
            <div className="pt-4">
              <div className="row">
                <div className="mb-4 col-lg-12">
                  <div className="outlined-input">
                    <input
                      type="text"
                      name="name"
                      onChange={(event) => setUserName(event.target.value)}
                      className="w-100 profile-input"
                      placeholder=" "
                    />
                    <label>Full Name</label>
                  </div>
                  {error && errorMessage.name && <small className="pt-2 text-red">{errorMessage.name}</small>}
                </div>
                <div className="mb-4 col-lg-12">
                  <div className="outlined-input">
                    <input
                      type="text"
                      name="company_name"
                      className="w-100"
                      onChange={(event) => setUserCompany(event.target.value)}
                      placeholder=" "
                    />
                    <label>Company Name</label>
                  </div>
                  {error && errorMessage.company_name && (
                    <small className="pt-2 text-red">{errorMessage.company_name}</small>
                  )}
                </div>
                <div className="mb-4 col-lg-12">
                  <div className="outlined-input">
                    <input
                      type="text"
                      name="address"
                      className="w-100"
                      onChange={(event) => setUserAddress(event.target.value)}
                      placeholder=" "
                    />
                    <label>Address</label>
                  </div>
                  {error && errorMessage.address && <small className="pt-2 text-red">{errorMessage.address}</small>}
                </div>
                <div className="mb-4 col-lg-12">
                  <div className="outlined-select">
                    <select onChange={selectState} name="state" required>
                      <option disabled selected></option>
                      {statesData && renderStates()}
                    </select>
                    <label className="fs-16">State</label>
                  </div>
                  {error && errorMessage.state && <small className="pt-2 text-red">{errorMessage.state}</small>}
                </div>
                <div className="mb-4 col-lg-12">
                  <div className="outlined-select">
                    <select required onChange={(event) => setCityId(event.target.value)} name="city">
                      <option disabled selected></option>
                      {citiesData && renderCities()}
                    </select>
                    <label className="fs-16">City</label>
                  </div>
                  {error && errorMessage.city && <small className="pt-2 text-red">{errorMessage.city}</small>}
                </div>
                <div className="mb-4 col-lg-12">
                  <div className="outlined-input">
                    <input
                      type="number"
                      name="pincode"
                      className="w-100"
                      onChange={(event) => setPincode(event.target.value)}
                      placeholder=" "
                    />
                    <label>Pincode</label>
                  </div>
                  {error && errorMessage.pincode && <small className="pt-2 text-red">{errorMessage.pincode}</small>}
                </div>
                <div className="mb-3 col-lg-12">
                  <div className="outlined-input">
                    <input
                      type="text"
                      name="gst_number"
                      className="w-100 text-uppercase"
                      onChange={(event) => setGstNumber(event.target.value.toUpperCase())}
                      maxLength={15}
                      placeholder=" "
                    />
                    <label>GST Number</label>
                  </div>
                  {error && errorMessage.gst_number && (
                    <small className="pt-2 text-red">{errorMessage.gst_number}</small>
                  )}
                </div>
              </div>
              <div className="profile-picture mb-4">
                <p htmlFor="" className="mb-3 text-black fw-600 fs-16">
                  Profile picture
                </p>
                <div className="upload-wrapper">
                  <div className="cursor-pointer upload-label d-flex align-items-center">
                    {(profileImage && (
                      <img
                        ref={imgRef}
                        alt="Upload Image"
                        className="me-3 img-fluid rounded-circle preview-profile"
                        width={73}
                        height={73}
                      />
                    )) || <img src="/images/upload-avtar.svg" alt="Upload Image" className="me-3" />}
                    <div>
                      <span className="text-red fs-15 fw-600 cursor-pointer">Upload your photo</span>
                      <p className="fs-13 label-color-3 mb-0 mt-1">
                        Image should be in jpg or png format and file size should be up to 2MB.
                      </p>
                    </div>
                  </div>
                  <input
                    type="file"
                    name="profile_image"
                    className="upload-box"
                    ref={fileRef}
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        setProfileImage(e.target.files[0]);
                      }
                    }}
                    accept=".png, .gif, .jpeg, .svg"
                    placeholder="Upload File"
                  />
                </div>
              </div>
              <button
                className="w-100 mb-4 shadow-none text-white login-btn outline-none rounded bg-blue mt-3 fs-16 fw-600"
                title="Continue"
                onClick={submitProfile}
              >
                Continue
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ProfileSetup;
