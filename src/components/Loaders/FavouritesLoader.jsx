import React from 'react';
import Skeleton from 'react-loading-skeleton';

function FavouritesLoader() {
  return (
    <div className="col-lg-12">
      <div className="row">
        {new Array(4).fill().map((_, key) => (
          <div key={key} className="col-lg-3 mb-4">
            <Skeleton height={268} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default FavouritesLoader;
