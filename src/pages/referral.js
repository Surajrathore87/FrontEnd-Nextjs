import React from "react";
import dynamic from "next/dynamic";
import PropTypes from "prop-types";
import { callPostAPI } from "_services/CallAPI";

const Referral = dynamic(import("components/Referral"));
const MetaData = dynamic(import("components/Common/MetaData"));

export default function referral(props) {
  const { referMetaData } = props;
  return (
    <>
      <MetaData metaContent={{
        metaTitle: referMetaData.data.meta_title,
        metaDescription: referMetaData.data.meta_description,
        metaKeywords: referMetaData.data.meta_keywords,
      }} />
      <Referral />
    </>
  );
}

export async function getServerSideProps() {
  const response = {
    referMetaData: null,
  };

  const paramsMetaData = {
    page_type: 'REFERRAL',
  };

  response.referMetaData = await callPostAPI(process.env.CMS_SEO_META_DATA, paramsMetaData);

  return {
    props: response,
  };
}

referral.propTypes = {
  referMetaData: PropTypes.object,
};