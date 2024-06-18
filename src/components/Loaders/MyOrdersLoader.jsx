import React from 'react';
import Skeleton from 'react-loading-skeleton';

function MyOrdersLoader() {
  return (
    <>
      <div className="d-none d-lg-block">
        <div className="row mb-4">
          <div className="col-lg-3">
            <Skeleton height={40} />
          </div>
          <div className="col-lg-3">
            <Skeleton height={40} />
          </div>
          <div className="col-lg-3">
            <Skeleton height={40} />
          </div>
          <div className="col-lg-3">
            <Skeleton height={40} />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-lg-3">
            <Skeleton height={70} />
          </div>
          <div className="col-lg-3">
            <Skeleton height={70} />
          </div>
          <div className="col-lg-3">
            <Skeleton height={70} />
          </div>
          <div className="col-lg-3">
            <Skeleton height={70} />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-lg-3">
            <Skeleton height={70} />
          </div>
          <div className="col-lg-3">
            <Skeleton height={70} />
          </div>
          <div className="col-lg-3">
            <Skeleton height={70} />
          </div>
          <div className="col-lg-3">
            <Skeleton height={70} />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-lg-3">
            <Skeleton height={70} />
          </div>
          <div className="col-lg-3">
            <Skeleton height={70} />
          </div>
          <div className="col-lg-3">
            <Skeleton height={70} />
          </div>
          <div className="col-lg-3">
            <Skeleton height={70} />
          </div>
        </div>
      </div>
      <div className="d-lg-none">
        <Skeleton width={300} height={25} className="mb-3" />
        <Skeleton height={35} className="mb-2" />
        <Skeleton height={35} className="mb-2" />
        <Skeleton height={35} className="mb-2" />
      </div>
    </>
  );
}

export default MyOrdersLoader;
