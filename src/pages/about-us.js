import React from "react";
import dynamic from "next/dynamic";
import PropTypes from "prop-types";
import { callPostAPI } from "_services/CallAPI";
import Head from "next/head";

const AboutUs = dynamic(import("components/AboutUs"));
const MetaData = dynamic(import("components/Common/MetaData"));

export default function aboutUs(props) {
  const { aboutUsPageData, aboutMetaContent } = props;
  function createMarkup() {
    return { __html: '{ "@context": "https://schema.org", "@type": "Organization", "name": "DsignDpo", "url": "https://www.dsigndpo.com/about-us", "logo": "https://www.dsigndpo.com/images/main-logo.svg", "contactPoint": { "@type": "ContactPoint", "telephone": "+91 9799611557", "contactType": "customer service", "areaServed": "IN", "availableLanguage": ["en", "Hindi"] }, "sameAs": ["https://www.facebook.com/dsigndpo", "https://www.instagram.com/dsigndpo/", "https://www.youtube.com/@dsigndpo"] }' };
  }
  return (
    <>
      <Head>
        <script type="application/ld+json" dangerouslySetInnerHTML={createMarkup()}></script>
      </Head>
      <MetaData metaContent={{
        metaTitle: aboutMetaContent.data.meta_title,
        metaDescription: aboutMetaContent.data.meta_description,
        metaKeywords: aboutMetaContent.data.meta_keywords,
      }} />
      <AboutUs aboutUsPageData={aboutUsPageData} />
    </>
  );
}

export async function getServerSideProps() {
  const response = {
    aboutUsPageData: null,
    aboutMetaContent: null
  };

  const params = {
    slug: 'about-us',
  };

  response.aboutUsPageData = await callPostAPI(process.env.CMS_DATA, params);
  response.aboutMetaContent = await callPostAPI(process.env.CMS_META_DATA, params);

  return {
    props: response,
  };
}

aboutUs.propTypes = {
  aboutUsPageData: PropTypes.object,
  aboutMetaContent: PropTypes.object,
};