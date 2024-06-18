import { faExchangeAlt, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

function DeleteMessageModal(props) {
  const { show, closeModal, confirmDelete, loading, module } = props;

  return (
    <>
      <Modal show={show} onHide={closeModal} centered className="delete-modal">
        <Modal.Body>
          <div className="text-center">
            <FontAwesomeIcon icon={faExclamationCircle} className="fs-55 text-red mb-3" width={50} />
            {(module == 'ClearChat' && <h5 className="label-color-4">Do you want to clear all messages?</h5>) || (
              <h5 className="label-color-4">Do you want do delete this message?</h5>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="text-center w-100">
            <Button className="red-btn me-3 px-4 py-2" onClick={confirmDelete} disabled={loading}>
              Yes
            </Button>
            <Button className="red-outline-btn px-4 py-2" onClick={closeModal}>
              No
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeleteMessageModal;
