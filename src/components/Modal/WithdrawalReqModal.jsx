import React from 'react';
import { Modal } from 'react-bootstrap';

function WithdrawalReqModal(props) {
  const { redeemAllPoints, setShowConfirmation, requestWithdrawal } = props;

  function requestRedeem() {
    requestWithdrawal();
    setShowConfirmation(false);
  }

  return (
    <Modal show={true} onHide={setShowConfirmation} centered>
      <Modal.Body>
        <button
          onClick={() => setShowConfirmation(false)}
          className="border-0 outline-none bg-transparent cross-btn p-0 position-absolute top-0 end-0 mt-3 me-3"
        >
          <img src="/images/filter-close-icon.png" alt="Close" width={35} />
        </button>

        <div className="text-center pt-5">
          <p className="fs-17 fw-500 label-color-2">Are you sure you want to redeem {redeemAllPoints} points?</p>
          <div className="text-center py-3">
            <button onClick={() => setShowConfirmation(false)} className="btn blue-btn fs-15 px-4 py-2 mx-2 fw-500">
              Cancel
            </button>
            <button onClick={requestRedeem} className="btn red-btn fs-15 px-4 py-2 mx-2 fw-500">
              Okay
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default WithdrawalReqModal;
