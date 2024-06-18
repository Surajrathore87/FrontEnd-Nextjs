import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import React, { useEffect, useState } from 'react';
import Slider from 'react-slick/lib/slider';
import dynamic from 'next/dynamic';
import { callAPI } from '_services/CallAPI';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useAuth } from '_contexts/auth';

const ReadMore = dynamic(import('components/Utils/ReadMore'));
const ImageView = dynamic(import('components/Modal/ImageView'));
const WishlistFolders = dynamic(import('components/Modal/WishlistFolders'));
const MoreDesigns = dynamic(import('components/MoreDesigns'));
const IndvDesignLoader = dynamic(import('components/Loaders/IndvDesignLoader'));
const RemoveFromWishlist = dynamic(import('./Modal/RemoveFromWishlist'));
const ShareDesign = dynamic(import('components/ShareDesign'));
function IndividualDesign(props) {
  const { designCode, designDetailsData } = props;
  const [designDetails, setDesignDetails] = useState(designDetailsData.data.design_detail);
  const [designImagePath, setDesignImagePath] = useState(designDetailsData.data.image_path);
  const [descLang, setDescLang] = useState('En');
  const [featureImagePath, setFeatureImagePath] = useState(designDetailsData.data.feature_image_path);
  const [relatedDesigns, setRelatedDesigns] = useState(designDetailsData.data.related_designs);
  const [showImage, setShowImage] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [wishlistId, setWishlistId] = useState(null);
  const [updateWishlist, setUpdateWishlist] = useState(false);
  const [showRemoveWishlist, setShowRemoveWishlist] = useState(false);
  const [expandSlider, setExpandSlider] = useState(false);
  const [designId, setDesignId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const { userDetails, isLoggedIn, isContextLoaded, setShowLogin, getUserDetails } = useAuth();

  useEffect(() => {
    if (designCode && isContextLoaded) {
      getDesignData();
    }
  }, [designCode, updateWishlist, isContextLoaded, userDetails]);

  const toastConfig = {
    position: 'bottom-left',
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };
  function getDesignData() {
    const params = {
      slug: designCode,
      thumbnail_id: 3,
      zoom_thumbnail_id: 8,
    };
    callAPI('POST', process.env.DESIGN_DETAIL_DATA, params, (res) => {
      setIsLoading(false);
      if (res.status) {
        const data = res['data'];
        setDesignDetails(data.design_detail);
        setDesignImagePath(data.image_path);
        setFeatureImagePath(data.feature_image_path);
        setRelatedDesigns(data.related_designs);
      } else {
        setDesignDetails(null);
        setErrorMessage(res['message']);
      }
    });
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

  function addToCart() {
    if (isLoggedIn) {
      const params = {
        design_id: designDetails.id,
      };
      callAPI('POST', process.env.ADD_TO_CART, params, (res) => {
        if (res.status) {
          const data = res['data'];
          getDesignData();
          toast.success(res['message'], toastConfig);
          getUserDetails();
        }
      });
    } else {
      setShowLogin(true);
    }
  }

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    arrows: true,
    pauseOnHover: true,
  };

  function renderFeatures() {
    return designDetails.features.map((item, key) => (
      <div className="col-md-6 features-column d-flex align-items-center" key={key}>
        <img
          src={featureImagePath + item.image}
          alt={item.image_alt || ''}
          title={item.image_alt || ''}
          width={32}
          height="32"
        />
        {(descLang == 'En' && <span className="fs-15 fw-500 ms-3 label-color-1">{item.description}</span>) || (
          <span className="fs-15 fw-500 ms-3 label-color-1">{item.hindi_description}</span>
        )}
      </div>
    ));
  }

  function addToWishlist(itemId, isWishlist) {
    if (isLoggedIn) {
      if (isWishlist != 1) {
        setWishlistId(itemId);
        setShowFolderModal(true);
      } else {
        setShowRemoveWishlist(true);
        setDesignId(itemId);
      }
    } else {
      setShowLogin(true);
    }
  }

  return (
    <>
      {showFolderModal && (
        <WishlistFolders
          setUpdateWishlist={setUpdateWishlist}
          updateWishlist={updateWishlist}
          setShowFolderModal={setShowFolderModal}
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
      <section className="border-top">
        <div className="container pb-md-5 py-3 pt-4 pt-lg-5 signle-design-section">
          {designDetails && (
            <>
              <div className="row">
                <div
                  className={`col-md-6 col-12 signle-design-slider cart-slider ${
                    (expandSlider && 'w-100 h-100 position-fixed start-0 top-0 text-center bg-white expanded-slider') ||
                    ''
                  }`}
                >
                  <div className="position-relative">
                    <div
                      onClick={() => setExpandSlider(!expandSlider)}
                      className="maximize-img-icon d-flex align-items-center justify-content-center cursor-pointer position-absolute top-0 end-0 mt-md-4 mt-2 me-md-4 me-3"
                    >
                      {(!expandSlider && <img src={'/images/maximize-img.svg'} />) || (
                        <img src="/images/cross-icon.svg" alt="Close" width={30} />
                      )}
                    </div>
                    <Slider {...settings}>
                      <div className="text-center">
                        {(!expandSlider && (
                          <div
                            className="slide-design-box"
                            style={{
                              backgroundImage: `url(${designImagePath + designDetails.zoom_main_image.image})`,
                            }}
                          ></div>
                        )) || (
                          <div>
                            <img
                              src={designImagePath + designDetails.zoom_main_image.image}
                              alt={designDetails.zoom_main_image.image_alt || ''}
                              title={designDetails.zoom_main_image.image_alt || ''}
                              className="m-auto expand-img img-fluid"
                            />
                          </div>
                        )}
                      </div>
                      {designDetails.zoom_gallery_images.map((item, key) => (
                        <div key={key} className="text-center">
                          {(!expandSlider && (
                            <div
                              className="slide-design-box"
                              style={{ backgroundImage: `url(${designImagePath + item.image})` }}
                            ></div>
                          )) || (
                            <div>
                              <img
                                src={designImagePath + item.image}
                                className="m-auto expand-img img-fluid"
                                alt={item.image_alt || ''}
                                title={item.image_alt || ''}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </Slider>
                    {!expandSlider && (
                      <div className="d-flex justify-content-center align-item-center position-absolute bottom-0 left-0 w-100 pb-md-4 pb-2">
                        <div className="">
                          <span
                            onClick={() => addToWishlist(designDetails.id, designDetails.wishlist_count)}
                            className={`heart-icon align-items-center d-flex
                                   justify-content-center cursor-pointer ${
                                     (designDetails.wishlist_count == 1 && 'iswishlist') || ''
                                   }`}
                          ></span>
                        </div>
                        <div className="mx-3 position-relative">
                          <ShareDesign />
                          {/* <span className="heart-icon share-icon bg-white d-flex align-items-center justify-content-center cursor-pointer"></span> */}
                        </div>
                      </div>
                    )}
                    {showImage && (
                      <ImageView
                        setShowImage={setShowImage}
                        designImagePath={designImagePath}
                        galleryImage={designDetails.zoom_gallery_images.map((item) => item.image)}
                        mainImage={designDetails.zoom_main_image.image}
                      />
                    )}
                  </div>
                </div>
                <div className="col-md-6 col-12 py-md-0 py-3">
                  <div className="bg-white d-md-flex flex-md-column signle-design-left-section h-100">
                    <div className="mb-auto">
                      <h1 className="inner-heading d-flex align-items-center">
                        {designDetails.root_category.name}{' '}
                        {/* {(!designDetails.is_free && (
                        <span className="pro-label pro-box gray-box fs-14 fw-500 d-flex align-items-end ms-2 py-1 px-2">
                          <img src="/images/crown.svg" />
                          <span className="ms-1">Premium</span>
                        </span>
                      )) ||
                        ''} */}
                      </h1>
                      <p className="label-color-1">#{designDetails.code}</p>
                      {(designDetails.english_description || designDetails.hindi_description) && (
                        <div className="d-flex align-items-center pb-2">
                          <h3 className="fs-20 fw-700 heading-fonts m-0">Design Details</h3>
                          {/* <span className="fs-14 fw-500 ms-3">
                          <span
                            className={`cursor-pointer ${(descLang == 'En' && 'text-red') || ''}`}
                            onClick={() => setDescLang('En')}
                          >
                            English
                          </span>
                          <span> / </span>
                          <span
                            className={`cursor-pointer ${(descLang == 'Hn' && 'text-red') || ''}`}
                            onClick={() => setDescLang('Hn')}
                          >
                            Hindi
                          </span>
                        </span> */}
                        </div>
                      )}

                      <ReadMore maxLength={135}>
                        {(descLang == 'En' && designDetails.english_description) || designDetails.hindi_description}
                      </ReadMore>
                      <div className="">
                        <h3 className="fw-700 heading-fonts fs-20 text-black">Additional info</h3>
                        <div className="gray-box p-3 px-2 mb-3">
                          <ul className="mb-0 fw-400 fs-16 text-black list-items list-unstyled ms-4">
                            <div className="row">
                              <div className=" col-12">
                                <li className="pb-2 fs-16 fw-400 text-black">
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
                              </div>
                              <div className="col-12 ">
                                <li className="pb-2 fs-16 fw-400 text-black">
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
                                      {(key == designDetails.materials.length - 1 && ' ') || ','}
                                    </span>
                                  ))}
                                </li>
                              </div>
                              {designDetails.design_sizes.map((item, key) => (
                                <div className="col-12 " key={key}>
                                  <li className="pb-2 fs-16 fw-400 text-black">
                                    <span
                                      className={`d-inline-block ${
                                        (designDetails.root_category.name == 'Bed Designs' && 'info-large-title') ||
                                        'info-title'
                                      }`}
                                    >
                                      {(designDetails.root_category.name == 'Bed Designs' && 'Mattress Size') ||
                                        'Size '}
                                    </span>
                                    <span>
                                      : {item.name}
                                      {/* {(item.category_size.unit_type == 1 &&
                                        designDetails.root_category.name == 'Bed Designs' &&
                                        ' (LXW)') ||
                                        ''}
                                      {(item.category_size.unit_type == 1 &&
                                        designDetails.root_category.name != 'Bed Designs' &&
                                        ' (WXH)') ||
                                        ''} */}
                                      {/* {(item.category_size.unit_type == 2 && ' Seater') || ''} */}
                                      <span>
                                        {(item.size.size_type == 1 && ' (WXH)') || ''}
                                        {(item.size.size_type == 2 && ' (LXW)') || ''}
                                        {(item.size.size_type == 3 && ' (Seater)') || ''}
                                      </span>
                                    </span>
                                  </li>
                                </div>
                              ))}
                            </div>
                          </ul>
                        </div>
                        {designDetails.goto_group_design && (
                          <div className="gray-box d-flex align-items-center py-3 px-3 mb-4">
                            <div className="">
                              <h3 className="text-black fs-16 fw-600">View This Design</h3>
                              <p className="fs-14 fw-400 label-color-3 p-0 m-0">
                                In {designDetails.goto_group_design.group_design.root_category.name}
                              </p>
                            </div>
                            <div className="ms-auto">
                              <Link href={`/grouped-design/${designDetails.goto_group_design.group_design.slug}`}>
                                <a className="blue-btn go-design-btn fs-14 fw-600 btn">Go to design</a>
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-md-start text-center">
                      {designDetails &&
                        designDetails.is_design_in_cart_count == 0 &&
                        designDetails.is_design_purchased_count == 0 && (
                          <button className="blue-btn free-download-btn" onClick={addToCart}>
                            Add to Cart
                          </button>
                        )}
                      {designDetails &&
                        designDetails.is_design_in_cart_count > 0 &&
                        designDetails.is_design_purchased_count == 0 && (
                          <Link href={'/my-cart'}>
                            <a className="blue-btn free-download-btn btn decoration-none">Go to Cart</a>
                          </Link>
                        )}
                      {designDetails && designDetails.is_design_purchased_count > 0 && (
                        <a
                          download
                          className="blue-btn btn shadow-none free-download-btn decoration-none decoration-none"
                          onClick={downloadDesign}
                        >
                          Download
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <div className="px-2 mt-0 mt-md-4 px-md-0 pt-2">
                    <h3 className="fs-20 fw-700 heading-fonts m-0 text-black">What you will get</h3>
                    <div className="row gray-box des-features-box what-you-will-box mt-3 mx-md-0">
                      {renderFeatures()}
                    </div>
                  </div>
                </div>
                {(relatedDesigns && relatedDesigns.length > 0 && (
                  <MoreDesigns
                    relatedDesigns={relatedDesigns}
                    designImagePath={designImagePath}
                    designCode={designCode}
                    isGrouped={designDetails.is_grouped}
                    categorySlug={designDetails.root_category.slug}
                  />
                )) ||
                  ''}
              </div>
            </>
          )}
          {!designDetails && <p className="text-center text-black fw-600 py-4 fs-20">{errorMessage}</p>}
          {/* {isLoading && <IndvDesignLoader />} */}
          {/* Slider */}
        </div>
      </section>
    </>
  );
}

IndividualDesign.propTypes = {
  designCode: PropTypes.string,
  designDetailsData: PropTypes.object,
};

export default IndividualDesign;
