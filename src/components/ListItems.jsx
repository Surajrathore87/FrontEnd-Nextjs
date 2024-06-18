import React, { useEffect, useState } from 'react';
import { callAPI } from '_services/CallAPI';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useAuth } from '_contexts/auth';
import dynamic from 'next/dynamic';

const WishlistFolders = dynamic(import('components/Modal/WishlistFolders'));
const PageLoader = dynamic(import('components/Loaders/PageLoader'));
const RemoveFromWishlist = dynamic(import('./Modal/RemoveFromWishlist'));
const ShareDesign = dynamic(import('components/ShareDesign'));

function ListItems(props) {
  const { designCode, designDetailsData } = props;
  const [showDetais, setShowDetails] = useState(false);
  const [toggler, setToggler] = useState(false);
  const [designDetails, setDesignDetails] = useState(designDetailsData.data.design_detail);
  const [designImagePath, setDesignImagePath] = useState(designDetailsData.data.image_path);
  const [designCods, setDesignCods] = useState();
  const [nextEndDesign, setNextEndDesign] = useState(designDetailsData.data.next_design);
  const [prevEndDesign, setPrevEndDesign] = useState(designDetailsData.data.prev_design);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [wishlistId, setWishlistId] = useState(null);
  const [updateWishlist, setUpdateWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showRemoveWishlist, setShowRemoveWishlist] = useState(false);
  const [designId, setDesignId] = useState(null);
  const [prevURL, setPrevURL] = useState('#');
  const [errorMessage, setErrorMessage] = useState(null);
  const { isLoggedIn, setShowLogin, isContextLoaded, getUserDetails, userDetails } = useAuth();
  const toastConfig = {
    position: 'bottom-left',
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };
  const router = useRouter();

  useEffect(() => {
    if (designCode && isContextLoaded) {
      getDesignData();
    }
  }, [designCode, showFolderModal, updateWishlist, isContextLoaded, userDetails]);

  useEffect(() => {
    if (nextEndDesign || prevEndDesign) {
      onKeyDownEvent();
    }
  }, [nextEndDesign, prevEndDesign]);

  useEffect(() => {
    // if (localStorage.getItem('designCods')) {
    //   const cods = JSON.parse(localStorage.getItem('designCods'));
    //   setDesignCods(cods);
    // }
    if (localStorage.getItem('currentUrl')) {
      const url = localStorage.getItem('currentUrl');
      setPrevURL(url);
    }
  }, []);

  function getDesignData() {
    if (localStorage.getItem('prevSlug')) {
      const desCategory = localStorage.getItem('prevSlug');
      const isTrending = localStorage.getItem('isTrending');
      const params = {
        slug: designCode,
        thumbnail_id: 3,
        zoom_thumbnail_id: 8,
        main_category_slug: desCategory,
        is_trending: isTrending,
      };
      callAPI('POST', process.env.DESIGN_DETAIL_DATA, params, (res) => {
        // setIsLoading(false);
        if (res.status) {
          const data = res['data'];
          setDesignDetails(data.design_detail);
          setDesignImagePath(data.image_path);
          setNextEndDesign(data.next_design);
          setPrevEndDesign(data.prev_design);
        } else {
          setErrorMessage(res['message']);
        }
      });
    }
  }

  function nextDesign() {
    // const currentIdIndex = designCods.indexOf(designDetails.code);
    // const nextIndex = currentIdIndex + 1;
    // if (designCods.includes(designCods[nextIndex])) {
    //   router.push(`/designs/${designCods[nextIndex]}`);
    // } else {
    router.push(`/designs/${nextEndDesign.slug}`);
    // }
  }

  function prevDesign() {
    // const currentIdIndex = designCods.indexOf(designDetails.code);
    // const prevIndex = currentIdIndex - 1;
    // if (designCods.includes(designCods[prevIndex])) {
    //   router.push(`/designs/${designCods[prevIndex]}`);
    // } else {
    router.push(`/designs/${prevEndDesign.slug}`);
    // }
  }

  function addToCart() {
    if (isLoggedIn) {
      const params = {
        design_id: designDetails.id,
      };
      callAPI('POST', process.env.ADD_TO_CART, params, (res) => {
        if (res.status) {
          getDesignData();
          getUserDetails();
          toast.success(res['message'], toastConfig);
        }
      });
    } else {
      setShowLogin(true);
    }
  }

  function downloadDesign() {
    const params = {
      design_code: designDetails.code,
    };
    callAPI('POST', process.env.DOWNLOAD_DESIGN, params, (res) => {
      setIsLoading(false);
      if (res.status) {
        const data = res['data'];
        window.location.href = `${data.zip_file_path}`;
      }
    });
  }

  function cartBtn() {
    if (
      (designDetails.is_grouped &&
        designDetails.is_groupdesign_in_cart_count == 0 &&
        designDetails.is_groupdesign_purchased_count == 0) ||
      (!designDetails.is_grouped &&
        designDetails.is_design_in_cart_count == 0 &&
        designDetails.is_design_purchased_count == 0)
    ) {
      return (
        <button className="fs-16 fw-400 blue-btn my-3 w-100 btn-shadow" onClick={addToCart}>
          Add to Cart
        </button>
      );
    } else if (
      (designDetails.is_grouped &&
        designDetails.is_groupdesign_in_cart_count > 0 &&
        designDetails.is_groupdesign_purchased_count == 0) ||
      (!designDetails.is_grouped &&
        designDetails.is_design_in_cart_count > 0 &&
        designDetails.is_design_purchased_count == 0)
    ) {
      return (
        <Link href={'/my-cart'}>
          <a className="fs-16 fw-400 blue-btn my-3 w-100 btn-shadow btn decoration-none">Go to Cart</a>
        </Link>
      );
    } else if (
      (designDetails.is_grouped && designDetails.is_groupdesign_purchased_count > 0) ||
      (!designDetails.is_grouped && designDetails.is_design_purchased_count > 0)
    ) {
      return (
        <a
          className="fs-16 fw-400 blue-btn my-3 w-100 btn-shadow btn decoration-none"
          download
          onClick={downloadDesign}
        >
          Download
        </a>
      );
    }
  }

  function addRemoveWishlist(itemId) {
    if (isLoggedIn) {
      if (designDetails.wishlist_count != 1) {
        setWishlistId(itemId);
        setShowFolderModal(true);
        setUpdateWishlist(!updateWishlist);
      } else {
        setShowRemoveWishlist(true);
        setDesignId(itemId);
      }
    } else {
      setShowLogin(true);
    }
  }

  function onKeyDownEvent() {
    document.onkeydown = checkKey;
  }

  function checkKey(e) {
    const event = e || window.event;
    if (prevEndDesign && event.code == 'ArrowLeft') {
      prevDesign();
    } else if (nextEndDesign && event.code == 'ArrowRight') {
      nextDesign();
    }
  }


  return (
    <>
      {showFolderModal && (
        <WishlistFolders
          setShowFolderModal={setShowFolderModal}
          setUpdateWishlist={setUpdateWishlist}
          wishlistId={wishlistId}
        />
      )}
      {showRemoveWishlist && (
        <RemoveFromWishlist
          designId={designId}
          setShowRemoveWishlist={setShowRemoveWishlist}
          setUpdateWishlist={setUpdateWishlist}
          updateWishlist={updateWishlist}
        />
      )}
      {designDetails && (
        <section className="overflow-hidden position-absolute w-100 h-100 bg-white vh-100 top-0 detail-popup">
          <div className="list-items-selection ps-0 overflow-hidden">
            <div className="d-lg-flex overflow-hidden h-100">
              <div
                className={`w-75 list-item-slider list-item-image p-3 position-relative overflow-hidden ${
                  (toggler && 'w-100') || ''
                }`}
              >
                {prevEndDesign && (
                  <button
                    onClick={prevDesign}
                    className="btn shadow-none outline-none position-absolute start-0 bg-transparent border-0 item-details-next"
                  >
                    <img src="../images/prev-arrow.svg" className="" alt="Previous" title="Previous" />
                  </button>
                )}
                {nextEndDesign && (
                  <button
                    onClick={nextDesign}
                    className="btn shadow-none outline-none position-absolute end-0 bg-transparent border-0 item-details-prev"
                  >
                    <img src="../images/next-arrow.svg" className="" alt="Next" title="Next" />
                  </button>
                )}
                <div className="px-2 position-relative slider-item text-center h-100 d-flex align-items-center justify-content-center">
                  <div
                    className="maximize-img-icon d-md-flex d-none align-items-center justify-content-center cursor-pointer position-absolute top-0 end-0 me-md-4 me-3"
                    onClick={() => setToggler(!toggler)}
                  >
                    <img src="../images/maximize-img.svg" />
                  </div>
                  <img
                    src={designImagePath + designDetails.zoom_main_image.image}
                    className={`cat-main-img img-fluid`}
                    alt={designDetails.main_image.image_alt || ''}
                    title={designDetails.main_image.image_alt || ''}
                  />
                  <div className="d-flex justify-content-center align-item-center position-absolute bottom-0 start-0 w-100 pb-2">
                    <div onClick={() => addRemoveWishlist(designDetails.id)}>
                      <span
                        title="Add to Favorites"
                        className={`heart-icon d-flex align-items-center
                        justify-content-center cursor-pointer ${
                          (designDetails.wishlist_count == 1 && 'iswishlist') || ''
                        }`}
                      ></span>
                    </div>
                    <div className="mx-3 position-relative">
                      <ShareDesign />
                    </div>
                    {(designDetails.is_grouped == 0 && (
                      <Link href={`/individual-design/${designDetails.slug}`}>
                        <a title="Design Details">
                          <span className="heart-icon info-icon d-flex align-items-center justify-content-center cursor-pointer"></span>
                        </a>
                      </Link>
                    )) || (
                      <Link href={`/grouped-design/${designDetails.slug}`}>
                        <a title="Design Details">
                          <span className="heart-icon info-icon d-flex align-items-center justify-content-center cursor-pointer"></span>
                        </a>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
              <div
                className={`w-25 position-relative list-item-details end-0 flex-column d-flex h-100 ${
                  (toggler && 'w-0 position-absolute') || ''
                }`}
              >
                <div className="left-side px-3 pt-4 position-relative ">
                  <div className=" h-100">
                    <Link
                      href={`${
                        (prevURL && prevURL == '/home-interior-design/all' && '/home-interior-design') || prevURL
                      }`}
                    >
                      <a className="btn shadow-none outline-none position-absolute bg-white close-detail w-max-content border-0 p-0">
                        <img src="../images/close-square.svg" alt="Close" title="Close" />
                      </a>
                    </Link>
                    <h3 className="fw-700 heading-fonts">{designDetails.root_category.name}</h3>
                    <p className="fs-16 fw-500 label-color-1 mb-2">#{designDetails.code}</p>
                    {designDetails.is_grouped == 0 && (
                      <div className="pt-md-3">
                        <h6 className="fs-18 fw-700 heading-fonts text-black">Additional info</h6>
                        <div className="gray-box p-3 w-100 ps-0">
                          <ul className="mb-0 fs-14 fw-400 label-color-1">
                            <li className="mb-2">
                              <span
                                className={`d-inline-block ${
                                  (designDetails.root_category.name == 'Bed Designs' && 'info-large-title') ||
                                  'info-title'
                                }`}
                              >
                                Category
                              </span>
                              : {designDetails.category.name}
                            </li>
                            <li className="mb-2">
                              <span
                                className={`d-inline-block ${
                                  (designDetails.root_category.name == 'Bed Designs' && 'info-large-title') ||
                                  'info-title'
                                }`}
                              >
                                Finish
                              </span>
                              {designDetails.materials.map((item, key) => (
                                <span key={key}>
                                  : {item.name}
                                  {key == designDetails.materials.length - 1 ? '' : ','}
                                </span>
                              ))}
                            </li>
                            {designDetails.design_sizes.map((item, key) => (
                              <li className="mb-2" key={key}>
                                <span
                                  className={`d-inline-block ${
                                    (designDetails.root_category.name == 'Bed Designs' && 'info-large-title') ||
                                    'info-title'
                                  }`}
                                >
                                  {(designDetails.root_category.name == 'Bed Designs' && 'Mattress Size ') || 'Size '}
                                </span>
                                <span>
                                  {(designDetails.root_category.name == 'Bed Designs' && (
                                    <>
                                      {item.height &&
                                        item.category_size.unit_type == 1 &&
                                        ((String(item.height).includes('.') &&
                                          ': ' + String(item.height).replace('.', `'`) + `"`) ||
                                          ': ' + item.height + `'`)}
                                      {(item.category_size.unit_type == 1 && ' X ') || ''}
                                      {item.width &&
                                        item.category_size.unit_type == 1 &&
                                        ((String(item.width).includes('.') && String(item.width).replace('.', `'`)) ||
                                          item.width + `'`)}
                                      {(item.category_size.unit_type == 1 && '"') || ''} (LXW)
                                    </>
                                  )) || (
                                    <>
                                      {item.width &&
                                        item.category_size.unit_type == 1 &&
                                        ((String(item.width).includes('.') &&
                                          ': ' + String(item.width).replace('.', `'`)) ||
                                          ': ' + item.width + `'`)}
                                      {(item.category_size.unit_type == 1 && ' X ') || ''}
                                      {item.height &&
                                        item.category_size.unit_type == 1 &&
                                        ((String(item.height).includes('.') &&
                                          String(item.height).replace('.', `'`) + `"`) ||
                                          item.height + `'`)}
                                      {item.category_size.unit_type != 1 && ': ' + item.seater}
                                      {(item.size.size_type == 1 && ' (WXH)') || ''}
                                      {(item.size.size_type == 2 && ' (LXW)') || ''}
                                      {(item.size.size_type == 3 && ' (Seater)') || ''}
                                    </>
                                  )}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                    {designDetails.is_grouped == 1 && (
                      <div className="">
                        <div className="pt-3">
                          <h6 className="fs-16 text-black fw-700 heading-fonts">Specifications</h6>
                          <div className="d-flex gray-box px-3 py-2 w-100 mb-2 align-items-center">
                            {designDetails.design_sizes.map((item, key) => (
                              <div key={key} className="d-flex w-100 align-items-center">
                                <p className="fs-14 fw-600 w-25 text-black m-0 me-2 text-nowrap">
                                  {item.category_size.name} :
                                </p>
                                <span className="fs-14 ps-1 w-100 fw-400 text-black">
                                  {item.name}
                                  {(item.size.size_type == 1 && ' (WXH)') || ''}
                                  {(item.size.size_type == 2 && ' (LXW)') || ''}
                                  {(item.size.size_type == 3 && ' (Seater)') || ''}
                                  {/* {item.width}
                                  {(item.category_size.unit_type == 1 && '"') || ''}
                                  {(item.category_size.unit_type == 1 && ' X ') || ''}
                                  {item.height}
                                  {(item.category_size.unit_type == 1 && '"') || ''} */}
                                  {/* {item.category_size.unit_type == 1 && ' ft'} */}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="gray-box p-3 w-100">
                            {designDetails.design_groups.map((item, key) => (
                              <div key={key}>
                                <div className="pb-1">
                                  <p className="fs-14 fw-600 text-black p-0 mb-1 me-3">
                                    {item.design.root_category.name} {showDetais && `(${item.design.code})`}
                                  </p>
                                  {showDetais && (
                                    <>
                                      <div className="d-flex fs-13 mb-1 fw-400 label-color-1">
                                        <p className="me-1 mb-0 info-title">Category</p>
                                        <span>: {item.design.category.name}</span>
                                      </div>
                                      <div
                                        className="d-flex align-items-center fs-13 mb-1 fw-400 label-color-1"
                                        key={key}
                                      >
                                        <p className="me-1 mb-0 info-title">Finish</p>
                                        {item.design.materials.map((matItem, key) => (
                                          <span key={key}>
                                            : {matItem.name}
                                            {key == item.design.materials.length - 1 ? '' : ','}
                                          </span>
                                        ))}
                                      </div>
                                      {item.design.design_sizes.map((item, key) => (
                                        <div
                                          className="d-flex align-items-center fs-13 mb-1 fw-400 label-color-1"
                                          key={key}
                                        >
                                          <p className="me-1 text-nowrap mb-0 info-title">
                                            {item.category_size.name} Size{' '}
                                          </p>
                                          <span className="text-nowrap">
                                            : {item.name}
                                            <span className="ms-2 text-uppercase">
                                              {/* ({(item.width && 'w') || ''}x{(item.height && 'h') || ''}) */}
                                              {(item.size.size_type == 1 && '(WXH)') || ''}
                                              {(item.size.size_type == 2 && '(LXW)') || ''}
                                              {(item.size.size_type == 3 && '(Seater)') || ''}
                                            </span>
                                            {/* {item.category_size.unit_type == 1 && ' ft'} */}
                                          </span>
                                        </div>
                                      ))}
                                    </>
                                  )}
                                </div>
                              </div>
                            ))}
                            <span className="text-red cursor-pointer fs-13" onClick={() => setShowDetails(!showDetais)}>
                              {showDetais ? 'View less' : 'View Details'}
                            </span>
                          </div>
                          <div className="pt-2">
                            <p className="fs-16 fw-700 heading-fonts text-black p-0 m-0 me-3">Group designs</p>
                            <div className="row pt-2 pb-4 m-0">
                              {designDetails.design_groups.map((item, key) => (
                                <Link href={`/individual-design/${item.design.slug}`} key={key}>
                                  <a className="col-6 d-block p-0 pe-3 text-center mb-2">
                                    <img
                                      src={designImagePath + item.design.main_image.image}
                                      className="img-fluid detail-group-image"
                                      alt={item.design.main_image.image_alt || ''}
                                      title={item.design.main_image.image_alt || ''}
                                    />
                                  </a>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="px-3 position-sticky bottom-0 bg-white mt-auto">{designDetails && cartBtn()}</div>
              </div>
            </div>
          </div>
        </section>
      )}
      {/* {!designDetails && (
        <div className="px-3 py-5 d-flex align-items-center justify-content-center h-100">
          <div className="text-center">
            <p className="pt-5 fw-600 fs-18">The design you are looking for is not available</p>
            <Link href={'/'}>
              <a title="Back to Homepage" className="btn blue-btn fs-15 fw-600 mb-5 mt-4">
                Back to Homepage
              </a>
            </Link>
          </div>
        </div>
      )} */}
      {/* {isLoading && <PageLoader />} */}
    </>
  );
}

ListItems.propTypes = {
  designCode: PropTypes.string,
  designDetailsData: PropTypes.object,
};

export default ListItems;
