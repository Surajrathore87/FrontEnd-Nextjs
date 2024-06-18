import React, { useState } from 'react';
import { callAPI } from '_services/CallAPI';
import dynamic from 'next/dynamic';
import { Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { validEmail } from '_helper/regex';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faMapMarkerAlt, faMobileAlt } from '@fortawesome/free-solid-svg-icons';

function ContactUs(props) {
  const { contactPageData } = props;
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userMobile, setUserMobile] = useState(null);
  const [userSubject, setUserSubject] = useState(null);
  const [userMessage, setUserMessage] = useState(null);
  const [submitLoader, setSubmitLoader] = useState(false);
  const [error, setError] = useState(false);
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
    email: '',
    mobile: '',
    subject: '',
    message: '',
  });

  function formValidation() {
    let nameMsg = '';
    let emailMsg = '';
    let mobileMsg = '';
    let subjectMsg = '';
    let messageMsg = '';

    let isValid = false;

    if (!userName) {
      nameMsg = 'Please enter your name';
    }
    if (!userEmail) {
      emailMsg = 'Please enter email address';
    }
    if (userEmail && !validEmail.test(userEmail)) {
      emailMsg = 'Please enter valid email';
    }
    if (userMobile) {
      if (String(userMobile).length !== 10) {
        mobileMsg = 'Mobile number must be 10 digits only';
      }
    }
    if (!userMobile) {
      mobileMsg = 'Please enter mobile number';
    }
    if (!userSubject) {
      subjectMsg = 'Please enter subject';
    }
    if (!userMessage) {
      messageMsg = 'Please enter message';
    }

    if (!nameMsg && !emailMsg && !mobileMsg && !subjectMsg && !messageMsg) {
      isValid = true;
    }

    if (isValid) {
      setError(true);
      setErrorMessage({
        name: '',
        email: '',
        mobile: '',
        subject: '',
        message: '',
      });
      return true;
    } else {
      setError(true);
      setErrorMessage({
        name: nameMsg,
        email: emailMsg,
        mobile: mobileMsg,
        subject: subjectMsg,
        message: messageMsg,
      });
      return false;
    }
  }

  const maxLengthCheck = (object) => {
    if (object.target.value.length > object.target.maxLength) {
      object.target.value = object.target.value.slice(0, object.target.maxLength);
    }
  };

  function submitContact() {
    if (formValidation()) {
      const params = {
        sender_name: userName,
        sender_email: userEmail,
        sender_mobile: userMobile,
        subject: userSubject,
        message: userMessage,
      };
      setSubmitLoader(true);
      callAPI('POST', process.env.CONTACT_US_FORM, params, (res) => {
        if (res.status) {
          toast.success(res['message'], toastConfig);
          setSubmitLoader(false);
          setUserName(null);
          setUserEmail(null);
          setUserMobile(null);
          setUserSubject(null);
          setUserMessage(null);
        } else {
          toast.error(res['message'], toastConfig);
          setSubmitLoader(false);
        }
      });
    }
  }

  return (
    <>
      <section>
        <div className="container">
          <div className="row py-5">
            <div className="col-lg-6 d-fle align-items-center justify-content-center">
              <h1 className="inner-heading mb-5">Contact Us</h1>
              <div className="text-center">
                {/* <img src="/images/contact-us.svg" width={350} className="img-fluid mb-4" />
                <p className="label-color-1 mb-0">
                  Thank you for your interest in DsignDpo. Please fill out the form or{' '}
                </p>
                <p className="label-color-1 mb-0">
                  e-mail and we will get back to you promptly regarding your request.
                </p> */}

                <div className="d-flex align-items-center">
                  <div className="border rounded-circle icon-contact me-3 bg-blue">
                    <FontAwesomeIcon icon={faMobileAlt} width="16" className="text-white" />
                  </div>
                  <div className="text-start">
                    <h6 className="label-color-1 mb-1 fw-500">Helpline No.</h6>
                    <a
                      className="decoration-none label-color-2 fw-500 fs-17"
                      href={`tel: +91${contactPageData.data.mobile_no}`}
                    >
                      +91 {''}
                      {contactPageData.data.mobile_no}
                    </a>
                  </div>
                </div>
                <div className="d-flex align-items-center my-5">
                  <div className="border rounded-circle icon-contact me-3 bg-blue">
                    <FontAwesomeIcon icon={faEnvelope} width="16" className="text-white" />
                  </div>
                  <div className="text-start">
                    <h6 className="label-color-1 mb-1 fw-500">Email: </h6>
                    <a className="decoration-none label-color-2 fw-500 fs-17" href={`mailto:${contactPageData.data.email}`}>
                      {contactPageData.data.email}
                    </a>
                  </div>
                </div>
                <div className="d-flex align-items-center mb-5 mb-lg-0">
                  <div className="border rounded-circle icon-contact me-3 bg-blue">
                    <FontAwesomeIcon icon={faMapMarkerAlt} width="16" className="text-white" />
                  </div>
                  <div className="text-start address-icon">
                    <h6 className="label-color-1 mb-1 fw-500">Address: </h6>
                    <span className="label-color-2 fw-500 fs-17"> {contactPageData.data.address}</span>
                  </div>
                </div>
              </div>
            </div>
            {/* {contactPageData && (
                <div className="contact-details pe-lg-5">
                  <h2 className="fs-24 label-color-2 fw-600 mb-3">{contactPageData.data.name}</h2>
                  <p className="fs-17 fw-500 label-color-1">
                    Address: <span className="label-color-2 fw-500 fs-17 ps-2">{contactPageData.data.address}</span>
                  </p>
                  <p className="fs-17 fw-500 label-color-1">
                    Email:
                    <a
                      className="decoration-none label-color-2 fw-500 fs-17 ps-2"
                      href={`mailto:${contactPageData.data.email}`}
                    >
                      {contactPageData.data.email}
                    </a>
                  </p>
                  <p className="fs-17 fw-500 label-color-1">
                    Mobile:
                    <a
                      className="decoration-none label-color-2 fw-500 fs-17 ps-2"
                      href={`tel:${contactPageData.data.mobile_no}`}
                    >
                      {contactPageData.data.mobile_no}
                    </a>
                    ,
                    <a
                      className="decoration-none label-color-2 fw-500 fs-17 ps-2"
                      href={`tel:${contactPageData.data.helpline_no}`}
                    >
                      {contactPageData.data.helpline_no}
                    </a>
                  </p>
                </div>
              )} */}

            <div className="col-lg-6">
              <div className="contact-form p-4">
                <h2 className="fs-20 mb-2 fw-500 label-color-2">Have a question?</h2>
                <p className="label-color-1 mb-3">Write to us!</p>
                <div className="row">
                  <div className="col-lg-6">
                    <div className="mb-4">
                      <div className="outlined-input">
                        <input
                          type="text"
                          name="name"
                          onChange={(event) => setUserName(event.target.value)}
                          className="w-100 profile-input"
                          value={userName || ''}
                          placeholder=" "
                        />
                        <label>Full Name</label>
                      </div>
                      {error && errorMessage.name && <small className="pt-2 text-red">{errorMessage.name}</small>}
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-4">
                      <div className="outlined-input">
                        <input
                          type="email"
                          name="email"
                          onChange={(event) => setUserEmail(event.target.value)}
                          className="w-100 profile-input"
                          value={userEmail || ''}
                          placeholder=" "
                        />
                        <label>Email Address</label>
                      </div>
                      {error && errorMessage.email && <small className="pt-2 text-red">{errorMessage.email}</small>}
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-4">
                      <div className="outlined-input">
                        <input
                          type="number"
                          id="phone-number"
                          maxLength="10"
                          onInput={maxLengthCheck}
                          className="w-100 profile-input"
                          placeholder=" "
                          value={userMobile || ''}
                          onChange={(e) => setUserMobile(e.target.value)}
                        />
                        <label>Mobile Number</label>
                      </div>
                      {error && errorMessage.mobile && <small className="pt-2 text-red">{errorMessage.mobile}</small>}
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-4">
                      <div className="outlined-select">
                        <select
                          required
                          onChange={(e) => setUserSubject(e.target.value)}
                          value={userSubject || ''}
                          name="subject"
                        >
                          <option className="visibility-hidden"></option>
                          <option value={'Design quote'}>Design quote</option>
                          <option value={'Payment and purchase'}>Payment and purchase</option>
                          <option value={'Other'}>Other</option>
                        </select>
                        <label className="fs-16">Subject</label>
                      </div>
                      {error && errorMessage.subject && <small className="pt-2 text-red">{errorMessage.subject}</small>}
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="mb-4">
                      <div className="outlined-input">
                        <textarea
                          type="text"
                          name="message"
                          onChange={(event) => setUserMessage(event.target.value)}
                          className="w-100 profile-input resize-none"
                          value={userMessage || ''}
                          placeholder=" "
                          rows={3}
                        ></textarea>
                        <label>Message</label>
                      </div>
                      {error && errorMessage.message && <small className="pt-2 text-red">{errorMessage.message}</small>}
                    </div>
                  </div>
                  <div className="col-12 text-center">
                    <button
                      className="blue-btn btn shadow-none fs-16 fw-600 contact-submit"
                      title="Submit"
                      disabled={submitLoader}
                      onClick={submitContact}
                    >
                      Submit
                      {submitLoader && <Spinner animation="border" variant="light" className="ms-2" size="sm" />}
                    </button>
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
ContactUs.propTypes = {
  contactPageData: PropTypes.object,
};

export default ContactUs;
