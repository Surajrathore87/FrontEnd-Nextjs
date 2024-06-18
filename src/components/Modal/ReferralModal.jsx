import {
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from 'react-share';
import React from 'react';
import { Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { copyToClipboard } from '_helper/copyToClipboard';
import { useAuth } from '_contexts/auth';

function ReferralModal(props) {
  const { setShowReferModal } = props;
  const { userDetails } = useAuth();
  const toastConfig = {
    position: 'bottom-left',
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  const referralLink = process.env.WEBSITE_URL + '/?refCode=' + userDetails.referral_code;
  const msgTextSocial = `Hey there, Sign up on DsignDpo for interesting designs.`;

  function copyLink() {
    copyToClipboard(referralLink);
    setShowReferModal(false);
    toast.success('Copied to Clipboard', toastConfig);
  }

  return (
    <Modal show={true} onHide={setShowReferModal} centered>
      <Modal.Body className="text-center d-flex align-items-center justify-content-center">
        <button
          onClick={() => setShowReferModal(false)}
          className="border-0 outline-none bg-transparent cross-btn p-0 position-absolute top-0 end-0 mt-3 me-3"
        >
          <img src="/images/filter-close-icon.png" alt="Close" width={35} />
        </button>

        <div className="text-center pt-5 px-3 pb-4">
          <h4 className="label-color-2 fs-18 fw-500 mb-3">Share your referral code</h4>
          <p className="fs-15 labe;-color-1">Share DsignDpo referral to your friend and get connected on DsignDpo.</p>
          <h6 className="label-color-2 text-start fs-15 mt-4 pt-2">Share your invite code</h6>
          <div className="my-2 position-relative add-folder">
            <input
              className="form-control fs-13 label-color-1 shadow-none border bg-white"
              value={referralLink}
              type="text"
              id="invite-code"
              readOnly
            />
            <button className="blue-btn fs-14 px-3 position-absolute end-0 top-0 shadow-none py-0" onClick={copyLink}>
              Copy link
            </button>
          </div>
          <div className="pt-4">
            <h6 className="label-color-2 fs-15 mb-3">Share via Social Media</h6>
            <div className="d-flex align-items-center justify-content-center">
              <a className="decoration-none d-block mx-1">
                <WhatsappShareButton
                  url={referralLink}
                  title={msgTextSocial}
                  separator=""
                  className="Demo__some-network__share-button"
                >
                  <WhatsappIcon size={32} round />
                </WhatsappShareButton>
              </a>
              <a className="decoration-none d-block mx-1">
                <FacebookShareButton
                  url={referralLink}
                  quote={msgTextSocial + ' ' + referralLink}
                  className="Demo__some-network__share-button"
                >
                  <FacebookIcon size={32} round />
                </FacebookShareButton>
              </a>
              <a className="decoration-none d-block mx-1">
                <TwitterShareButton
                  url={referralLink}
                  title={msgTextSocial}
                  className="Demo__some-network__share-button"
                >
                  <TwitterIcon size={32} round />
                </TwitterShareButton>
              </a>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default ReferralModal;
