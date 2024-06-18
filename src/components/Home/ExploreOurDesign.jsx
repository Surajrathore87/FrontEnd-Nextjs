import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import React from 'react';
import Slider from 'react-slick';
import PropTypes from 'prop-types';
import Link from 'next/link';
function ExploreOurDesign(props) {
  const { categoriesData, categoryImagePath } = props;

  function renderCategories() {
    return categoriesData.map((item, key) => {
      return (
        <Link key={key} href={`/home-interior-design/${item.slug}`}>
          <a className="decoration-none">
            <div className="px-md-3 px-2">
              <div className="slider-item main-shadow main-border rounded-5">
                {/* <img src={categoryImagePath + item.thumb_image.image} className="w-100 rounded-5" height={140} /> */}
                <div
                  className="home-category-img rounded-5"
                  style={{
                    backgroundImage: `url(${categoryImagePath + item.thumb_image.image})`,
                  }}
                ></div>
                <div className="bg-white slider-item-bottom d-flex align-items-center justify-content-center rounded-5">
                  <p className="m-0 py-3 fw-600 text-black fs-15 text-capitalize text-center px-1">{item['name']}</p>
                </div>
              </div>
            </div>
          </a>
        </Link>
      );
    });
  }

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 4,
    autoplay: true,
    arrows: true,
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 5.5,
          slidesToScroll: 5,
        },
      },
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <>
      <div className="explore-categories header-footer-p ">
        <div className="container-fluid px-0 p-md-2">
          <div className="row">
            <div className="col-lg-12">
              <div className="pb-4">
                <h2 className="main-heading text-center heading-fonts exp-cats">Explore Categories</h2>
              </div>
              {categoriesData && (
                <div className="py-md-3 py-2 explore-design-slider">
                  <Slider {...settings}>{renderCategories()}</Slider>
                </div>
              )}
              {!categoriesData && (
                <div className="px-3 pb-5 d-flex align-items-center justify-content-center">
                  <div className="text-center">
                    <p className=" fw-600 fs-18">No Categories available</p>
                  </div>
                </div>
              )}
              <div className="pt-lg-4 pt-5 text-center">
                <Link href={'/categories'}>
                  <a className="btn decoration-none blue-btn fw-700 fs-16">See all</a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

ExploreOurDesign.propTypes = {
  categoriesData: PropTypes.array,
  categoryImagePath: PropTypes.string,
};

export default ExploreOurDesign;
