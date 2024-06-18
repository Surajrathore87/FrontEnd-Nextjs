import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import React from 'react';
import { Modal } from 'react-bootstrap';
import Slider from 'react-slick';

function SingleImageView(props) {
  const { mainImage, twoDimensionImage, setShowSingleImage, galleryImages, designImagePath, groupImages } = props;
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

  return (
    <Modal
      show={true}
      onHide={setShowSingleImage}
      className="full-img-modal"
      backdropClassName="bg-white img-backdrop"
      contentClassName="bg-transparent border-0 vh-100"
      centered
    >
      <Modal.Body className="text-center vh-100 d-flex align-items-center justify-content-center">
        <button
          onClick={() => setShowSingleImage(false)}
          className="border-0 outline-none p-2 cross-btn p-0 position-absolute top-0 end-0 mt-3 me-3"
        >
          <img src="/images/cross-icon.svg" alt="Close" width={30} />
        </button>
        <Slider {...settings} className="w-100">
          {twoDimensionImage && (
            <div className="vh-100 d-flex align-items-center justify-content-center img-view-slide">
              <img src={twoDimensionImage} alt="Image" className="img-fluid" />
            </div>
          )}
          {mainImage && (
            <div className="vh-100 d-flex align-items-center justify-content-center img-view-slide">
              <img src={mainImage} alt="Image" className="img-fluid" />
            </div>
          )}
          {groupImages &&
            groupImages.map((item, key) => (
              <div key={key} className="vh-100 d-flex align-items-center justify-content-center img-view-slide">
                <img src={designImagePath + item} alt="Image" className="img-fluid" />
              </div>
            ))}
          {galleryImages &&
            galleryImages.map((item, key) => (
              <div key={key} className="vh-100 d-flex align-items-center justify-content-center img-view-slide">
                <img src={designImagePath + item} alt="Image" className="img-fluid" />
              </div>
            ))}
        </Slider>
      </Modal.Body>
    </Modal>
  );
}

export default SingleImageView;
