import React from 'react';
import Skeleton from 'react-loading-skeleton';

function ExploreDesignsLoader() {
  return (
    <div className="col-lg-12">
      <div className="row explore-loader">
        {new Array(8).fill().map((_, key) => (
          <div key={key} className="col-lg-4 explore-loading-container">
            <Skeleton height={240} className="d-lg-none" />
            <Skeleton height={300} className="d-lg-block d-none" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExploreDesignsLoader;
