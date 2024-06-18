import React from 'react';

function PageLoader() {
  return (
    <>
      <div className="d-flex align-items-center justify-content-center vh-100 w-100 bg-white position-fixed top-0 page-loader">
        <img src="/images/page-loader.gif" className="img-fluid m-auto" width={300} />
      </div>
    </>
  );
}

export default PageLoader;
