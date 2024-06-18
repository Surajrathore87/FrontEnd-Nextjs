import React, { useEffect, useState } from 'react';
import { Breadcrumb } from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion';
import { useAuth } from '_contexts/auth';
import { callAPI } from '_services/CallAPI';
import FaqLoader from './Loaders/FaqLoader';
import PropTypes from 'prop-types';

function Faq(props) {
  const { faqPageData } = props;
  const [faqList, setFaqList] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isLoggedIn, userDetails, isContextLoaded, logout } = useAuth();

  useEffect(() => {
    if (isContextLoaded && isLoggedIn && userDetails) {
      getFaqData();
    }
  }, [isContextLoaded, isLoggedIn, userDetails]);

  useEffect(() => {
    if (logout) {
      getFaqData();
    }
  }, [logout]);

  function getFaqData() {
    const roleId = (userDetails && userDetails.role_id) || 0;
    const params = {
      role_id: roleId,
    };
    callAPI('POST', process.env.FAQ_DATA, params, (res) => {
      // setIsLoading(false);
      if (res.status) {
        const data = res['data'];
        setFaqList(data);
      }
    });
  }

  function renderFaqs() {
    return faqPageData.data.map((item, key) => (
      <Accordion.Item className="border-0 mb-4 overflow-hidden" key={key} eventKey={item.id}>
        <Accordion.Header>{item.question}</Accordion.Header>
        <Accordion.Body className="fs-15 fw-500 label-color-3">{item.answer}</Accordion.Body>
      </Accordion.Item>
    ));
  }

  function renderFaqsLogin() {
    return faqList.map((item, key) => (
      <Accordion.Item className="border-0 mb-4 overflow-hidden" key={key} eventKey={item.id}>
        <Accordion.Header>{item.question}</Accordion.Header>
        <Accordion.Body className="fs-15 fw-500 label-color-3">{item.answer}</Accordion.Body>
      </Accordion.Item>
    ));
  }

  return (
    <>
      <section className="py-5 faq-section vh-60">
        <div className="container pt-lg-5 pt-4">
          <div className="row">
            <div className="col-12">
              <div className="text-center mb-5">
                <h1 className="label-color-2 fw-700 fs-30 heading-fonts">Frequently Asked Questions</h1>
              </div>
              <div className="row mt-4">
                <div className="col-lg-12">
                  <Accordion className="faq-accordion">
                    {faqPageData && !faqList && renderFaqs()}
                    {faqList && renderFaqsLogin()}
                  </Accordion>
                  {!faqPageData && !faqList && (
                    <p className="fs-18 mt-5 text-center fw-600 text-black">No FAQ's Available</p>
                  )}
                </div>
                {/* {isLoading && <FaqLoader />} */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

Faq.propTypes = {
  faqPageData: PropTypes.object,
};

export default Faq;
