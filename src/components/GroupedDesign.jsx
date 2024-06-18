import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import React, { useEffect, useState } from 'react';
import Slider from 'react-slick/lib/slider';
import dynamic from 'next/dynamic';
import { callAPI } from '_services/CallAPI';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { useAuth } from '_contexts/auth';

const ReadMore = dynamic(import('components/Utils/ReadMore'));
const ImageView = dynamic(import('components/Modal/ImageView'));
const SingleImageView = dynamic(import('components/Modal/SingleImageView'));
const WishlistFolders = dynamic(import('components/Modal/WishlistFolders'));
const GroupedDesignLoader = dynamic(import('components/Loaders/GroupedDesignLoader'));
const MoreDesigns = dynamic(import('components/MoreDesigns'));
const RemoveFromWishlist = dynamic(import('./Modal/RemoveFromWishlist'));
const ShareDesign = dynamic(import('components/ShareDesign'));
function GroupedDesign(props) {
  const { designCode, designDetailsData } = props;
  const [designDetails, setDesignDetails] = useState(designDetailsData.data.design_detail);
  const [designImagePath, setDesignImagePath] = useState(designDetailsData.data.image_path);
  const [featureImagePath, setFeatureImagePath] = useState(designDetailsData.data.feature_image_path);
  const [descLang, setDescLang] = useState('En');
  const [relatedDesigns, setRelatedDesigns] = useState(designDetailsData.data.related_designs);
  const [showImage, setShowImage] = useState(false);
  const [showSingleImage, setShowSingleImage] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [wishlistId, setWishlistId] = useState(null);
  const [updateWishlist, setUpdateWishlist] = useState(false);
  const [showRemoveWishlist, setShowRemoveWishlist] = useState(false);
  const [designId, setDesignId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [expandSlider, setExpandSlider] = useState(false);
  const { isLoggedIn, setShowLogin, isContextLoaded, getUserDetails, userDetails } = useAuth();

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
    if (designCode && isContextLoaded) {
      getDesignData();
    }
  }, [designCode, updateWishlist, isContextLoaded, userDetails]);

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
        {(descLang == 'En' && <span className="fs-14 fw-500 ms-3 label-color-1">{item.description}</span>) || (
          <span className="fs-14 fw-500 ms-3 label-color-1">{item.hindi_description}</span>
        )}
      </div>
    ));
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
          getUserDetails();
          toast.success(res['message'], toastConfig);
        }
      });
    } else {
      setShowLogin(true);
    }
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
        <div className="container pb-md-5 pt-4 pt-lg-5  pb-3 signle-design-section">
          {designDetails && (
            <>
              <div className="row align-items-center justify-content-center">
                <div className="col-md-6 py-1">
                  <div className="">
                    <h1 className="inner-heading d-flex align-items-end mb-3">
                      {designDetails.category.name}
                      {/* {(!designDetails.is_free && (
                        <span className="pro-label gray-box fs-14 fw-500 d-flex align-items-end ms-2 py-1 px-2">
                          <img src="/images/crown.svg" />
                          <span className="ms-1">Premium</span>
                        </span>
                      )) ||
                        ''} */}
                    </h1>
                    <span className="gray-box fs-16 fw-500 py-1 px-3">
                      <span className="pe-3 border-end label-color-1">#{designDetails.code}</span>
                      {designDetails.design_sizes.map((item, key) => (
                        <span key={key} className="label-color-1 ms-2">
                          {/* {item.category_size.name} :{' '} */}
                          <span className="text-black">
                            {item.name}
                            {/* {item.category_size.unit_type == 1 && ' ft'} */}
                            {(item.size.size_type == 1 && ' (WXH)') || ''}
                            {(item.size.size_type == 2 && ' (LXW)') || ''}
                            {(item.size.size_type == 3 && ' (Seater)') || ''}
                          </span>
                        </span>
                      ))}
                    </span>
                  </div>
                </div>
                <div className="col-md-6 py-1 text-md-end text-center d-none d-md-block">
                  {designDetails &&
                    designDetails.is_groupdesign_in_cart_count == 0 &&
                    designDetails.is_groupdesign_purchased_count == 0 && (
                      <button className="blue-btn free-download-btn" onClick={addToCart}>
                        Add to Cart
                      </button>
                    )}
                  {designDetails &&
                    designDetails.is_groupdesign_in_cart_count > 0 &&
                    designDetails.is_groupdesign_purchased_count == 0 && (
                      <Link href={'/my-cart'}>
                        <a className="blue-btn free-download-btn btn decoration-none">Go to Cart</a>
                      </Link>
                    )}
                  {designDetails && designDetails.is_groupdesign_purchased_count > 0 && (
                    <a
                      className="btn shadow-none blue-btn free-download-btn decoration-none"
                      download
                      onClick={downloadDesign}
                    >
                      Download
                    </a>
                  )}
                </div>
              </div>
              <div className="row py-3">
                <div
                  className={`col-lg-6 signle-design-slider mb-lg-0 mb-4 ${
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
                      <div>
                        {(!expandSlider && (
                          <div
                            className="slide-design-box"
                            style={{
                              backgroundImage: `url(${
                                designDetails.zoom_main_image && designImagePath + designDetails.zoom_main_image.image
                              })`,
                            }}
                          ></div>
                        )) || (
                          <div>
                            <img
                              src={
                                designDetails.zoom_main_image && designImagePath + designDetails.zoom_main_image.image
                              }
                              alt={designDetails.zoom_main_image.image_alt || ''}
                              title={designDetails.zoom_main_image.image_alt || ''}
                              className="m-auto expand-img img-fluid"
                            />
                          </div>
                        )}
                      </div>
                      {designDetails.design_groups.map((item, key) => (
                        <div key={key}>
                          {(!expandSlider && (
                            <div
                              className="slide-design-box"
                              style={{
                                backgroundImage: `url(${designImagePath + item.design.zoom_main_image.image})`,
                              }}
                            ></div>
                          )) || (
                            <div>
                              <img
                                src={designImagePath + item.design.zoom_main_image.image}
                                alt={item.design.zoom_main_image.image_alt || ''}
                                title={item.design.zoom_main_image.image_alt || ''}
                                className="m-auto expand-img img-fluid"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                      {designDetails.zoom_gallery_images.map((item, key) => (
                        <div key={key}>
                          {(!expandSlider && (
                            <div
                              className="slide-design-box"
                              style={{
                                backgroundImage: `url(${designImagePath + item.image})`,
                              }}
                            ></div>
                          )) || (
                            <div>
                              <img
                                src={designImagePath + item.image}
                                alt={item.image_alt || ''}
                                title={item.image_alt || ''}
                                className="m-auto expand-img img-fluid"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </Slider>
                    {!expandSlider && (
                      <div className="d-flex justify-content-center align-item-center position-absolute details-actions left-0 w-100">
                        <div className="mx-2">
                          <span
                            onClick={() => addToWishlist(designDetails.id, designDetails.wishlist_count)}
                            className={`heart-icon align-items-center d-flex
                                   justify-content-center cursor-pointer ${
                                     (designDetails.wishlist_count == 1 && 'iswishlist') || ''
                                   }`}
                          ></span>
                        </div>
                        <div className="mx-2 position-relative">
                          <ShareDesign />
                          {/* <span className="heart-icon share-icon bg-white d-flex align-items-center justify-content-center cursor-pointer"></span> */}
                        </div>
                      </div>
                    )}
                  </div>
                  {showSingleImage && (
                    <SingleImageView
                      setShowSingleImage={setShowSingleImage}
                      // twoDimensionImage={designImagePath + designDetails.zoom_two_dimension_image.image}
                      mainImage={designImagePath + designDetails.zoom_main_image.image}
                      galleryImages={designDetails.zoom_gallery_images.map((item) => item.image)}
                      groupImages={designDetails.design_groups.map((item) => item.design.zoom_main_image.image)}
                      designImagePath={designImagePath}
                    />
                  )}
                  {showImage && (
                    <ImageView
                      setShowImage={setShowImage}
                      designImagePath={designImagePath}
                      mainImage={designDetails.zoom_gallery_images.map((item) => item.image)}
                    />
                  )}
                </div>
                <div className="col-lg-6">
                  <div className="row">
                    {designDetails.design_groups.slice(0, 4).map((item, key) => (
                      <div className="col-md-6 mb-4" key={key}>
                        <div className="design-img-box position-relative m-auto">
                          {/* <img src={designImagePath + item.design.main_image.image} className="img-fluid w-100" /> */}
                          <div
                            className="des-gallary-img"
                            style={{
                              backgroundImage: `url(${designImagePath + item.design.main_image.image})`,
                            }}
                          ></div>
                          <div className="design-img-hover w-100 h-100 position-absolute top-0 start-0 d-flex align-items-end cursor-pointer">
                            <div className="w-100 h-100">
                              <div className="w-100 h-75 d-flex align-items-center justify-content-center pt-5">
                                <Link href={`/individual-design/${item.design.slug}`}>
                                  <a>
                                    <img src="/images/info-icon.svg" alt="Info" />
                                  </a>
                                </Link>
                              </div>
                              <div className="w-100 h-25 d-flex align-items-end justify-content-start">
                                <span className=" text-white ms-2 mb-2">{item.design.root_category.name}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-12">
                  <div className="row">
                    {designDetails.design_groups.slice(4).map((item, key) => (
                      <div className="col-lg-3 mb-4" key={key}>
                        <div className="design-img-box position-relative m-auto">
                          <img src={designImagePath + item.design.main_image.image} className="img-fluid w-100" />
                          <div className="design-img-hover w-100 h-100 position-absolute top-0 start-0 d-flex align-items-end cursor-pointer">
                            <div className="w-100 h-100">
                              <div className="w-100 h-75 d-flex align-items-center justify-content-center pt-5">
                                <Link href={`/individual-design/${item.design.slug}`}>
                                  <a>
                                    <img src="/images/info-icon.svg" alt="Info" />
                                  </a>
                                </Link>
                              </div>
                              <div className="w-100 h-25 d-flex align-items-end justify-content-start">
                                <span className=" text-white ms-2 mb-2">{item.design.root_category.name}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-0 mt-md-5">
                {designDetails.english_description && (
                  <div className="d-flex align-items-center pb-3">
                    <h3 className="fs-20 fw-700 heading-fonts m-0">Specifications</h3>
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
                <ReadMore maxLength={200}>
                  {(descLang == 'En' && designDetails.english_description) || designDetails.hindi_description}
                </ReadMore>
                <div className="row align-items-stretch">
                  {designDetails.design_groups.map((item, key) => (
                    <div className="col-lg-6 col-xl-4 col-12 p-2" key={key}>
                      <Link href={`/individual-design/${item.design.slug}`}>
                        <a className="d-flex p-3 rounded gray-box h-100 decoration-none label-color-2">
                          <div className="">
                            <img
                              src={designImagePath + item.design.main_image.image}
                              width={140}
                              height={105}
                              className="img-box"
                              alt={item.design.main_image.image_alt || ''}
                              title={item.design.main_image.image_alt || ''}
                            />
                          </div>
                          <div className="ps-3">
                            <h6 className="fs-16 fw-600">
                              {item.design.root_category.name} ({item.design.code})
                            </h6>

                            <div className="fs-14 fw-400 pb-1">
                              <span
                                className={`d-inline-block ${
                                  (designDetails.root_category.name == 'Bed Designs' && 'info-large-title') ||
                                  'info-title'
                                }`}
                              >
                                Category
                              </span>
                              : {item.design.category.name}
                            </div>
                            <div className="fs-14 fw-400 pb-1">
                              <span
                                className={`d-inline-block ${
                                  (designDetails.root_category.name == 'Bed Designs' && 'info-large-title') ||
                                  'info-title'
                                }`}
                              >
                                Finish
                              </span>
                              {item.design.materials.map((matItem, key) => (
                                <span key={key}>
                                  : {matItem.name}
                                  {(key == item.design.materials.length - 1 && ' ') || ','}
                                </span>
                              ))}
                            </div>
                            <div className="fs-14 fw-400 pb-1">
                              <span
                                className={`d-inline-block ${
                                  (designDetails.root_category.name == 'Bed Designs' && 'info-large-title') ||
                                  'info-title'
                                }`}
                              >
                                {(item.design.root_category.name == 'Bed Designs' && 'Mattress') || ''}Size
                              </span>
                              {item.design.design_sizes.map((size, key) => (
                                <span key={key}>
                                  : {size.name}
                                  <span>
                                    {(size.size.size_type == 1 && ' (WXH)') || ''}
                                    {(size.size.size_type == 2 && ' (LXW)') || ''}
                                    {(size.size.size_type == 3 && ' (Seater)') || ''}
                                  </span>
                                </span>
                              ))}
                            </div>
                          </div>
                        </a>
                      </Link>
                    </div>
                  ))}
                </div>
                <div className="border-box-line"></div>
                <div className=" px-md-0">
                  <h3 className="fs-20 fw-700 heading-fonts m-0 text-black">What you will get</h3>
                  <div className="row gray-box des-features-box what-you-will-box mt-3 mx-md-0">{renderFeatures()}</div>
                </div>
              </div>
              {(relatedDesigns && relatedDesigns.length > 0 && (
                <div className="row">
                  <MoreDesigns
                    relatedDesigns={relatedDesigns}
                    designImagePath={designImagePath}
                    designCode={designCode}
                    isGrouped={designDetails.is_grouped}
                    categorySlug={designDetails.root_category.slug}
                  />
                </div>
              )) ||
                ''}
            </>
          )}
          {/* {isLoading && <GroupedDesignLoader />} */}
          {!designDetails && <p className="text-center text-black fw-600 py-4 fs-20">{errorMessage}</p>}
        </div>
        <div className="d-md-none d-block text-center position-fixed left-0 bg-white w-100 p-3 bottom-0 mobile-cart-btn">
          {designDetails && designDetails.is_groupdesign_in_cart_count == 0 && (
            <button className="blue-btn free-download-btn" onClick={addToCart}>
              Add to Cart
            </button>
          )}
          {designDetails && designDetails.is_groupdesign_in_cart_count > 0 && (
            <Link href={'/my-cart'}>
              <a className="blue-btn free-download-btn btn decoration-none">Go to Cart</a>
            </Link>
          )}
          {designDetails && designDetails.is_groupdesign_purchased_count > 0 && (
            <a className="blue-btn free-download-btn btn decoration-none" download onClick={downloadDesign}>
              Download
            </a>
          )}
        </div>
      </section>
    </>
  );
}

GroupedDesign.propTypes = {
  designCode: PropTypes.string,
  designDetailsData: PropTypes.object,
};

export default GroupedDesign;
