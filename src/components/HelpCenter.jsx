import React, { useEffect, useState } from 'react';
import { useAuth } from '_contexts/auth';
import { callAPI } from '_services/CallAPI';
import parse from 'html-react-parser';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';

const FaqLoader = dynamic(import('components/Loaders/FaqLoader'));

function HelpCenter(props) {
  const { helpPageData } = props;
  const [helpData, setHelpData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isLoggedIn, userDetails, isContextLoaded, logout } = useAuth();

  useEffect(() => {
    if (isContextLoaded && isLoggedIn && userDetails) {
      getHelpData();
    }
  }, [isContextLoaded, isLoggedIn, userDetails]);

  useEffect(() => {
    if (logout) {
      getHelpData();
    }
  }, [logout]);

  function getHelpData() {
    const helpSlug =
      (userDetails && userDetails.role_type == 'dealer' && 'help-dealer') ||
      (userDetails && userDetails.role_type == 'carpenter' && 'help-carpenter') ||
      'help-home-owner';
    const params = {
      slug: helpSlug,
    };
    callAPI('POST', process.env.CMS_DATA, params, (res) => {
      // setIsLoading(false);
      if (res.status) {
        const data = res['data'];
        setHelpData(data);
      }
    });
  }

  const videoUrl = (helpPageData && helpPageData.data.video_url) || '';
  const newUrl = videoUrl.split('=');
  const embeddedUrl = 'https://www.youtube.com/embed/' + newUrl[1];

  const videoUrlLogin = (helpData && helpData.video_url) || '';
  const newUrlLogin = videoUrlLogin.split('=');
  const embeddedUrlLogin = 'https://www.youtube.com/embed/' + newUrlLogin[1];

  return (
    <>
      <section className="py-5 faq-section vh-60">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="text-center mb-5">
                <h1 className="label-color-2 fw-700 heading-fonts fs-30">Help Center</h1>
              </div>
              <div className="row mt-4">
                <div className="col-lg-12">
                  {isContextLoaded && !helpData && helpPageData && (
                    <>
                      <div>
                        <iframe
                          className="mb-4"
                          width="100%"
                          height="300"
                          src={embeddedUrl}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                        <div className="cms-text-content">{parse(helpPageData.data.description)}</div>
                      </div>
                    </>
                  )}

                  {helpData && (
                    <>
                      <div>
                        <iframe
                          className="mb-4"
                          width="100%"
                          height="300"
                          src={embeddedUrlLogin}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                        <div className="cms-text-content">{parse(helpData.description)}</div>
                      </div>
                    </>
                  )}
                  {(!helpPageData && !helpData && (
                    <div className="text-center py-5 fw-600 fs-18">No data available</div>
                  )) ||
                    ''}
                  {/* {isLoading && <FaqLoader />} */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

HelpCenter.propTypes = {
  helpPageData: PropTypes.object,
};

export default HelpCenter;
