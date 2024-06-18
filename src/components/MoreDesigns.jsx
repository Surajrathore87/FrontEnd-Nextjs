import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick/lib/slider';
import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';

function MoreDesigns(props) {
  const { relatedDesigns, designImagePath, designCode, isGrouped, categorySlug } = props;
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    autoplay: true,
    arrows: true,
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 3,
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

  function getDesignCods() {
    const cods = relatedDesigns.map((item) => item.slug);
    localStorage.setItem('designCods', JSON.stringify(cods));
    localStorage.setItem('currentUrl', `/${(isGrouped == 1 && 'grouped-design') || 'individual-design'}/${designCode}`);
    localStorage.setItem('prevSlug', categorySlug);
  }

  function renderSlider() {
    return relatedDesigns.map((item, key) => {
      return (
        <div key={key}>
          <Link href={`/designs/${item.slug}`}>
            <a className="design-img-box position-relative m-auto me-md-2 d-block" onClick={getDesignCods}>
              {/* <img src={designImagePath + item.main_image.image} className="img-fluid w-100 h-100" /> */}
              <div
                className="more-des-img"
                style={{
                  backgroundImage: `url(${designImagePath + item.main_image.image})`,
                }}
              ></div>
              <div className="design-img-hover w-100 h-100 position-absolute bottom-0 start-0 d-flex align-items-end cursor-pointer">
                <div className="w-100 h-25 d-flex align-items-end justify-content-start">
                  <span className=" text-white ms-2 mb-2">{item.root_category.name}</span>
                </div>
              </div>
            </a>
          </Link>
        </div>
      );
    });
  }

  return (
    <>
      <div className="col-12">
        <div className="mt-md-5 mt-4 also-lik-box">
          <div className="d-flex pb-4 align-items-center">
            <div className="col-6">
              <h3 className="text-black fw-700 heading-fonts">You may also like</h3>
            </div>
            <div className="col-md-6 text-end ms-auto">
              <Link href={`/home-interior-design/${categorySlug}`}>
                <a className="red-btn decoration-none btn shadow-none cursor-pointer">See all</a>
              </Link>
            </div>
          </div>
          <div className="signle-design-slider">
            <Slider {...settings}>{relatedDesigns && renderSlider()}</Slider>
          </div>
        </div>
      </div>
    </>
  );
}

MoreDesigns.propTypes = {
  categoryData: PropTypes.array,
  designImagePath: PropTypes.string,
};

export default MoreDesigns;
