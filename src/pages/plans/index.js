import React from "react";
import dynamic from "next/dynamic";
import PropTypes from "prop-types";
import { callPostAPI } from "_services/CallAPI";

const Plans = dynamic(import("components/Plans"));
const MetaData = dynamic(import("components/Common/MetaData"));

export default function plans(props) {
  const { planPageData, plansMetaData } = props;
  return (
    <>
      <MetaData metaContent={{
        metaTitle: plansMetaData.data.meta_title,
        metaDescription: plansMetaData.data.meta_description,
        metaKeywords: plansMetaData.data.meta_keywords,
      }} />
      <Plans planPageData={planPageData} />
    </>
  );
}

export async function getServerSideProps() {
  const response = {
    planPageData: null,
    plansMetaData: null,
  };
  const paramsMetaData = {
    page_type: 'PLANS',
  };

  response.planPageData = await callPostAPI(process.env.PLANS_LIST, {});
  response.plansMetaData = await callPostAPI(process.env.CMS_SEO_META_DATA, paramsMetaData);

  return {
    props: response,
  };
}

plans.propTypes = {
  planPageData: PropTypes.object,
  plansMetaData: PropTypes.object,
};