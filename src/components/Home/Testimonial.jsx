import React from 'react';
import Slider from 'react-slick/lib/slider';
import PropTypes from 'prop-types';
function Testimonial(props) {
  const { testimonialContent, testimonialImagePath } = props;
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    arrows: false,
  };
  return (
    <>
      <div className="tesitmonial-section bg-white position-relative">
        <div className="container testimonial-container position-relative">
          <div className="pb-md-4 pb-2 ">
            <h2 className="main-heading text-center mb-4 heading-fonts">Happy and Satisfied Clients</h2>
          </div>
          <div className=" position-relative tesimonial-slide-box ">
            <Slider {...settings}>
              {testimonialContent &&
                testimonialContent.map((item, key) => (
                  <div className=" d-md-flex" key={key}>
                    <div className="col-md-6 ">
                      <div className="testimonial-img-box position-relative  py-md-4">
                        <div className="dobule-coat-img position-absolute pt-2 pe-2">
                          <img src="/images/testimonial-double-coat.png" alt="Quote" />
                        </div>
                        <img
                          className="d-block img-fluid "
                          src={testimonialImagePath + item.image}
                          alt={item.image_alt || ''}
                          title={item.image_alt || ''}
                        />
                        <div className="dots-img d-md-block d-none">
                          <img src="/images/testimonial-dots.svg" alt="" />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 d-md-flex align-items-center px-md-5 py-0 py-4 ">
                      <div className=" position-relative  px-3 px-md-0">
                        <img className="contant-box" src="/images/double-coat.svg" />
                        <h3 className="review-sub-heading testimonial-heading heading-fonts">{item.title}</h3>
                        <p className="main-p testimonial-desc">{item.description}</p>
                        <div className="d-flex align-items-center mt-4">
                          <div className="d-flex align-items-center client-profile">
                            <div className="img-box">
                              <img src={testimonialImagePath + item.user_image} alt="User" />
                            </div>
                            <div className="ps-3 pt-lg-2">
                              <h3 className="fs-16 fw-600 m-0">{item.user_name}</h3>
                              <p className="fs-13 m-0 main-p">{item.user_role}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </Slider>
          </div>
        </div>
      </div>
    </>
  );
}

Testimonial.propTypes = {
  testimonialContent: PropTypes.array,
  testimonialImagePath: PropTypes.string,
};
export default Testimonial;
