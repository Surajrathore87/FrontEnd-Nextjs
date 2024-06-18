import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import React from 'react';
import Slider from 'react-slick';
import Link from 'next/link';
import PropTypes from 'prop-types';

function Banner(props) {
  const { sliderImages, sliderImagePath, homepageContent } = props;
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    arrows: true,
  };

  function renderSlider() {
    return sliderImages.map((item, key) => {
      return (
        <div className="slider-items" key={key}>
          <Link href={item.link || '/'}>
            <a className="d-block">
              <img
                className="d-block img-fluid"
                src={sliderImagePath + item.thumb_image.image}
                alt={item.image_alt || ''}
                title={item.image_alt || ''}
              />
            </a>
          </Link>
        </div>
      );
    });
  }
  return (
    <>
      {homepageContent && (
        <section className="main-banner">
          <div className="container">
            <div className="row align-items-stretch">
              <div className="col-xl-6 d-flex align-items-center pb-md-0">
                <div className="text-center text-xl-start w-100 mb-xl-0 mb-4">
                  <h1 className="pb-3 label-color-2 text-capitalize">
                    {homepageContent && homepageContent.main_title}
                    <br />
                    <span className="pt-lg-3 d-inline-block">
                      {homepageContent && homepageContent.main_description}
                    </span>
                  </h1>
                  <div className="pt-lg-3">
                    <Link href="/home-interior-design">
                      <a className="blue-btn fs-16 fw-700 explore-more-btn decoration-none btn shadow-none">
                        Explore More
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-xl-6 banner-right">
                <div className="banner-slider position-relative">
                  <Slider {...settings}>{sliderImages && renderSlider()}</Slider>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

Banner.propTypes = {
  homepageContent: PropTypes.object,
  sliderImagePath: PropTypes.string,
  sliderImages: PropTypes.array,
};
export default Banner;
