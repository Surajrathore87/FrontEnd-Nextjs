import React from 'react';
import Skeleton from 'react-loading-skeleton';

function FavouriteDesignsLoader() {
  return (
    <div className="col-lg-12">
      <div className="row">
        <div className="col-12 mb-4">
          <Skeleton height={36} width={200} />
        </div>
        {new Array(4).fill().map((_, key) => (
          <div key={key} className="col-lg-3 mb-4">
            <Skeleton height={300} className="d-lg-block d-none" />
            <Skeleton height={280} className="d-lg-none" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default FavouriteDesignsLoader;
