import { faClock, faPencilAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Axios from 'axios';
import Cookies from 'js-cookie';
import dynamic from 'next/dynamic';
import React, { useEffect, useRef, useState } from 'react';
import { Col, Nav, Row, Tab } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAuth } from '_contexts/auth';
import { callAPI } from '_services/CallAPI';
import ImageCropModal from './Modal/ImageCropModal';

const PageLoader = dynamic(import('components/Loaders/PageLoader'));
const MySubscription = dynamic(import('components/MySubscription'));

function MyProfile() {
  const [isLoading, setIsLoading] = useState(true);
  const [showImageCrop, setShowImageCrop] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [statesData, setStatesData] = useState(null);
  const [citiesData, setCitiesData] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [address, setAddress] = useState(null);
  const [stateId, setStateId] = useState(null);
  const [pincode, setPincode] = useState(null);
  const [ytLink, setYtLink] = useState(null);
  const [instaLink, setInstaLink] = useState(null);
  const [facebookLink, setFacebookLink] = useState(null);
  const [webSiteUrlLink, setWebSiteUrlLink] = useState(null);
  const [companyLogo, setCompanyLogo] = useState('');
  const [cityId, setCityId] = useState(null);
  const [error, setError] = useState(false);
  const [isFormChanged, setIsFormChanged] = useState(false);
  const { userDetails, isLoggedIn, getUserDetails } = useAuth();
  const toastConfig = {
    position: 'bottom-left',
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };
  const [errorMessage, setErrorMessage] = useState({
    name: '',
    state: '',
    city: '',
    pincode: '',
  });

  useEffect(() => {
    getStates();
  }, [userDetails]);

  useEffect(() => {
    if (userDetails) {
      getCities();
    }
  }, [userDetails]);

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

  function getCities() {
    if (userDetails && userDetails.state) {
      const params = {
        state_id: userDetails.state.id || '',
      };
      callAPI('POST', process.env.CITIES_DATA, params, (res) => {
        if (res.status) {
          const data = res['data'];
          setCitiesData(data.cities);
        }
      });
    }
  }

  function selectState(event) {
    setStateId(event.target.value);
    setCityId(null);
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
    if (userDetails) {
      setIsLoading(false);
      setUserName(userDetails.name);
      setUserEmail(userDetails.email);
      setCityId((userDetails.city && userDetails.city.id) || null);
      setStateId((userDetails.state && userDetails.state.id) || null);
      setPincode(userDetails.pincode);
      setAddress(userDetails.address);
      setProfileImage(userDetails.profileImage);
      setInstaLink(userDetails.instagram_link);
      setYtLink(userDetails.youtube_link);
      setCompanyLogo(userDetails.logo_image);
      setFacebookLink(userDetails.facebook_link);
      setWebSiteUrlLink(userDetails.website);
    }
  }, [userDetails]);

  useEffect(() => {
    if (!isFormChanged) {
      setIsFormChanged(true);
    }
  }, [userName, address, stateId, cityId, pincode, profileImage]);

  useEffect(() => {
    if (profileImage) {
      reader.readAsDataURL(profileImage);
    }
  }, [profileImage]);

  function formValidation() {
    let nameMsg = '';
    let addressMsg = '';
    let stateMsg = '';
    let cityMsg = '';
    let pincodeMsg = '';
    let companyLogoMsg = '';
    let isValid = false;

    if (!userName) {
      nameMsg = 'Please enter your name';
    }
    // if (userName.length < 3) {
    //   nameMsg = 'The name must be at least 3 characters';
    // }
    if (!address) {
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

    if (companyLogo) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (allowedTypes.indexOf(companyLogo.type) === -1) {
        companyLogoMsg = 'Invalid file type. Only JPEG and PNG allowed.';
      }
    }

    if (!nameMsg && !addressMsg && !stateMsg && !cityMsg && !pincodeMsg && !companyLogoMsg) {
      isValid = true;
    }
    if (isValid) {
      setError(true);
      setErrorMessage({
        name: '',
        address: '',
        state: '',
        city: '',
        pincode: '',
        companyLogo: '',
      });
      return true;
    } else {
      setError(true);
      setErrorMessage({
        name: nameMsg,
        address: addressMsg,
        state: stateMsg,
        city: cityMsg,
        pincode: pincodeMsg,
        companyLogo: companyLogoMsg,
      });
      return false;
    }
  }

  async function submitProfile() {
    if (formValidation()) {
      const params = {
        name: userName,
        email: userEmail || '',
        state_id: stateId,
        address: address,
        city_id: cityId,
        pincode: pincode,
        profile_image: profileImage,
        company_logo: companyLogo,
        instagram_link: instaLink || '',
        youtube_link: ytLink || '',
        facebook_link: facebookLink || '',
        website: webSiteUrlLink || '',
      };
      const _headers = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'api-version': 'v1',
          Authorization: `Bearer ${Cookies.get('access_token')}`,
        },
      };
      const formData = new FormData();
      Object.keys(params).forEach((key) => formData.append(key, params[key]));
      const response = await Axios.post(`${process.env.BASE_API_URL}users/update-profile`, formData, _headers);
      const res = response.data;
      if (res.code == 200) {
        setIsFormChanged(false);
        getUserDetails();
        toast.success(res.data._message, toastConfig);
      } else {
        toast.success(res.data._message, toastConfig);
      }
    }
  }
  return (
    <>
      {showImageCrop && (
        <ImageCropModal
          setShowImageCrop={setShowImageCrop}
          profileImage={profileImage}
          setProfileImage={setProfileImage}
        />
      )}
      {!isLoading && userDetails && (
        <section className="my-profile-section">
          <div className="container pt-lg-5 pt-4">
            <div className="row">
              <div className="col-12">
                <h1 className="inner-heading mb-4">Profile</h1>
              </div>
              <div className="col-12 pb-5 profile-container">
                <Tab.Container defaultActiveKey="profileTab">
                  <Row className="h-100">
                    <Col lg={3} className="h-100">
                      <Nav className="flex-column profile-nav h-100 d-block d-lg-flex">
                        <div className="border-bottom p-lg-4 p-3 text-center">
                          <div
                            className="rounded-circle nav-profile-image mx-auto mb-3"
                            style={{
                              backgroundImage: `url(${
                                (userDetails.profile_image && userDetails.image_path + userDetails.profile_image) ||
                                '/images/avatar-icon.jpg'
                              })`,
                            }}
                          ></div>
                          <h5 className="label-color-2 fw-600 line-clamp-1">{userDetails.name}</h5>
                          <p className="label-color-1 fw-500 fs-14 m-0">{userDetails.role_name}</p>
                        </div>
                        <Nav.Item>
                          <Nav.Link
                            className="py-3 px-lg-4 decoration-none label-color-2 w-100 fw-500 cursor-pointer border-bottom"
                            eventKey="profileTab"
                          >
                            <FontAwesomeIcon icon={faUser} className="fs-16" width={16} />{' '}
                            <span className="ps-1">My Profile</span>
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link
                            className="py-3 px-lg-4 decoration-none label-color-2 w-100 fw-500 cursor-pointer border-bottom"
                            eventKey="subsTab"
                          >
                            <FontAwesomeIcon icon={faClock} className="fs-16" width={16} />{' '}
                            <span className="ps-1">My Subscriptions</span>
                          </Nav.Link>
                        </Nav.Item>
                      </Nav>
                    </Col>
                    <Col lg={9} className="h-100">
                      <Tab.Content className="h-100">
                        <Tab.Pane eventKey="profileTab" className="h-100">
                          <div className="row h-100">
                            <div className="col-12">
                              <div className="w-100 h-100 bg-white rounded-6 main-shadow p-4 main-border">
                                <span className="fs-16 label-color-2 fw-600 d-block text-lg-end text-center mb-3">
                                  Available Credits:
                                  <img
                                    src="/images/credit-icon.png"
                                    style={{ minHeight: 'unset' }}
                                    height={30}
                                    width={30}
                                    className="img-fluid mb-1 ms-2 me-1"
                                  />
                                  {userDetails && userDetails.wallet_credits}
                                </span>
                                <div className="profile-box mx-auto">
                                  <div className="profile-picture mb-4">
                                    <div className="upload-wrapper">
                                      <div
                                        className="upload-label d-flex align-items-center justify-content-center
                                      w-max-content mx-auto"
                                      >
                                        {(profileImage && (
                                          <img
                                            ref={imgRef}
                                            alt="Upload Image"
                                            className="img-fluid rounded-circle preview-profile"
                                            width={150}
                                            height={150}
                                          />
                                        )) || (
                                          <img
                                            src={
                                              (userDetails &&
                                                userDetails.profile_image &&
                                                userDetails.image_path + userDetails.profile_image) ||
                                              '/images/upload-avtar.svg'
                                            }
                                            alt="Upload Image"
                                            width={150}
                                            height={150}
                                            className="img-fluid rounded-circle"
                                          />
                                        )}
                                        <span
                                          className="d-flex align-items-center justify-content-center cursor-pointer
                                          bg-blue rounded-circle fs-11 text-white position-absolute edit-profile-icon"
                                          onClick={() => setShowImageCrop(true)}
                                        >
                                          <FontAwesomeIcon icon={faPencilAlt} width={11} />
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row">
                                    <div className="mb-3 col-lg-6">
                                      <label htmlFor="name" className="label-color-1 fw-500 mb-2 fs-15">
                                        Name
                                      </label>
                                      <input
                                        type="text"
                                        id="name"
                                        minLength={3}
                                        className="form-control"
                                        defaultValue={userDetails && userDetails.name}
                                        onChange={(event) => setUserName(event.target.value)}
                                        placeholder="Enter your name"
                                      />
                                      {error && errorMessage.name && (
                                        <small className="pt-2 text-red">{errorMessage.name}</small>
                                      )}
                                    </div>
                                    <div className="mb-3 col-lg-6">
                                      <label htmlFor="mobile" className="label-color-1 fw-500 mb-2 fs-15">
                                        Mobile number
                                      </label>
                                      <input
                                        id="mobile"
                                        type="number"
                                        className="form-control"
                                        defaultValue={userDetails && userDetails.mobile_number}
                                        disabled
                                      />
                                    </div>
                                    <div className="mb-3 col-lg-6">
                                      <label htmlFor="email" className="label-color-1 fw-500 mb-2 fs-15">
                                        Email (Optional)
                                      </label>
                                      <input
                                        id="email"
                                        type="email"
                                        className="form-control"
                                        defaultValue={userDetails && userDetails.email}
                                        onChange={(event) => setUserEmail(event.target.value)}
                                        placeholder="Enter your email"
                                      />
                                    </div>
                                    {userDetails.role_name == 'Dealer' && (
                                      <div className="mb-3 col-lg-6">
                                        <label htmlFor="mobile" className="label-color-1 fw-500 mb-2 fs-15">
                                          Company name
                                        </label>
                                        <input
                                          id="gst"
                                          type="text"
                                          className="form-control"
                                          defaultValue={userDetails.role_name == 'Dealer' && userDetails.company_name}
                                          disabled
                                        />
                                      </div>
                                    )}
                                    {userDetails.role_name == 'Dealer' && (
                                      <div className="mb-3 col-lg-6">
                                        <label htmlFor="mobile" className="label-color-1 fw-500 mb-2 fs-15">
                                          GST number
                                        </label>
                                        <input
                                          id="gst"
                                          type="text"
                                          className="form-control"
                                          defaultValue={userDetails.role_name == 'Dealer' && userDetails.gst_number}
                                          disabled
                                        />
                                      </div>
                                    )}
                                    <div className="mb-3 col-lg-6">
                                      <label htmlFor="address" className="label-color-1 fw-500 mb-2 fs-15">
                                        Address
                                      </label>
                                      <input
                                        type="text"
                                        id="address"
                                        className="form-control"
                                        defaultValue={userDetails && userDetails.address}
                                        onChange={(event) => setAddress(event.target.value)}
                                        placeholder="Enter your address"
                                      />
                                      {error && errorMessage.address && (
                                        <small className="pt-2 text-red">{errorMessage.address}</small>
                                      )}
                                    </div>
                                    <div className="mb-3 col-lg-6">
                                      <label htmlFor="state" className="label-color-1 fw-500 mb-2 fs-15">
                                        State
                                      </label>
                                      <select
                                        id="state"
                                        className="form-control"
                                        onChange={selectState}
                                        name="state"
                                        required
                                      >
                                        <option selected disabled>
                                          {userDetails && userDetails.state && userDetails.state.name}
                                        </option>
                                        {statesData && renderStates()}
                                      </select>
                                      {error && errorMessage.state && (
                                        <small className="pt-2 text-red">{errorMessage.state}</small>
                                      )}
                                    </div>
                                    <div className="mb-3 col-lg-6">
                                      <label htmlFor="city" className="label-color-1 fw-500 mb-2 fs-15">
                                        City
                                      </label>
                                      <select
                                        id="city"
                                        className="form-control"
                                        required
                                        onChange={(event) => setCityId(event.target.value)}
                                        name="city"
                                      >
                                        <option selected disabled className="visibility-hidden">
                                          {userDetails && userDetails.city && userDetails.city.name}
                                        </option>
                                        {citiesData && renderCities()}
                                      </select>
                                      {error && errorMessage.city && (
                                        <small className="pt-2 text-red">{errorMessage.city}</small>
                                      )}
                                    </div>
                                    <div className="mb-3 col-lg-6">
                                      <label htmlFor="pincode" className="label-color-1 fw-500 mb-2 fs-15">
                                        Pincode
                                      </label>
                                      <input
                                        id="pincode"
                                        type="number"
                                        className="form-control"
                                        defaultValue={userDetails && userDetails.pincode}
                                        onChange={(event) => setPincode(event.target.value)}
                                      />
                                      {error && errorMessage.pincode && (
                                        <small className="pt-2 text-red">{errorMessage.pincode}</small>
                                      )}
                                    </div>
                                    {userDetails && userDetails.role_name == 'Dealer' && (
                                      <>
                                        <div className="mb-3 col-lg-6">
                                          <label htmlFor="insLink" className="label-color-1 fw-500 mb-2 fs-15">
                                            Instagram Id
                                          </label>
                                          <input
                                            type="text"
                                            id="insLink"
                                            minLength={3}
                                            className="form-control"
                                            defaultValue={userDetails && userDetails.instagram_link}
                                            onChange={(event) => setInstaLink(event.target.value)}
                                            placeholder="Instagram link"
                                          />
                                        </div>

                                        <div className="mb-3 col-lg-6">
                                          <label htmlFor="insLink" className="label-color-1 fw-500 mb-2 fs-15">
                                            Facebook
                                          </label>
                                          <input
                                            type="text"
                                            id="insLink"
                                            minLength={3}
                                            className="form-control"
                                            defaultValue={userDetails && userDetails.facebook_link}
                                            onChange={(event) => setFacebookLink(event.target.value)}
                                            placeholder="Facebook link"
                                          />
                                        </div>

                                        <div className="mb-3 col-lg-6">
                                          <label htmlFor="insLink" className="label-color-1 fw-500 mb-2 fs-15">
                                            Website
                                          </label>
                                          <input
                                            type="text"
                                            id="insLink"
                                            minLength={3}
                                            className="form-control"
                                            defaultValue={userDetails && userDetails.website}
                                            onChange={(event) => setWebSiteUrlLink(event.target.value)}
                                            placeholder="Website URL"
                                          />
                                        </div>

                                        <div className="mb-3 col-lg-6">
                                          <label htmlFor="ytLink" className="label-color-1 fw-500 mb-2 fs-15">
                                            YouTube channel
                                          </label>
                                          <input
                                            type="text"
                                            id="ytLink"
                                            minLength={3}
                                            className="form-control"
                                            defaultValue={userDetails && userDetails.youtube_link}
                                            onChange={(event) => setYtLink(event.target.value)}
                                            placeholder="Youtube link"
                                          />
                                        </div>

                                        <div className="mb-3 col-lg-6">
                                          <div className="">
                                            <label htmlFor="cmpLogo" className="label-color-1 fw-500 mb-2 fs-15">
                                              Company Logo
                                            </label>
                                            <input
                                              type="file"
                                              name="cmpLogo"
                                              className=""
                                              id={'cmpLogo'}
                                              // defaultValue={userDetails && userDetails?.logo_image}
                                              onChange={(e) => {
                                                setCompanyLogo(e.target.files[0]);
                                              }}
                                              accept=".png, .gif, .jpeg"
                                              placeholder="Upload File"
                                            />
                                          </div>
                                          {error && errorMessage.companyLogo && (
                                            <small className="pt-2 text-red">{errorMessage.companyLogo}</small>
                                          )}
                                        </div>
                                      </>
                                    )}
                                  </div>
                                  <div className="text-center">
                                    <button
                                      className="update-btn py-2 mx-auto mb-3 shadow-none outline-none rounded blue-btn mt-3 fs-16 fw-600"
                                      title="Update"
                                      onClick={submitProfile}
                                      disabled={!isFormChanged}
                                    >
                                      Update
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Tab.Pane>
                        <Tab.Pane eventKey="subsTab">
                          <div className="row h-100">
                            <MySubscription />
                          </div>
                        </Tab.Pane>
                      </Tab.Content>
                    </Col>
                  </Row>
                </Tab.Container>
              </div>
            </div>
          </div>
        </section>
      )}
      {isLoading && <PageLoader />}
    </>
  );
}

export default MyProfile;
