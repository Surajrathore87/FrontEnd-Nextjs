import dynamic from "next/dynamic";
import React from "react";
import PropTypes from "prop-types";
import { callPostAPI } from "_services/CallAPI";

const MyOrders = dynamic(import("components/MyOrders"));
const MetaData = dynamic(import("components/Common/MetaData"));
export default function myOrders(props) {
  const { ordersMetaData } = props;
  return (
    <>
      <MetaData metaContent={{
        metaTitle: ordersMetaData.data.meta_title,
        metaDescription: ordersMetaData.data.meta_description,
        metaKeywords: ordersMetaData.data.meta_keywords,
      }} />
      <MyOrders />
    </>
  );
}

export async function getServerSideProps() {
  const response = {
    planPageData: null,
    ordersMetaData: null,
  };
  const paramsMetaData = {
    page_type: 'ORDER',
  };

  response.planPageData = await callPostAPI(process.env.PLANS_LIST, {});
  response.ordersMetaData = await callPostAPI(process.env.CMS_SEO_META_DATA, paramsMetaData);

  return {
    props: response,
  };
}

myOrders.propTypes = {
  planPageData: PropTypes.object,
  ordersMetaData: PropTypes.object,
};