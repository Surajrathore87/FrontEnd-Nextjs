import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import React from 'react';
import { Modal } from 'react-bootstrap';
import Slider from 'react-slick';

function ImageView(props) {
  const { mainImage, setShowImage, designImagePath, galleryImage } = props;
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
      onHide={setShowImage}
      className="full-img-modal"
      backdropClassName="bg-white img-backdrop"
      contentClassName="bg-transparent border-0 vh-100"
      centered
    >
      <Modal.Body className="text-center vh-100 d-flex align-items-center justify-content-center">
        <button
          onClick={() => setShowImage(false)}
          className="border-0 outline-none p-2 cross-btn p-0 position-absolute top-0 end-0 mt-3 me-3"
        >
          <img src="/images/cross-icon.svg" alt="Close" width={30} />
        </button>

        <Slider {...settings} className="w-100">
          {mainImage && (
            <div className="d-flex align-items-center vh-100 img-view-slide">
              <img src={designImagePath + mainImage} alt="Image" className="img-fluid mx-auto" />
            </div>
          )}
          {galleryImage &&
            galleryImage.map((item, key) => (
              <div key={key} className="d-flex align-items-center vh-100 img-view-slide">
                <img src={designImagePath + item} alt="Image" className="img-fluid mx-auto" />
              </div>
            ))}
        </Slider>
      </Modal.Body>
    </Modal>
  );
}

export default ImageView;
