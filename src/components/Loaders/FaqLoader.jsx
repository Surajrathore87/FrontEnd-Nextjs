import React from 'react';
import Skeleton from 'react-loading-skeleton';

function FaqLoader() {
  return (
    <div className="col-lg-12">
      <div className="row">
        {new Array(3).fill().map((_, key) => (
          <div key={key} className="col-lg-12 mb-3">
            <Skeleton height={52} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default FaqLoader;
