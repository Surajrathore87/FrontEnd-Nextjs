import Head from 'next/head';
import PropTypes from 'prop-types';
import React from 'react';
import { useRouter } from 'next/router';

function MetaData(props) {
  const { metaContent } = props;
  const router = useRouter();
  const siteUrl = 'https://www.dsigndpo.com';
  return (
    <Head>
      <title>{metaContent.metaTitle}</title>
      <link rel="canonical" href={siteUrl + router.asPath} />
      <meta property="og:title" content={metaContent.metaTitle} key="title" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta name="keyword" content={metaContent.metaKeywords} />
      <meta name="description" content={metaContent.metaDescription} />
      <meta name="og:description" content={metaContent.metaDescription} />
    </Head>
  );
}

export default MetaData;

MetaData.propTypes = {
  metaContent: PropTypes.object,
};
