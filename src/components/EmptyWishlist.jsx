import Link from 'next/link';
import React from 'react';

function EmptyWishlist() {
  return (
    <>
      <div className="pb-4 d-flex align-items-center w-100 justify-content-center">
        <div className="text-center">
          <img src="/images/page-not-found.svg" alt="Empty Cart" className="img-fluid" width={450} />
          <h4 className="text-black fw-600">Your Favourites is Empty</h4>
          <Link href={'/home-interior-design'}>
            <a className="fs-16 fw-400 blue-btn mt-4 w-75 mx-auto btn" title="Continue Searching">
              Continue Searching
            </a>
          </Link>
        </div>
      </div>
    </>
  );
}

export default EmptyWishlist;
