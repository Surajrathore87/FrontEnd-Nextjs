import { faCheck, faPlus, faTrash, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAuth } from '_contexts/auth';
import { callAPI } from '_services/CallAPI';

function WishlistFolders(props) {
  const { setShowFolderModal, wishlistId, setUpdateWishlist, updateWishlist, removeFromCart, isCartItem } = props;
  const { getUserDetails } = useAuth();
  const [wishListFolders, setWishListFolders] = useState(null);
  const [updateFolders, setUpdateFolders] = useState(false);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState(null);
  const [folderError, setFolderError] = useState(null);
  const toastConfig = {
    position: 'bottom-left',
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  useEffect(() => {
    getWishlistFolders();
  }, [updateFolders]);

  function getWishlistFolders() {
    callAPI('POST', process.env.WISHLIST_FOLDERS, {}, (res) => {
      if (res.status) {
        const data = res['data'];
        setWishListFolders(data.wishlist_folders);
      }
    });
  }

  function addToWishlist(folderId) {
    const params = {
      design_id: wishlistId,
      wishlist_folder_id: folderId,
    };
    callAPI('POST', process.env.WISHLIST_UNWISHLIST_DESIGN, params, (res) => {
      if (res.status) {
        setShowFolderModal(false);
        setUpdateFolders(false);
        setUpdateWishlist(!updateWishlist);
        getUserDetails();
        toast.success(res['message'], toastConfig);
      }
      if (isCartItem) {
        removeFromCart(wishlistId);
      }
    });
  }

  function createNewFolder() {
    if (newFolderName != null) {
      const params = {
        name: newFolderName,
        design_id: wishlistId,
      };
      callAPI('POST', process.env.ADD_UPDATE_WISHLIST_FOLDER, params, (res) => {
        if (res.status) {
          setUpdateFolders(true);
          setShowFolderModal(false);
          toast.success(res['message'], toastConfig);
          setUpdateWishlist(!updateWishlist);
          getUserDetails();
        } else {
          toast.error(res['message'], toastConfig);
        }
        if (isCartItem) {
          removeFromCart(wishlistId);
        }
      });
    } else {
      setFolderError('The name field is required');
    }
  }

  return (
    <Modal show={true} onHide={setShowFolderModal} centered>
      <Modal.Body className="p-0">
        <div className="position-relative border-bottom p-3">
          <h5 className="fw-700 heading-fonts m-0 d-flex justify-content-between align-items-center">
            <span>Favorites Folders</span>
            <button
              title="Close"
              onClick={() => setShowFolderModal(false)}
              className="border-0 outline-none bg-transparent p-0"
            >
              <img src="/images/close-square.svg" alt="Close" width={30} />
            </button>
          </h5>
        </div>
        <div className="px-4">
          <div className="py-2 mt-3 row">
            {wishListFolders &&
              wishListFolders.map((item, key) => (
                <a
                  className="col-6 decoration-none"
                  key={key}
                  onClick={(folderId) => addToWishlist((folderId = item.id))}
                >
                  <div
                    className="cursor-pointer col-6 d-flex align-items-center mb-3 py-3
                  decoration-none fs-17 w-100 px-3 bg-white rounded-6 fw-600 text-black wishlist-names"
                  >
                    <img src="/images/folder-icon.png" width={32} className="me-3 folder-blue" />
                    <img src="/images/folder-red.png" width={32} className="me-3 d-none folder-red" />
                    <span>{item.name}</span>
                  </div>
                </a>
              ))}
            <div className="py-3">
              {showNewFolder && (
                <div className="my-2 position-relative add-folder">
                  <input
                    className="form-control fs-15 fw-500 text-black shadow-none border"
                    onChange={(e) => setNewFolderName(e.target.value)}
                    type="text"
                    placeholder="Folder Name"
                  />
                  <button
                    className="blue-btn fs-16 px-4 position-absolute end-0 top-0 shadow-none py-0"
                    onClick={createNewFolder}
                  >
                    Add
                  </button>
                </div>
              )}
              {!newFolderName && <small className="text-danger">{folderError}</small>}
              {!showNewFolder && (
                <button
                  onClick={() => setShowNewFolder(true)}
                  title="Add New Folder"
                  className="blue-btn mx-auto d-block outline-none fs-14 fw-500 mt-3 mb-2"
                >
                  Add New Folder <FontAwesomeIcon icon={faPlus} width={12} height={12} className={'fs-12 ms-1'} />
                </button>
              )}
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default WishlistFolders;
