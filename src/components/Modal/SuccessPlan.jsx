import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';
import { Modal } from 'react-bootstrap';

function SuccessPlan(props) {
  const { setShowSuccess, purchaseOrderId } = props;

  return (
    <Modal show={true} onHide={setShowSuccess} centered>
      <Modal.Body className="text-center d-flex align-items-center justify-content-center">
        <button
          onClick={() => setShowSuccess(false)}
          className="border-0 outline-none bg-transparent cross-btn p-0 position-absolute top-0 end-0 mt-3 me-3"
        >
          <img src="/images/filter-close-icon.png" alt="Close" width={35} />
        </button>

        <div className="text-center pt-5">
          <FontAwesomeIcon icon={faCheckCircle} height={50} width={50} className="text-successs mb-4 fs-55" />
          <p className="fs-17 fw-500 label-color-2">Transaction Updated Successfully.</p>
          {purchaseOrderId && (
            <p className="fs-17 fw-500 label-color-2">
              Order Id: <span className="label-color-1">{purchaseOrderId}</span>
            </p>
          )}
          <div className="text-center py-3">
            <Link href={'/my-orders'}>
              <a
                onClick={() => setShowSuccess(false)}
                className="decoration-none btn blue-btn fs-15 px-4 py-2 mx-2 fw-500"
              >
                Go to My Orders
              </a>
            </Link>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default SuccessPlan;
