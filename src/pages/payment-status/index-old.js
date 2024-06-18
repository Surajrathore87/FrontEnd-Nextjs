import React, { useEffect } from 'react';
import PropTypes from "prop-types";
import { callPostAPI } from "_services/CallAPI";
import dynamic from 'next/dynamic';

const MetaData = dynamic(import("components/Common/MetaData"));
function paymentStatus(props) {
  const { planStatus } = props;
  useEffect(() => {
    if (planStatus) {
      window.close();
    }
  }, [planStatus]);

  return (
    <>
      <MetaData metaContent={{
        metaTitle: planStatus.data.meta_title,
        metaDescription: planStatus.data.meta_description,
        metaKeywords: planStatus.data.meta_keywords,
      }} />
    </>
  );
}

export async function getServerSideProps() {
  const response = {
    planStatus: null,
  };

  response.planStatus = await callPostAPI(process.env.PAYMENT_STATUS_META_DATA, {});

  return {
    props: response,
  };
}

paymentStatus.propTypes = {
  planStatus: PropTypes.object,
};

export default paymentStatus;
