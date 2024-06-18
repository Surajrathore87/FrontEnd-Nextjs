import React from "react";
import dynamic from "next/dynamic";
import PropTypes from "prop-types";
import { callPostAPI } from "_services/CallAPI";

const ContactUs = dynamic(import("components/ContactUs"));
const MetaData = dynamic(import("components/Common/MetaData"));

export default function contactUs(props) {
  const { contactPageData, contactMetaContent } = props;
  return (
    <>
      <MetaData metaContent={{
        metaTitle: contactMetaContent.data.meta_title,
        metaDescription: contactMetaContent.data.meta_description,
        metaKeywords: contactMetaContent.data.meta_keywords,
      }} />
      <ContactUs contactPageData={contactPageData} />
    </>
  );
}

export async function getServerSideProps() {
  const response = {
    contactPageData: null,
    contactMetaContent: null,
  };

  const params = {
    slug: 'contact-us',
  };

  response.contactPageData = await callPostAPI(process.env.COMPANY_DETAIL_DATA, {});
  response.contactMetaContent = await callPostAPI(process.env.CMS_META_DATA, params);

  return {
    props: response,
  };
}

contactUs.propTypes = {
  contactPageData: PropTypes.object,
  contactMetaContent: PropTypes.object,
};