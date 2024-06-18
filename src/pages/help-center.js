import React from "react";
import dynamic from "next/dynamic";
import PropTypes from "prop-types";
import { callPostAPI } from "_services/CallAPI";

const HelpCenter = dynamic(import("components/HelpCenter"));
const MetaData = dynamic(import("components/Common/MetaData"));

export default function helpCenter(props) {
  const { helpPageData, helpMetaContent } = props;
  return (
    <>
      <MetaData metaContent={{
        metaTitle: helpMetaContent.data.meta_title,
        metaDescription: helpMetaContent.data.meta_description,
        metaKeywords: helpMetaContent.data.meta_keywords,
      }} />
      <HelpCenter helpPageData={helpPageData} />
    </>
  );
}

export async function getServerSideProps() {
  const response = {
    helpPageData: null,
    helpMetaContent: null
  };

  const params = {
    slug: 'help-home-owner',
  };

  response.helpPageData = await callPostAPI(process.env.CMS_DATA, params);
  response.helpMetaContent = await callPostAPI(process.env.CMS_META_DATA, params);

  return {
    props: response,
  };
}

helpCenter.propTypes = {
  helpPageData: PropTypes.object,
  helpMetaContent: PropTypes.object,
};