import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import React, { useEffect, useState } from 'react';
import { callAPI } from '_services/CallAPI';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useAuth } from '_contexts/auth';
import ExploreDesignsLoader from 'components/Loaders/ExploreDesignsLoader';

function TrendingMoreDesign(props) {
  const { categoriesData, trendingDesigns, trendingImagePath } = props;
  const { isLoggedIn, setShowLogin } = useAuth();
  const [designData, setDesignData] = useState(null);
  const [designsImagePath, setDesignsImagePath] = useState();
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // getDesignData();
  }, []);

  function getDesignData(slug) {
    setSelectedCategory(slug);
    const params = {
      is_trending: 1,
      thumbnail_id: 4,
      main_category_slug: slug,
    };
    callAPI('POST', process.env.HOME_DESIGNS_DATA, params, (res) => {
      setIsLoading(false);
      if (res.status) {
        const data = res['data'];
        setDesignData(data.designs);
        setDesignsImagePath(data.image_path);
      } else {
        setDesignData(null);
      }
    });
  }

  function renderCategories() {
    return categoriesData.map((item, key) => {
      return (
        <li key={key} className="mx-md-2 mx-1 d-inline-block">
          <span
            onClick={() => getDesignData(item.slug)}
            className={`trending-option d-inline-block text-nowrap  ${
              selectedCategory == item.slug ? 'active-option' : ''
            }`}
          >
            {item.name}
          </span>
        </li>
      );
    });
  }

  function getDesignCods(isTrending) {
    // const cods = designData && designData.map((item) => item.code);
    // localStorage.setItem('designCods', JSON.stringify(cods));
    localStorage.setItem('currentUrl', '/');
    localStorage.setItem('prevSlug', selectedCategory);
    localStorage.setItem('isTrending', isTrending);
  }
  function renderDesigns() {
    return trendingDesigns.map((item, key) => {
      return (
        <Link href={`/designs/${item.slug}`} key={key}>
          <a className="col-lg-4 col-xl-3 col-md-6 py-lg-2 px-2 py-3" onClick={() => getDesignCods(item.is_trending)}>
            <div className="text-center trending-more-img mb-3">
              <div
                className="home-trending-img"
                style={{
                  backgroundImage: `url(${trendingImagePath + item.main_image.image})`,
                }}
              ></div>
              <div className="trending-more-hover position-absolute w-100 top-0 start-0 d-flex align-items-end ps-3 pb-2">
                <span className="fs-16 fw-600 text-white">{item.root_category.name}</span>
              </div>
            </div>
          </a>
        </Link>
      );
    });
  }

  function renderDesignsNew() {
    return designData.map((item, key) => {
      return (
        <Link href={`/designs/${item.slug}`} key={key}>
          <a className="col-lg-4 col-xl-3 col-md-6 py-lg-2 px-2" onClick={() => getDesignCods(item.is_trending)}>
            <div className="text-center trending-more-img mb-3">
              <div
                className="home-trending-img"
                style={{
                  backgroundImage: `url(${designsImagePath + item.main_image.image})`,
                }}
              ></div>
              <div className="trending-more-hover position-absolute w-100 top-0 start-0 d-flex align-items-end ps-3 pb-2">
                <span className="fs-16 fw-600 text-white">{item.root_category.name}</span>
              </div>
            </div>
          </a>
        </Link>
      );
    });
  }

  return (
    <>
      <div className="bg-light-blue trending-more-section">
        <div className="container-fluid">
          <h2 className="main-heading text-center heading-fonts">Trending More Design</h2>
          <div className="py-md-4 py-2 pb-0 text-center table-responsive">
            <ul className="my-0 mx-auto list-unstyled d-lg-flex justify-content-center w-max-content">
              <li className="mx-md-2 mx-1 d-inline-block">
                <span
                  onClick={() => getDesignData('')}
                  className={`trending-option d-inline-block text-nowrap  ${
                    (!selectedCategory && 'active-option') || ''
                  }`}
                >
                  All Design
                </span>
              </li>
              {renderCategories()}
            </ul>
          </div>
          <div className="row justify-content-center p-0 py-3">
            {trendingDesigns && !designData && renderDesigns()}
            {designData && renderDesignsNew()}
            {/* {!isLoading && !designData && <p className="text-center fw-600 my-3">No designs available</p>} */}
            {/* {isLoading && <ExploreDesignsLoader />} */}
          </div>
          {/* {!isLoggedIn && (
            <div className="pt-md-4 pt-2 text-center">
              <button className="red-btn rounded-6 fs-16 fw-700" onClick={() => setShowLogin(true)}>
                Sign In For More Options
              </button>
            </div>
          )} */}
        </div>
      </div>
    </>
  );
}

TrendingMoreDesign.propTypes = {
  categoriesData: PropTypes.array,
  trendingDesigns: PropTypes.array,
  trendingImagePath: PropTypes.string,
};

export default TrendingMoreDesign;
