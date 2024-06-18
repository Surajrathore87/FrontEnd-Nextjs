import React from 'react';
import Skeleton from 'react-loading-skeleton';

function GroupedDesignLoader() {
  return (
    <div className="row">
      <div className="col-lg-12 mb-lg-3 d-lg-flex align-items-center justify-content-between">
        <div>
          <Skeleton height={36} width={320} className="mb-lg-3 mb-2" />
          <Skeleton height={30} width={310} />
        </div>
        <Skeleton height={56} width={250} className="d-none d-lg-block" />
      </div>
      <div className="col-lg-6">
        <Skeleton height={430} className="d-lg-block d-none" />
        <Skeleton height={225} className="d-lg-none mb-3" />
      </div>
      <div className="col-lg-6 mb-lg-5 mb-4">
        <div className="row">
          <div className="col-lg-6">
            <Skeleton height={200} className="mb-3 mb-lg-4" />
          </div>
          <div className="col-lg-6">
            <Skeleton height={200} className="mb-3 mb-lg-4" />
          </div>
          <div className="col-lg-6">
            <Skeleton height={200} className="mb-3 mb-lg-4" />
          </div>
          <div className="col-lg-6">
            <Skeleton height={200} className="mb-3 mb-lg-4" />
          </div>
        </div>
      </div>
      <div className="col-12">
        <Skeleton height={40} width={300} className="mb-3" />
        <Skeleton height={48} className="mb-3" />
        <div className="row">
          <div className="col-lg-4 mb-3">
            <Skeleton height={200} />
          </div>
          <div className="col-lg-4 mb-3">
            <Skeleton height={200} />
          </div>
          <div className="col-lg-4 mb-3">
            <Skeleton height={200} />
          </div>
          <div className="col-lg-4 mb-3">
            <Skeleton height={200} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupedDesignLoader;
