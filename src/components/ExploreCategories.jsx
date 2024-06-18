import Link from 'next/link';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

function ExploreCategories(props) {
  const { categoriesPageData } = props;
  const [isLoading, setIsLoading] = useState(true);

  function renderCategories() {
    return categoriesPageData.data.categories.map((item, key) => {
      return (
        <Link key={key} href={`/home-interior-design/${item.slug}`}>
          <a className="col-lg-3 col-md-6 col-sm-6 decoration-none">
            <div className="fingure-tips-box my-3 exp-category-box">
              <div
                className="exp-category-box-img"
                style={{
                  backgroundImage: `url(${categoriesPageData.data.image_path_thumb + item.thumb_image.image})`,
                }}
              ></div>
              <div className="d-flex align-items-center py-3 px-3 justify-content-center fs-20 ">
                <h4 className="m-0 text-nowrap p-0">{item['name']}</h4>
              </div>
            </div>
          </a>
        </Link>
      );
    });
  }

  return (
    <>
      <div className="pb-md-5 pb-3 border-top explore-categorie-section">
        <div className="container pt-lg-5 pt-4">
          <div className="text-center">
            <h1 className="inner-heading text-start">Categories</h1>
          </div>
          <div className="row">
            {categoriesPageData && renderCategories()}
            {!categoriesPageData && <p className="fs-18 mt-5 text-center fw-600 text-black">No Categories Available</p>}
            {/* {(!isLoading && (
              <div className="col-lg-12">
                <div className="row">
                  {new Array(4).fill().map((_, key) => (
                    <div key={key} className="col-lg-3 mb-4">
                      <Skeleton height={268} />
                    </div>
                  ))}
                </div>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </>
  );
}

ExploreCategories.propTypes = {
  categoriesPageData: PropTypes.object,
};

export default ExploreCategories;
