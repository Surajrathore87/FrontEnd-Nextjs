import React from 'react';
import Skeleton from 'react-loading-skeleton';

function TemplatesLoader() {
  return (
    <>
      <div className="m-2 d-inline-block">
        <Skeleton height={178} width={250} />
      </div>
      <div className="m-2 d-inline-block">
        <Skeleton height={178} width={250} />
      </div>
      <div className="m-2 d-inline-block">
        <Skeleton height={178} width={250} />
      </div>
      <div className="m-2 d-inline-block">
        <Skeleton height={178} width={250} />
      </div>
      <div className="m-2 d-inline-block">
        <Skeleton height={178} width={250} />
      </div>
      <div className="m-2 d-inline-block">
        <Skeleton height={178} width={250} />
      </div>
    </>
  );
}

export default TemplatesLoader;
