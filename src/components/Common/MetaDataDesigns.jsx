import Head from 'next/head';
import PropTypes from 'prop-types';
import React from 'react';

function MetaDataDesigns(props) {
  const { metaContent, designGrouped, designCode } = props;
  const siteUrl = process.env.WEBSITE_URL;
  return (
    <Head>
      <title>{metaContent.metaTitle}</title>
      <link
        rel="canonical"
        href={siteUrl + ((designGrouped == 0 && 'individual-design/' + designCode) || 'grouped-design/' + designCode)}
      />
      <meta property="og:title" content={metaContent.metaTitle} key="title" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta name="keyword" content={metaContent.metaKeywords} />
      <meta name="description" content={metaContent.metaDescription} />
      <meta name="og:description" content={metaContent.metaDescription} />
    </Head>
  );
}

export default MetaDataDesigns;

MetaDataDesigns.propTypes = {
  metaContent: PropTypes.object,
  designGrouped: PropTypes.number,
};
