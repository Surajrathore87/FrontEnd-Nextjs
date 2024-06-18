import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { callAPI } from '_services/CallAPI';

function RenameFolderModal(props) {
  const { setShowRenameFolder, folderId, folderName, getWishlistFolders } = props;
  const [newFolderName, setNewFolderName] = useState(folderName);
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

  function renameFolder() {
    if (newFolderName != '') {
      const params = {
        name: newFolderName,
        wishlist_folder_id: folderId,
      };
      callAPI('POST', process.env.ADD_UPDATE_WISHLIST_FOLDER, params, (res) => {
        if (res.status) {
          setShowRenameFolder(false);
          toast.success(res['message'], toastConfig);
          getWishlistFolders();
        } else {
          toast.error(res['message'], toastConfig);
        }
      });
    } else {
      setFolderError('The name field is required');
    }
  }

  return (
    <Modal show={true} onHide={setShowRenameFolder} centered>
      <Modal.Body className="p-0">
        <div className="position-relative border-bottom p-3">
          <h5 className="fw-600 m-0 d-flex justify-content-between align-items-center">
            <span>Rename Folder</span>
            <button
              title="Close"
              onClick={() => setShowRenameFolder(false)}
              className="border-0 outline-none bg-transparent p-0"
            >
              <img src="/images/close-square.svg" alt="Close" width={30} />
            </button>
          </h5>
        </div>
        <div className="pt-2 pb-4 px-3">
          <div className="my-2 position-relative add-folder">
            <input
              className="form-control fs-15 fw-500 text-black shadow-none border"
              onChange={(e) => setNewFolderName(e.target.value)}
              defaultValue={folderName}
              type="text"
              placeholder="Folder Name"
            />
            <button
              className="blue-btn fs-16 px-4 position-absolute end-0 top-0 shadow-none py-0"
              onClick={renameFolder}
            >
              Add
            </button>
            {!newFolderName && <small className="text-danger">{folderError}</small>}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default RenameFolderModal;
