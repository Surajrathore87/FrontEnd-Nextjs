import { faEllipsisV, faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Router from 'next/router';
import React, { useEffect, useState } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAuth } from '_contexts/auth';
import { encrypt } from '_helper/encryptDecrypt';
import { callAPI } from '_services/CallAPI';

const RenameFolderModal = dynamic(import('components/Modal/RenameFolderModal'));
const EmptyWishlist = dynamic(import('components/EmptyWishlist'));
const FavouritesLoader = dynamic(import('components/Loaders/FavouritesLoader'));

function Favourites() {
  const [wishListFolders, setWishListFolders] = useState(null);
  const [showRenameFolder, setShowRenameFolder] = useState(false);
  const [folderId, setFolderId] = useState(null);
  const [folderName, setFolderName] = useState(null);
  const [imagePath, setImagePath] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { isLoggedIn, isContextLoaded, getUserDetails } = useAuth();
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
    if (isLoggedIn && isContextLoaded) {
      getWishlistFolders();
    }
  }, [isLoggedIn, isContextLoaded]);

  function getWishlistFolders() {
    callAPI('POST', process.env.WISHLIST_FOLDERS, {}, (res) => {
      setIsLoading(false);
      if (res.status) {
        const data = res['data'];
        setWishListFolders(data);
        setImagePath(data.image_path.design_image_path);
      } else {
        setWishListFolders(null);
      }
    });
  }

  function removeFolder(removeId) {
    const params = {
      wishlist_folder_id: removeId,
    };
    callAPI('POST', process.env.REMOVE_WISHLIST_FOLDER, params, (res) => {
      if (res.status) {
        toast.success(res['message'], toastConfig);
        getWishlistFolders();
        getUserDetails();
      }
    });
  }

  function renameFolder(id, name) {
    setShowRenameFolder(true);
    setFolderId(id);
    setFolderName(name);
  }

  function goToFolder(id) {
    const encryptCode = encrypt(id).replace(/\//g, 'dpo');
    Router.push(`/favourites/${encryptCode}`);
  }

  function renderFolders() {
    return wishListFolders.wishlist_folders.map((item, key) => (
      <div className="col-xl-3 col-lg-4 col-md-6 py-3 py-2 px-md-3 decoration-none" key={key}>
        <div className="shadow fingure-tips-box favourite-folder">
          <a
            onClick={() => goToFolder(item.id)}
            className="d-block user-favorite-folder cursor-pointer"
            style={{
              backgroundImage: `url(${
                (item.latest_wishlist_design_image &&
                  item.latest_wishlist_design_image.design &&
                  item.latest_wishlist_design_image.design.main_image &&
                  imagePath + item.latest_wishlist_design_image.design.main_image.image) ||
                '/images/placeholder-img.png'
              })`,
            }}
          ></a>
          <div className="d-flex align-items-start py-3 px-3 fs-20 justify-content-between w-100">
            <div className="mw-100">
              <Link href={`/favourites/${item.id}`}>
                <h3 className="m-0 fs-20 fw-600 text-black p-0 pt-1 cursor-pointer line-clamp-1">{item.name}</h3>
              </Link>
              <span className="label-color-1 text-nowrap fw-500 fs-14 ps-1">({item.wishlist_designs_count} Items)</span>
            </div>
            <DropdownButton
              variant="none"
              className="fav-dropdown position-relative p-0 m-0"
              align={'end'}
              title={<FontAwesomeIcon icon={faEllipsisV} width={20} height={20} className="fs-16" />}
            >
              <Dropdown.Item
                onClick={() => renameFolder(item.id, item.name)}
                className="fs-14 fw-500 label-color-1 py-2 d-flex align-items-center justify-content-between"
              >
                <span>Rename Folder</span>
                <FontAwesomeIcon width={14} height={14} icon={faPencilAlt} className="text-blue" />
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => removeFolder(item.id)}
                className="fs-14 fw-500 label-color-1 py-2 d-flex align-items-center justify-content-between"
              >
                <span>Delete Folder</span>
                <FontAwesomeIcon width={14} height={14} icon={faTrash} className="text-red" />
              </Dropdown.Item>
            </DropdownButton>
          </div>
        </div>
      </div>
    ));
  }

  return (
    <>
      {showRenameFolder && (
        <RenameFolderModal
          setShowRenameFolder={setShowRenameFolder}
          getWishlistFolders={getWishlistFolders}
          folderId={folderId}
          folderName={folderName}
        />
      )}
      <div className="pb-md-5 pb-3 border-top">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 pt-lg-5 pt-4">
              <div className="d-flex mb-3">
                <h1 className="inner-heading m-0">Favourites</h1>
              </div>
              {isLoggedIn && (
                <div className="row align-items-stretch">
                  {!isLoading && wishListFolders && renderFolders()}
                  {isLoading && <FavouritesLoader />}
                  {!isLoading && !wishListFolders && <EmptyWishlist />}
                </div>
              )}
              {isContextLoaded && !isLoggedIn && <EmptyWishlist />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Favourites;
