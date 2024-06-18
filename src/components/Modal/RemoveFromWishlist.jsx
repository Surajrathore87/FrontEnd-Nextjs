import React from 'react';
import { Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAuth } from '_contexts/auth';
import { callAPI } from '_services/CallAPI';

function RemoveFromWishlist(props) {
  const { setShowRemoveWishlist, designId, setUpdateWishlist, updateWishlist } = props;
  const { getUserDetails } = useAuth();
  const toastConfig = {
    position: 'bottom-left',
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  function removeWishlist() {
    const params = {
      design_id: designId,
    };
    callAPI('POST', process.env.WISHLIST_UNWISHLIST_DESIGN, params, (res) => {
      if (res.status) {
        setUpdateWishlist(!updateWishlist);
        toast.success(res['message'], toastConfig);
        setShowRemoveWishlist(false);
        getUserDetails();
      }
    });
  }

  return (
    <Modal show={true} onHide={setShowRemoveWishlist} centered>
      <Modal.Body>
        <button
          onClick={() => setShowRemoveWishlist(false)}
          className="border-0 outline-none bg-transparent cross-btn p-0 position-absolute top-0 end-0 mt-3 me-3"
        >
          <img src="/images/filter-close-icon.png" alt="Close" width={35} />
        </button>

        <div className="text-center pt-5">
          <p className="fs-17 fw-500 label-color-2">Are you sure you want to remove this design from favorites?</p>
          <div className="text-center py-3">
            <button onClick={() => setShowRemoveWishlist(false)} className="btn blue-btn fs-15 px-4 py-2 mx-2 fw-500">
              Cancel
            </button>
            <button onClick={removeWishlist} className="btn red-btn fs-15 px-4 py-2 mx-2 fw-500">
              Okay
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default RemoveFromWishlist;
