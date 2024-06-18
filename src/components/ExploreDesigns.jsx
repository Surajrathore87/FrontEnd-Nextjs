import { faFilter, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { callAPI } from '_services/CallAPI';
import PropTypes from 'prop-types';
import { useAuth } from '_contexts/auth';
import Skeleton from 'react-loading-skeleton';
// import InfiniteScroll from 'react-infinite-scroll-component';
import InfiniteScroll from 'react-infinite-scroller';
import parse from 'html-react-parser';

const ListFilterModal = dynamic(import('components/Modal/ListFilterModal'));
const WishlistFolders = dynamic(import('components/Modal/WishlistFolders'));
const RemoveFromWishlist = dynamic(import('./Modal/RemoveFromWishlist'));
const ExploreDesignsLoader = dynamic(import('components/Loaders/ExploreDesignsLoader'));
function ExploreDesigns(props) {
  const { designSlug, exploreDesignsData } = props;
  const [showListFilterModal, setShowListFilterModal] = useState(false);
  const [designData, setDesignData] = useState(exploreDesignsData.data.designs);
  const [designsImagePath, setDesignsImagePath] = useState(exploreDesignsData.data.image_path);
  const [categoryDesc, setCategoryDesc] = useState(exploreDesignsData.data.category_description);
  const [categoryShortDesc, setCategoryShortDesc] = useState(exploreDesignsData.data.category_short_description);
  const [appliedFilters, setAppliedFilters] = useState(null);
  const [noDataFound, setNoDataFound] = useState(false);
  const [checkMaterial, setCheckMaterial] = useState([]);
  const [checkCategory, setCheckCategory] = useState([]);
  const [checkSizes, setCheckSizes] = useState([]);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showRemoveWishlist, setShowRemoveWishlist] = useState(false);
  const [designId, setDesignId] = useState(null);
  const [wishlistId, setWishlistId] = useState(null);
  const [updateWishlist, setUpdateWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(exploreDesignsData.data.paginate.current_page + 1);
  const [totalDesignCount, setTotalDesignCount] = useState(exploreDesignsData.data.paginate.total);
  const [hasMoreStatus, setHasMoreStatus] = useState(true);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const { isLoggedIn, isContextLoaded, setShowLogin } = useAuth();
  const [filterObject, setFilterObject] = useState({});
  const [nextPageUrl, setNextPageUrl] = useState('');
  const appliedFiltersData = {
    categories: checkCategory,
    materials: checkMaterial,
    sizes: checkSizes,
  };
  useEffect(() => {
    setDesignData([]);
  }, [designSlug]);

  function resetPagination() {
    setPage(1);
    setHasMoreStatus(true);
    setTotalDesignCount(0);
    setDesignData([]);
  }

  useEffect(() => {
    if (isContextLoaded && designSlug) {
      resetPagination();
      getDesignData(true);
    }
  }, [designSlug, noDataFound, updateWishlist, isContextLoaded, isLoggedIn]);

  useEffect(() => {
    if (totalDesignCount && totalDesignCount == designData.length) {
      setHasMoreStatus(false);
    }
  }, [designData]);

  async function getDesignData(initial = false) {
    const params = {
      thumbnail_id: 4,
      main_category_slug: designSlug == 'all' ? '' : designSlug,
    };
    await callAPI('POST', `${process.env.EXPLORE_DESIGNS_DATA}?page=${initial ? 1 : page}`, params, (res) => {
      if (res.status) {
        const data = res['data'];
        setPage(data.paginate.current_page + 1);
        setDesignData((designData) => [...designData, ...data.designs]);
        if (!data.paginate.next_page_url) {
          setHasMoreStatus(false);
          setNextPageUrl(null);
        } else {
          setNextPageUrl(data.paginate.next_page_url);
        }
        setIsFilterApplied(false);
        setDesignsImagePath(data.image_path);
        setTotalDesignCount(data.paginate.total);
        setAppliedFilters(null);
        setCategoryDesc(data.category_description);
        setCategoryShortDesc(data.category_short_description);
        // setIsLoading(false);
      } else {
        // setIsLoading(false);
        setNoDataFound(true);
      }
    });
  }
  function getDesignCods() {
    // const cods = designData.map((item) => item.code);
    // localStorage.setItem('designCods', JSON.stringify(cods));
    localStorage.setItem('currentUrl', `/home-interior-design/${designSlug}`);
    localStorage.setItem('prevSlug', designSlug);
    localStorage.setItem('isTrending', 0);
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

  function renderDesigns() {
    return designData.map((item, key) => {
      return (
        <div className="col-lg-4 col-md-6 mb-4 position-relative design-container" key={key}>
          <Link href={`/designs/${item.slug}`}>
            <a onClick={getDesignCods}>
              <div className="list-img-box position-relative m-auto cursor-pointer">
                <div
                  className="img-explore"
                  style={{
                    backgroundImage: `url(${designsImagePath + item.main_image.image})`,
                  }}
                ></div>
                {/* <img src={designsImagePath + item.main_image.image} className="img-fluid h-100 w-100" alt="" /> */}
                <div className="img-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-end pb-2 justify-content-center"></div>
              </div>
            </a>
          </Link>
          <span
            title="Add to Favorites"
            onClick={() => addToWishlist(item.id, item.wishlist_count)}
            className={`heart-icon d-none align-items-center position-absolute start-0 end-0 m-auto
                    justify-content-center cursor-pointer ${(item.wishlist_count == 1 && 'iswishlist') || ''}`}
          ></span>
        </div>
      );
    });
  }

  const removeMatFilter = (itemId) => {
    const checkRemovedId = checkMaterial.filter(function (item) {
      return item.id != itemId;
    });
    setCheckMaterial(checkRemovedId);
    if (checkSizes?.length > 0 || checkRemovedId?.length > 0 || checkCategory?.length > 0) {
      applyFilters(checkSizes, checkRemovedId, checkCategory, true);
    } else {
      resetPagination();
      getDesignData(true);
    }
  };

  const removeCatFilter = (itemId) => {
    const checkRemovedId = checkCategory.filter(function (item) {
      return item.id != itemId;
    });
    setCheckCategory(checkRemovedId);
    if (checkSizes?.length > 0 || checkMaterial?.length > 0 || checkRemovedId?.length > 0) {
      applyFilters(checkSizes, checkMaterial, checkRemovedId, true);
    } else {
      resetPagination();
      getDesignData(true);
    }
  };

  const removeSizeFilter = (itemId) => {
    const checkRemovedId = checkSizes.filter(function (item) {
      return item.id != itemId;
    });
    setCheckSizes(checkRemovedId);
    if (checkRemovedId?.length > 0 || checkMaterial?.length > 0 || checkCategory?.length > 0) {
      applyFilters(checkRemovedId, checkMaterial, checkCategory, true);
    } else {
      resetPagination();
      getDesignData(true);
    }
  };

  async function applyFilters(sizes, matIds, catIds, initial = false) {
    const sizeId = sizes && sizes.map((item) => item.id);
    const matId = matIds && matIds.map((item) => item.id);
    const catId = catIds && catIds.map((item) => item.id);
    const params = {
      main_category_slug: designSlug == 'all' ? '' : designSlug,
      materials: matId,
      categories: catId,
      sizes: sizeId,
      thumbnail_id: 4,
    };
    await callAPI('POST', `${process.env.EXPLORE_DESIGNS_DATA}?page=${initial ? 1 : page}`, params, (res) => {
      if (res.status) {
        const data = res['data'];
        setPage(data.paginate.current_page + 1);
        setDesignData((designData) => [...designData, ...data.designs]);
        if (!data.paginate.next_page_url) {
          // setHasMoreStatus(false);
          setNextPageUrl(null);
        } else {
          setNextPageUrl(data.paginate.next_page_url);
        }
        // setDesignData(data.designs);
        setAppliedFilters(appliedFiltersData);
        setShowListFilterModal(false);
        setIsFilterApplied(true);
        setFilterObject({
          sizes: sizes || [],
          matIds: matIds || [],
          catIds: catIds || [],
        });
      } else {
        setAppliedFilters(appliedFiltersData);
        setNoDataFound(true);
        setShowListFilterModal(false);
      }
    });
  }
  const hasMoreItems = !!nextPageUrl;
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
      {showListFilterModal && (
        <ListFilterModal
          closeModal={() => setShowListFilterModal(false)}
          designSlug={designSlug}
          checkMaterial={checkMaterial}
          setCheckMaterial={setCheckMaterial}
          checkCategory={checkCategory}
          setCheckCategory={setCheckCategory}
          checkSizes={checkSizes}
          setCheckSizes={setCheckSizes}
          resetPagination={resetPagination}
          applyFilters={applyFilters}
          appliedFiltersData={appliedFiltersData}
        />
      )}
      <div className="container list-page ">
        <div className="pt-4">
          <div className="">
            {categoryShortDesc && (
              <h1 className="inner-heading my-lg-0 my-3 heading-fonts">{parse(categoryShortDesc)}</h1>
            )}
            <div className="d-flex align-items-center pb-md-4 flex-direction-col position-relative">
              {(!categoryShortDesc && (
                <h1 className="inner-heading my-lg-0 my-3 heading-fonts">
                  {(designData && (
                    <span>
                      {(designSlug && designSlug == 'all' && 'All Designs') ||
                        designData.slice(0, 1).map((item) => item.root_category.name)}
                    </span>
                  )) || <Skeleton height={36} width={150} />}
                </h1>
              )) ||
                ''}
              <div className="ms-auto text-end filter-mobile-btn">
                <button
                  className="blue-btn text-nowrap py-2 px-4 d-flex align-items-center"
                  onClick={() => setShowListFilterModal(true)}
                >
                  <FontAwesomeIcon icon={faFilter} className="me-md-2 fs-18" width={18} height={18} />
                  <span className="d-none d-md-block">Filter</span>
                </button>
              </div>
            </div>
            {appliedFilters && (
              <div className="d-md-flex flex-wrap">
                {appliedFiltersData.materials?.length > 0 &&
                  appliedFiltersData.materials.map((item, key) => (
                    <span key={key} className="list-filter-tag d-inline-block fs-12 fw-500 text-nowrap me-2 mb-2">
                      {item.name}
                      <FontAwesomeIcon
                        onClick={(itemId) => removeMatFilter((itemId = item.id))}
                        icon={faTimes}
                        className="ms-2 cursor-pointer fw-400"
                        width={15}
                        height={15}
                      />
                    </span>
                  ))}
                {appliedFiltersData.categories?.length > 0 &&
                  appliedFiltersData.categories.map((item, key) => (
                    <span key={key} className="list-filter-tag d-inline-block fs-12 fw-500 text-nowrap me-2 mb-2">
                      {item.name}
                      <FontAwesomeIcon
                        onClick={(itemId) => removeCatFilter((itemId = item.id))}
                        icon={faTimes}
                        className="ms-2 cursor-pointer fw-400"
                        width={15}
                        height={15}
                      />
                    </span>
                  ))}
                {checkSizes?.length > 0 &&
                  checkSizes.map((item, key) => (
                    <span key={key} className="list-filter-tag d-inline-block fs-12 fw-500 text-nowrap me-2 mb-2">
                      {item.sizeCategoryName + ' Size: '}
                      {item.name}
                      <FontAwesomeIcon
                        onClick={(itemId) => removeSizeFilter((itemId = item.id))}
                        icon={faTimes}
                        className="ms-2 cursor-pointer fw-400"
                        width={15}
                        height={15}
                      />
                    </span>
                  ))}
              </div>
            )}
            <div className={`pt-2 ${isLoggedIn && 'mb-4'}`}>
              {designData && !noDataFound && (
                // <InfiniteScroll
                //   dataLength={designData.length}
                //   next={() => {
                //     if (isFilterApplied) {
                //       applyFilters(filterObject.sizeId, filterObject.matIds, filterObject.catIds, false);
                //     } else {
                //       getDesignData(false);
                //     }
                //   }}
                //   hasMore={hasMoreStatus}
                //   className="overflow-hidden"
                //   loader={<ExploreDesignsLoader />}
                //   endMessage={''}
                // >
                //   <div className="row rendered-designs">{renderDesigns()}</div>
                // </InfiniteScroll>
                <InfiniteScroll
                  pageStart={0}
                  threshold={750}
                  loadMore={async () => {
                    if (isFilterApplied) {
                      await applyFilters(filterObject.sizeId, filterObject.matIds, filterObject.catIds, false);
                    } else {
                      await getDesignData(false);
                    }
                  }}
                  hasMore={hasMoreItems}
                  loader={<ExploreDesignsLoader key={0} />}
                >
                  <div className="row rendered-designs">{renderDesigns()}</div>
                </InfiniteScroll>
              )}
              {/* {!isLoading && designData && !noDataFound && renderDesigns()} */}
              {/* {isLoading && <ExploreDesignsLoader />} */}
              {noDataFound && <p className="text-center fw-600 my-3">No designs available</p>}
            </div>
            {!isLoggedIn && (
              <div className="text-center py-md-4 my-2">
                <button className="blue-btn py-2 fs-16 fw-700 list-btn rounded-6" onClick={() => setShowLogin(true)}>
                  Sign In For More Options
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

ExploreDesigns.propTypes = {
  designSlug: PropTypes.string,
};

export default ExploreDesigns;
