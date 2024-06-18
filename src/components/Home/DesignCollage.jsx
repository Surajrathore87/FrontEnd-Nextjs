import React from 'react';
import PropTypes from 'prop-types';

function DesignCollage(props) {
  const { homeImagePath, homepageContent } = props;
  return (
    <>
      <section className="home-comman-box collage-section dot-img-left">
        <div className="container">
          <div className="row pb-lg-5 pb-4">
            <div className="col-12 ">
              <div className="pb-3 pb-md-5">
                <h2 className="main-heading text-center text-white heading-fonts benefits-title text-capitalize mt-5 mb-4 my-lg-0">
                  {/* {homepageContent && homepageContent.benefits_collage_title} */}
                  Designs That Define You
                </h2>
                {/* <p className="main-p text-center text-white">
                  {homepageContent && homepageContent.benefits_collage_title_tagline}
                </p> */}
              </div>
              <div className="collage-img-box bg-white p-3 m-auto w-max-content">
                <img
                  src={homepageContent && homeImagePath + homepageContent.benefits_title_image}
                  alt={(homepageContent && homepageContent.benefits_title_image_alt) || ''}
                  title={(homepageContent && homepageContent.benefits_title_image_alt) || ''}
                  className="img-fluid"
                />
              </div>
            </div>
          </div>
        </div>
        <img src="/images/box-dots-01.png" className="comman-img-box" />
      </section>
    </>
  );
}

DesignCollage.propTypes = {
  homepageContent: PropTypes.object,
  homeImagePath: PropTypes.string,
};
export default DesignCollage;
