import React from "react";
import dynamic from "next/dynamic";
import PropTypes from "prop-types";
import { callPostAPI } from "_services/CallAPI";

const RefundPolicy = dynamic(import("components/RefundPolicy"));
const MetaData = dynamic(import("components/Common/MetaData"));

export default function refundPolicy(props) {
  const { refundPageData, refundMetaContent } = props;
  return (
    <>
      <MetaData metaContent={{
        metaTitle: refundMetaContent.data.meta_title,
        metaDescription: refundMetaContent.data.meta_description,
        metaKeywords: refundMetaContent.data.meta_keywords,
      }} />
      <RefundPolicy refundPageData={refundPageData} />
    </>
  );
}

export async function getServerSideProps() {
  const response = {
    refundPageData: null,
    refundMetaContent: null,
  };

  const params = {
    slug: 'refund-policy',
  };

  response.refundPageData = await callPostAPI(process.env.CMS_DATA, params);
  response.refundMetaContent = await callPostAPI(process.env.CMS_META_DATA, params);

  return {
    props: response,
  };
}

refundPolicy.propTypes = {
  refundPageData: PropTypes.object,
  refundMetaContent: PropTypes.object
};