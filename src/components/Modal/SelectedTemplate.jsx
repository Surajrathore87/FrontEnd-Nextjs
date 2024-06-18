import { faEnvelope, faMapMarkerAlt, faPhoneAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TemplatesLoader from 'components/Loaders/TemplatesLoader';
import React from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import Skeleton from 'react-loading-skeleton';
import { useAuth } from '_contexts/auth';

function SelectedTemplate(props) {
  const {
    setShowSelected,
    mainTempPath,
    mainImage,
    linksPosition,
    logoPosition,
    templatesPath,
    tempInnerImage,
    setMainImage,
    setShowTemplateUsers,
  } = props;
  const { userDetails } = useAuth();
  function selectUsersToSend() {
    setShowTemplateUsers(true);
    setShowSelected(false);
  }
  // const imgName = mainImage.split('.')[0];
  return (
    <>
      <Modal show={true} onHide={setShowSelected} centered contentClassName="border-0" size="lg">
        <Modal.Body className="border-0">
          <button
            onClick={() => setShowSelected(false)}
            className="border-0 outline-none bg-transparent cross-btn p-0 position-absolute top-0 end-0 mt-3 me-3"
          >
            <img src="/images/filter-close-icon.png" alt="Close" width={35} />
          </button>
          <h5 className="m-0 label-color-2 fw-500">Template Preview</h5>
          <div className="text-center py-4 user-select-none">
            <div
              // style={{ backgroundImage: `url(${templatesPath + tempInnerImage})` }}
              className="selected-template position-relative mx-auto mt-3"
            >
              {(mainImage == '' && (
                <div className="m-2 d-inline-block temp-frame-img-loader">
                  <Skeleton />
                </div>
              )) || (
                <div
                  className="position-absolute temp-frame-img"
                  style={{ backgroundImage: `url(${mainTempPath + mainImage})` }}
                >
                  {/* <div
                  style={{
                    top: '0.5rem',
                    left: `${(logoPosition == 'TOP_LEFT' && '0.5rem') || 'unset'}`,
                    right: `${(logoPosition == 'TOP_LEFT' && 'unset') || '0.5rem'}`,
                  }}
                  className="position-absolute"
                >
                  <img
                    src={userDetails.image_path + userDetails.logo_image}
                    alt="Logo"
                    height={40}
                    className="img-fluid template-logo"
                  />
                </div>
                <div
                  style={{
                    top: '0.5rem',
                    left: `${(linksPosition == 'TOP_LEFT' && '0.5rem') || 'unset'}`,
                    right: `${(linksPosition == 'TOP_LEFT' && 'unset') || '0.5rem'}`,
                  }}
                  className={`position-absolute ${(linksPosition == 'TOP_LEFT' && 'text-start') || 'text-end'}`}
                >
                  <p className="m-0 text-black fw-100 fs-13 mb-1">
                    <img src="/images/instagram.png" alt="instagram" width={17} className="me-1" />
                    {userDetails.instagram_link}
                  </p>
                  <p className="m-0 text-black fw-100 fs-13 mb-1">
                    <img src="/images/youtube.png" alt="Youtube" width={17} className="me-1" />
                    {userDetails.youtube_link}
                  </p>
                </div>
                <div
                  className="position-absolute w-100 text-white text-start fs-11 p-2 bottom-of-template"
                  style={{
                    bottom: '0',
                    left: '0',
                  }}
                >
                  {(imgName == 3 && <p className={`mb-2 px-2 pt-1 fs-14 text-center contact-p`}>Contact Us</p>) || ''}
                  <p
                    className={`mb-0 px-lg-2 pt-1
                  ${(imgName == 2 && 'text-center') || ''}
                  ${(imgName == 3 && 'text-center') || ''}
                  ${(imgName == 4 && 'text-center text-black mb-1') || ''}
                  `}
                  >
                    {userDetails.mobile_number && (
                      <span>
                        <FontAwesomeIcon icon={faPhoneAlt} width={11} className="me-1" /> {userDetails.mobile_number}
                      </span>
                    )}
                    {userDetails.email && (
                      <span className="ps-2">
                        <FontAwesomeIcon icon={faEnvelope} width={11} className="me-1" /> {userDetails.email}
                      </span>
                    )}
                  </p>
                  <p
                    className={`px-lg-2 line-clamp-1 pt-2 temp-address
                   ${(imgName == 3 && 'text-black') || ''}
                   ${(imgName == 4 && 'text-black') || ''}
                  `}
                  >
                    {userDetails.address && (
                      <span>
                        <FontAwesomeIcon icon={faMapMarkerAlt} width={10} className="me-1 fs-10" />{' '}
                        {userDetails.address}
                      </span>
                    )}
                  </p>
                </div> */}
                </div>
              )}
            </div>
            <button
              className="btn shadow-none red-btn px-4 py-2 fs-16 mt-4 mx-2"
              onClick={() => setShowSelected(false)}
            >
              Cancel
            </button>
            <button className="btn shadow-none blue-btn px-4 py-2 fs-16 fw-500 mt-4 mx-2" onClick={selectUsersToSend}>
              Share
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
export default SelectedTemplate;
