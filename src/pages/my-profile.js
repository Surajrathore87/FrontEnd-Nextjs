import React from "react";
import dynamic from "next/dynamic";
import PropTypes from "prop-types";
import { callPostAPI } from "_services/CallAPI";

const MyProfile = dynamic(import("components/MyProfile"));
const MetaData = dynamic(import("components/Common/MetaData"));
export default function myProfile(props) {
  const { profileMetaData } = props;
  return (
    <>
      <MetaData metaContent={{
        metaTitle: profileMetaData.data.meta_title,
        metaDescription: profileMetaData.data.meta_description,
        metaKeywords: profileMetaData.data.meta_keywords,
      }} />
      <MyProfile />
    </>
  );
}

export async function getServerSideProps() {
  const response = {
    profileMetaData: null,
  };

  const paramsMetaData = {
    page_type: 'PROFILE',
  };

  response.profileMetaData = await callPostAPI(process.env.CMS_SEO_META_DATA, paramsMetaData);

  return {
    props: response,
  };
}

myProfile.propTypes = {
  profileMetaData: PropTypes.object,
};