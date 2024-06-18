import { faFacebookF, faInstagram, faTelegramPlane, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { callAPI } from '_services/CallAPI';

function Footer() {
  const [categories, setCategories] = useState(null);
  const [contactDetails, setContactDetails] = useState(null);
  const router = useRouter();

  useEffect(() => {
    getCategoryData();
  }, []);

  function getCategoryData() {
    callAPI('POST', process.env.HOME_PAGE_DATA, {}, (res) => {
      if (res.status) {
        const data = res['data'];
        setCategories(data.footer_categories);
      }
    });
  }

  function getCompanyData() {
    callAPI('POST', process.env.COMPANY_DETAIL_DATA, {}, (res) => {
      if (res.status) {
        const data = res['data'];
        setContactDetails(data);
      }
    });
  }

  useEffect(() => {
    getCompanyData();
  }, []);

  function renderCategories() {
    return categories.map((item, key) => {
      return (
        <li key={key}>
          <Link href={`/home-interior-design/${item.slug}`}>
            <a className="text-decoration-none text-capitalize" title={item.name}>
              {item.name}
            </a>
          </Link>
        </li>
      );
    });
  }

  return (
    <>
      <footer className={`${(router.pathname == '/designs/[...item]' && 'd-none') || ''}`}>
        <section className="container-fluid custom-footer header-footer-p bg-dark-green ">
          <div className="row py-md-5 py-3 text-md-start">
            <div className="col-md-4 pe-lg-5">
              <div className="pe-lg-5">
                <div className="pt-2 pb-3">
                  <Link href="/">
                    <a className="" title="DsignDpo">
                      <img src="/images/logo-white.svg" />
                    </a>
                  </Link>
                </div>
                <div className="mt-2 mb-4 d-none d-lg-block">
                  <h3 className="text-uppercase">Download Our App</h3>
                  <a href="" target={'_blank'} className="d-block">
                    <img src="/images/google.svg" className="img-fluid" width={140} />
                  </a>
                </div>
                {/* <p className="fs-14 fw-500 text-white mb-2">{contactDetails && contactDetails.name}</p>
                <p className="fs-14 fw-500 text-white mb-lg-4">{contactDetails && contactDetails.address}</p> */}
                <div className="d-md-none mt-3">
                  <h3 className="text-uppercase">Quick Links</h3>
                  <ul className="list-unstyled justify-content-center">
                    <li className="mb-2">
                      <Link href={'/terms-and-conditions'}>
                        <a title="Terms and Conditions" className="text-decoration-none">
                          Terms and Conditions
                        </a>
                      </Link>
                    </li>
                    <li className="mb-2">
                      <Link href={'/privacy-policy'}>
                        <a title="Privacy Policy" className="text-decoration-none">
                          Privacy Policy
                        </a>
                      </Link>
                    </li>
                    <li className="mb-2">
                      <Link href={'/refund-policy'}>
                        <a title="Refund Policy" className="text-decoration-none">
                          Refund Policy
                        </a>
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="social-media-box d-flex align-items-center justify-content-md-start">
                  <a
                    href={`${(contactDetails && contactDetails.facebook_link) || 'http://www.facebook.com'}`}
                    target={'_blank'}
                    className="me-3"
                    title="Facebook"
                  >
                    <div className="social-media-icon d-flex align-items-center justify-content-center border border-white text-white">
                      <FontAwesomeIcon icon={faFacebookF} width={16} height={16} />
                    </div>
                  </a>
                  <a
                    href={`${(contactDetails && contactDetails.instagram_link) || 'http://www.instagram.com'}`}
                    target={'_blank'}
                    className="me-3"
                    title="Instagram"
                  >
                    <div className="social-media-icon d-flex align-items-center justify-content-center border border-white text-white">
                      <FontAwesomeIcon icon={faInstagram} width={16} height={16} />
                    </div>
                  </a>
                  <a
                    href={`${(contactDetails && contactDetails.twitter_link) || 'http://www.twitter.com'}`}
                    target={'_blank'}
                    className="me-3"
                    title="Twitter"
                  >
                    <div className="social-media-icon d-flex align-items-center justify-content-center border border-white text-white">
                      <FontAwesomeIcon icon={faTwitter} width={16} height={16} />
                    </div>
                  </a>
                  <a
                    href={`${(contactDetails && contactDetails.telegram_link) || 'https://telegram.org/'}`}
                    target={'_blank'}
                    className="me-3"
                    title="Telegram"
                  >
                    <div className="social-media-icon d-flex align-items-center justify-content-center border border-white text-white">
                      <FontAwesomeIcon icon={faTelegramPlane} width={16} height={16} />
                    </div>
                  </a>
                </div>
              </div>
            </div>
            <div className="col-md-8">
              <div className="row">
                <div className="col-md-4 pt-3 d-none d-md-block px-4 footer-category-box">
                  <h3 className="text-uppercase  pb-md-1">Category</h3>
                  <ul type="none" className="p-0">
                    {categories && renderCategories()}
                  </ul>
                </div>
                <div className="col-md-4 pt-3 d-none d-md-block px-4 footer-company-box ">
                  <div className="">
                    <h3 className="text-uppercase  pb-md-1">Company</h3>
                    <ul type="none" className="p-0">
                      <li>
                        <a href="/blog" title="Blog" target="_blank" className="text-decoration-none">
                          Blog
                        </a>
                      </li>
                      <li>
                        <Link href={'/about-us'}>
                          <a title="About Us" className="text-decoration-none">
                            About Us
                          </a>
                        </Link>
                      </li>
                      <li>
                        <Link href={'/faq'}>
                          <a title="FAQ's" className="text-decoration-none">
                            FAQ's
                          </a>
                        </Link>
                      </li>
                      <li>
                        <Link href={'/contact-us'}>
                          <a title="Contact Us" className="text-decoration-none">
                            Contact Us
                          </a>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-md-4 pt-3 d-none d-md-block px-4">
                  <h3 className="text-uppercase pb-md-1">Quick Links</h3>
                  <ul type="none" className="p-0">
                    {/* <li>
                      <Link href={'/help-center'}>
                        <a title="Help Center" className="text-decoration-none">
                          Help Center
                        </a>
                      </Link>
                    </li> */}
                    <li>
                      <Link href={'/privacy-policy'}>
                        <a title="Privacy Policy" className="text-decoration-none">
                          Privacy Policy
                        </a>
                      </Link>
                    </li>
                    <li>
                      <Link href={'/terms-and-conditions'}>
                        <a title="Terms and Conditions" className="text-decoration-none">
                          Terms and Conditions
                        </a>
                      </Link>
                    </li>
                    <li>
                      <Link href={'/refund-policy'}>
                        <a title="Refund Policy" className="text-decoration-none">
                          Refund Policy
                        </a>
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="mt-4 col-12 d-lg-none">
                  <h3 className="text-uppercase">Download Our App</h3>
                  <a className="d-block cursor-pointer">
                    <img src="/images/google.svg" className="img-fluid" width={140} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="container-fluid copy-right-section bg-light-green ">
          <div className="row">
            <div className="col-md-6 pb-1 pb-md-0">
              <p className="m-0 p-0 fs-14 fw-400 text-md-start text-center text-black">
                &copy; 2022 Blue City Studio. All Rights Reserved.
              </p>
            </div>
            <div className="col-md-6">
              <p className="m-0 p-0 fs-14 fw-500 text-black text-md-end text-center">
                Design and develop by &nbsp;
                <a
                  className="text-blue text-decoration-none cursor-pointer"
                  href="https://www.geekologix.com/"
                  target="_blank"
                  rel="noreferrer"
                  title="Geekologix Technologies"
                >
                  Geekologix Technologies
                </a>
              </p>
            </div>
          </div>
        </section>
      </footer>
    </>
  );
}
export default Footer;
