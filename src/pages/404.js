import dynamic from 'next/dynamic';
import React from 'react';

const PageNotFound = dynamic(import('components/PageNotFound'));
const MetaData = dynamic(import("components/Common/MetaData"));

function Error() {
  return (<>
    <MetaData metaContent={{
      metaTitle: 'Page not found',
      metaDescription: '',
      metaKeywords: ''
    }} />
    <PageNotFound />
  </>
  );
}

export default Error;
