import React, { useState } from 'react';
import parse from 'html-react-parser';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';

const FaqLoader = dynamic(import('components/Loaders/FaqLoader'));

function PrivacyPolicy(props) {
  const { privacyPageData } = props;
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <section>
        <div className="container">
          <div className="row py-5">
            <div className="col-lg-12">
              <h1 className="inner-heading pb-3">Privacy Policy</h1>
              <div className="cms-text-content">{privacyPageData && parse(privacyPageData.data.description)}</div>
              {!privacyPageData && <div className="text-center py-5 fw-600 fs-18">No data available</div>}
              {/* {isLoading && <FaqLoader />} */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

PrivacyPolicy.propTypes = {
  privacyPageData: PropTypes.object,
};
export default PrivacyPolicy;
