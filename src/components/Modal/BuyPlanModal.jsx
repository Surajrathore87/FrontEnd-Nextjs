import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';
import { Modal } from 'react-bootstrap';

function BuyPlanModal(props) {
  const { errorMessage, setShowBuyPlan } = props;
  return (
    <Modal show={true} onHide={setShowBuyPlan} centered>
      <Modal.Body className="text-center d-flex align-items-center justify-content-center">
        <button
          onClick={() => setShowBuyPlan(false)}
          className="border-0 outline-none bg-transparent cross-btn p-0 position-absolute top-0 end-0 mt-3 me-3"
        >
          <img src="/images/filter-close-icon.png" alt="Close" width={35} />
        </button>
        <div className="text-center pt-5">
          <FontAwesomeIcon icon={faInfoCircle} height={50} width={50} className="text-red mb-4 fs-55" />
          <p className="fs-17 fw-500 label-color-2">{errorMessage && errorMessage}</p>
          <div className="text-center py-3">
            <Link href={'/plans'}>
              <a
                onClick={() => setShowBuyPlan(false)}
                className="decoration-none btn blue-btn fs-15 px-4 py-2 mx-2 fw-500"
              >
                Buy Plan
              </a>
            </Link>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default BuyPlanModal;
