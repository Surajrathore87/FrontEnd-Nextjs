import React from 'react';
import Skeleton from 'react-loading-skeleton';

function IndvDesignLoader() {
  return (
    <div className="row">
      <div className="col-lg-6">
        <Skeleton height={465} className="d-none d-lg-block" />
        <Skeleton height={222} className="d-lg-none mb-3" />
      </div>
      <div className="col-lg-6">
        <Skeleton height={40} width={250} className="mb-2" />
        <Skeleton height={24} width={100} className="mb-4" />
        <Skeleton height={24} width={270} className="mb-2" />
        <Skeleton height={48} className="mb-3" />
        <Skeleton height={24} width={100} className="mb-2" />
        <Skeleton height={125} className="mb-2" />
        <Skeleton height={80} className="mb-5" />
        <Skeleton height={56} width={250} className="mb-4" />
      </div>
      <div className="col-lg-12">
        <Skeleton height={24} width={250} className="mb-3" />
        <Skeleton height={154} />
      </div>
    </div>
  );
}

export default IndvDesignLoader;
