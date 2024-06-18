import React from 'react';
import { Modal } from 'react-bootstrap';

function RemoveCartModal(props) {
  const { setRemoveDesign, setShowFolderModal, removeFromCart, cartItemId, setIsCartItem, isFavorite } = props;
  function addFavorite() {
    setRemoveDesign(false);
    setShowFolderModal(true);
    setIsCartItem(true);
  }
  function removeOnly() {
    setRemoveDesign(false);
    removeFromCart(cartItemId);
  }
  return (
    <Modal show={true} onHide={setRemoveDesign} centered>
      <Modal.Body className="px-0 py-3">
        <button
          title="Close"
          onClick={() => setRemoveDesign(false)}
          className="border-0 outline-none bg-transparent cross-btn p-0 position-absolute top-0 end-0 mt-3 me-3"
        >
          <img src="/images/close-square.svg" alt="Close" width={35} />
        </button>
        <div className="text-center pt-5">
          {(isFavorite != 1 && (
            <p className="fs-17 fw-500 label-color-2">Do you want to add this item in your Favorite list</p>
          )) || <p className="fs-17 fw-500 label-color-2">Are you sure you want to remove design from cart</p>}
          <div className="text-center py-3">
            <button className="btn red-btn fs-15 px-4 py-2 mx-2 fw-500 text-capitalize" onClick={removeOnly}>
              Remove
            </button>
            {isFavorite != 1 && (
              <button className="btn blue-btn fs-15 px-4 py-2 mx-2 fw-500 text-capitalize" onClick={addFavorite}>
                add to favorite
              </button>
            )}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default RemoveCartModal;
