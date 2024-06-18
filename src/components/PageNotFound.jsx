import Link from 'next/link';
import React from 'react';

function PageNotFound() {
  return (
    <section className="error_section py-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <img src={`/images/page-not-found.svg`} alt="Error Image" className="img-fluid" width={450} />
              <p className="mb-4 text-black fw-600 fs-20">The page you are looking for is not available</p>
              <div className="text-center">
                <Link href="/">
                  <a title="Back to Homepage" className="btn blue-btn fs-15 fw-600">
                    Back to Homepage
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PageNotFound;
