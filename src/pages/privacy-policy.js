import React from "react";
import dynamic from "next/dynamic";
import PropTypes from "prop-types";
import { callPostAPI } from "_services/CallAPI";

const PrivacyPolicy = dynamic(import("components/PrivacyPolicy"));
const MetaData = dynamic(import("components/Common/MetaData"));

export default function privacyPolicy(props) {
  const { privacyPageData, privacyMetaContent } = props;
  return (
    <>
      <MetaData metaContent={{
        metaTitle: privacyMetaContent.data.meta_title,
        metaDescription: privacyMetaContent.data.meta_description,
        metaKeywords: privacyMetaContent.data.meta_keywords,
      }} />
      <PrivacyPolicy privacyPageData={privacyPageData} />
    </>
  );
}

export async function getServerSideProps() {
  const response = {
    privacyPageData: null,
    privacyMetaContent: null,
  };

  const params = {
    slug: 'privacy-policy',
  };

  response.privacyPageData = await callPostAPI(process.env.CMS_DATA, params);
  response.privacyMetaContent = await callPostAPI(process.env.CMS_META_DATA, params);

  return {
    props: response,
  };
}

privacyPolicy.propTypes = {
  privacyPageData: PropTypes.object,
  privacyMetaContent: PropTypes.object
};