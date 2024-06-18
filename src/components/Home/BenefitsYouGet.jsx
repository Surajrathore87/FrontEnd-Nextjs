import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

function BenefitsYouGet(props) {
  const { homepageContent, homeImagePath } = props;
  return (
    <>
      <section>
        {/* 1 */}
        <div className="home-comman-box position-relative pt-0 overflow-hidden home-section-1">
          <div className="skew-1">
            <div className="container">
              <div className="row py-3">
                <div className="col-12">
                  <h2 className="main-heading text-center p-md-2 p-0 text-capitalize heading-fonts benefits-title mb-lg-0 mb-3">
                    {/* {homepageContent && homepageContent.benefits_title} */}
                    Benifits you get when using
                  </h2>
                  {/* <p className="main-p text-center">{homepageContent && homepageContent.benefits_title_tagline}</p> */}
                </div>
                <div className="col-12 pt-3 pt-lg-5 pt-4">
                  <div className="row align-items-stretch">
                    <div className="col-lg-6 d-flex align-items-center justify-content-start">
                      <div className="comman-left-img-box d-flex p-lg-4 align-items-center justify-content-center overflow-hidden">
                        <img
                          src={homepageContent && homeImagePath + homepageContent.benefits_subimage_1}
                          className="img-fluid mb-3 mb-lg-0"
                          alt={(homepageContent && homepageContent.benefits_subimage_1_alt) || ''}
                          title={(homepageContent && homepageContent.benefits_subimage_1_alt) || ''}
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 d-flex align-items-center">
                      <div className="d-flex d-md-block ps-lg-4 mx-lg-0 mx-auto text-lg-start text-center">
                        {/* <div className="pb-lg-3 pb-md-2 pe-2">
                        <img src="/images/image-icon.svg" alt="" className="design-icon-box" />
                      </div> */}
                        <div>
                          <img
                            src={homeImagePath && homeImagePath + homepageContent.benefits_subimage_icon_1}
                            width={57}
                            className="img-fluid mb-lg-3 mb-2"
                            alt={(homepageContent && homepageContent.benefits_subimage_icon_1_alt) || ''}
                            title={(homepageContent && homepageContent.benefits_subimage_icon_1_alt) || ''}
                          />
                          <h3 className="text-capitalize heading-fonts sub-heading pb-lg-2">
                            {homepageContent && homepageContent.benefits_subtitle_1}
                          </h3>
                          {/* <p className="main-p pe-lg-5 mb-md-0">
                          {homepageContent && homepageContent.benefits_subdescription_1}
                        </p> */}
                          <div className="pt-lg-4">
                            <Link href="/home-interior-design">
                              <a className="blue-btn fs-16 fw-700 decoration-none btn shadow-none">Explore Designs</a>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bottom-image position-absolute">
            <img src="/images/box-dots.svg" />
          </div>
        </div>

        {/* 2 */}
        <section className="home-comman-box position-relative pt-0 overflow-hidden home-section-2">
          <div className="skew-2">
            <div className="container">
              <div className="row py-3 mt-3 home-flex-reverse align-items-stretch">
                <div className="col-lg-6 d-flex align-items-center">
                  <div className="d-flex d-md-block pe-lg-4 mx-lg-0 mx-auto text-lg-start text-center">
                    {/* <div className="pb-lg-3 pb-2 pe-2">
                    <img src="/images/image-icon.svg" alt="" className="design-icon-box" />
                  </div> */}
                    <div className="text-lg-end">
                      <img
                        src={homeImagePath && homeImagePath + homepageContent.benefits_subimage_icon_2}
                        width={57}
                        className="img-fluid mb-lg-3 mb-2"
                        alt={(homepageContent && homepageContent.benefits_subimage_icon_2_alt) || ''}
                        title={(homepageContent && homepageContent.benefits_subimage_icon_2_alt) || ''}
                      />
                      <h3 className="text-capitalize heading-fonts sub-heading pb-md-2">
                        {homepageContent && homepageContent.benefits_subtitle_2}
                      </h3>
                      {/* <p className="main-p pe-lg-5">{homepageContent && homepageContent.benefits_subdescription_2}</p> */}
                      <div className="pt-lg-4">
                        <Link href="/home-interior-design">
                          <a className="blue-btn fs-16 fw-700 decoration-none btn shadow-none">Know more</a>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 d-flex align-items-center justify-content-end">
                  <div className="comman-right-img-box d-flex p-lg-4 align-items-center justify-content-center overflow-hidden">
                    <img
                      src={homepageContent && homeImagePath + homepageContent.benefits_subimage_2}
                      alt={(homepageContent && homepageContent.benefits_subimage_2_alt) || ''}
                      title={(homepageContent && homepageContent.benefits_subimage_2_alt) || ''}
                      className="img-fluid mb-3 mb-lg-0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bottom-image position-absolute">
            <img src="/images/box-dots.svg" />
          </div>
          {/* <img src="/images/box-dots-01.png" className="comman-img-box" /> */}
        </section>

        {/* 3 */}

        <section className="home-comman-box position-relative pt-0 overflow-hidden home-section-3">
          <div className="skew-3">
            <div className="container">
              <div className="row py-3 mt-lg-5 my-3 align-items-stretch">
                <div className="col-lg-6 d-flex align-items-center justify-content-start">
                  <div className="comman-left-img-box d-flex p-lg-4 align-items-center justify-content-center overflow-hidden">
                    <img
                      src={homepageContent && homeImagePath + homepageContent.benefits_subimage_3}
                      className="img-fluid mb-3 mb-lg-0"
                      alt={(homepageContent && homepageContent.benefits_subimage_3_alt) || ''}
                      title={(homepageContent && homepageContent.benefits_subimage_3_alt) || ''}
                    />
                  </div>
                </div>
                <div className="col-lg-6 d-flex align-items-center">
                  <div className="d-flex d-md-block ps-lg-4 mx-lg-0 mx-auto text-lg-start text-center">
                    {/* <div className="pb-3 pe-2">
                    <img src="/images/measurements-icon.svg" alt="" className="design-icon-box" />
                  </div> */}
                    <div>
                      <img
                        src={homeImagePath && homeImagePath + homepageContent.benefits_subimage_icon_3}
                        width={57}
                        className="img-fluid mb-lg-3 mb-2"
                        alt={(homepageContent && homepageContent.benefits_subimage_icon_3_alt) || ''}
                        title={(homepageContent && homepageContent.benefits_subimage_icon_3_alt) || ''}
                      />
                      <h3 className="text-capitalize heading-fonts sub-heading pb-md-2">
                        {homepageContent && homepageContent.benefits_subtitle_3}
                      </h3>
                      {/* <p className="main-p pe-md-5">{homepageContent && homepageContent.benefits_subdescription_3}</p> */}
                      <div className="pt-lg-4">
                        <Link href="/home-interior-design">
                          <a className="blue-btn fs-16 fw-700 decoration-none btn shadow-none">View more</a>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bottom-image position-absolute">
            <img src="/images/box-dots.svg" />
          </div>
        </section>

        {/* 4 */}

        <section className="home-comman-box position-relative pt-0 overflow-hidden home-section-4">
          <div className="skew-4">
            <div className="container">
              <div className="row py-3 home-flex-reverse align-items-stretch mt-lg-5 my-3">
                <div className="col-lg-6 d-flex align-items-center">
                  <div className="d-flex d-md-block pe-lg-4 mx-lg-0 mx-auto text-lg-start text-center">
                    {/* <div className="pb-3 pe-2">
                    <img src="/images/budget-icon.svg" alt="" className="design-icon-box" />
                  </div> */}
                    <div className="text-lg-end">
                      <img
                        src={homeImagePath && homeImagePath + homepageContent.benefits_subimage_icon_4}
                        width={57}
                        className="img-fluid mb-lg-3 mb-2"
                        alt={(homepageContent && homepageContent.benefits_subimage_icon_4_alt) || ''}
                        title={(homepageContent && homepageContent.benefits_subimage_icon_4_alt) || ''}
                      />
                      <h3 className="text-capitalize heading-fonts sub-heading pb-md-2">
                        {homepageContent && homepageContent.benefits_subtitle_4}
                      </h3>
                      {/* <p className="main-p pe-md-5">{homepageContent && homepageContent.benefits_subdescription_4}</p> */}
                      <div className="pt-lg-4">
                        <Link href="/home-interior-design">
                          <a className="blue-btn fs-16 fw-700 decoration-none btn shadow-none">View more</a>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 d-flex align-items-center justify-content-end">
                  <div className="comman-right-img-box p-lg-4 d-flex align-items-center justify-content-center overflow-hidden">
                    <img
                      src={homepageContent && homeImagePath + homepageContent.benefits_subimage_4}
                      alt={(homepageContent && homepageContent.benefits_subimage_4_alt) || ''}
                      title={(homepageContent && homepageContent.benefits_subimage_4_alt) || ''}
                      className="img-fluid mb-3 mb-lg-0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5 */}
        <section className="home-comman-box home-section-5 pt-lg-1">
          <div className="container">
            <div className="row py-4 mt-lg-5 my-lg-3 align-items-stretch">
              <div className="col-lg-6 d-flex align-items-center justify-content-start">
                <div className="comman-left-img-box d-flex p-lg-4 align-items-center justify-content-center overflow-hidden">
                  <img
                    src={homepageContent && homeImagePath + homepageContent.benefits_subimage_5}
                    className="img-fluid mb-3 mb-lg-0"
                    alt={(homepageContent && homepageContent.benefits_subimage_5_alt) || ''}
                    title={(homepageContent && homepageContent.benefits_subimage_5_alt) || ''}
                  />
                </div>
              </div>
              <div className="col-lg-6 d-flex align-items-center">
                <div className="d-flex d-md-block ps-lg-4 mx-lg-0 mx-auto text-lg-start text-center">
                  {/* <div className="pb-3 pe-2">
                    <img src="/images/complete-designs-icon.svg" alt="" className="design-icon-box" />
                  </div> */}
                  <div>
                    <img
                      src={homeImagePath && homeImagePath + homepageContent.benefits_subimage_icon_5}
                      width={57}
                      alt={(homepageContent && homepageContent.benefits_subimage_icon_5_alt) || ''}
                      title={(homepageContent && homepageContent.benefits_subimage_icon_5_alt) || ''}
                      className="img-fluid mb-lg-3 mb-2"
                    />
                    <h3 className="text-capitalize heading-fonts sub-heading pb-md-2">
                      {homepageContent && homepageContent.benefits_subtitle_5}
                    </h3>
                    {/* <p className="main-p pe-md-5">{homepageContent && homepageContent.benefits_subdescription_5}</p> */}
                    <div className="pt-lg-4">
                      <Link href="/home-interior-design">
                        <a className="blue-btn fs-16 fw-700 decoration-none btn shadow-none">View more</a>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </>
  );
}

BenefitsYouGet.propTypes = {
  homepageContent: PropTypes.object,
  homeImagePath: PropTypes.string,
};
export default BenefitsYouGet;
