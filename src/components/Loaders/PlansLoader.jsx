import React from 'react';
import Skeleton from 'react-loading-skeleton';

function PlansLoader() {
  return (
    <>
      <div className="d-none d-lg-block">
        <div className="row mb-4">
          <div className="col-lg-4">
            <Skeleton height={145} />
          </div>
          <div className="col-lg-4">
            <Skeleton height={145} />
          </div>
          <div className="col-lg-4">
            <Skeleton height={145} />
          </div>
        </div>
      </div>
      <div className="d-lg-none">
        <Skeleton height={100} className="mb-2" />
        <Skeleton height={100} className="mb-2" />
        <Skeleton height={100} className="mb-2" />
      </div>
    </>
  );
}

export default PlansLoader;
