import React from 'react';
import Skeleton from 'react-loading-skeleton';

function MyCartLoader() {
  return (
    <div className="row">
      <div className="col-lg-8 pe-lg-5">
        <Skeleton height={30} width={175} className="mb-4" />
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div className="d-flex">
            <Skeleton height={106} width={155} className="me-3 d-none d-lg-block" />
            <Skeleton height={85} width={135} className="me-3 d-lg-none" />
            <div className="d-none d-lg-block mt-3">
              <Skeleton height={25} width={100} className="mb-lg-3" />
              <Skeleton height={20} width={60} />
            </div>
            <div className="d-lg-none mt-3">
              <Skeleton height={20} width={80} className="mb-2" />
              <Skeleton height={20} width={50} />
            </div>
          </div>
          <div className="d-flex align-items-center">
            <Skeleton height={28} width={70} className="me-4 d-none d-lg-block" />
            <Skeleton height={24} width={55} className="me-3 d-lg-none" />
            <Skeleton height={31} width={31} className="d-none d-lg-block" />
            <Skeleton height={25} width={25} className="d-lg-none" />
          </div>
        </div>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div className="d-flex">
            <Skeleton height={106} width={155} className="me-3 d-none d-lg-block" />
            <Skeleton height={85} width={135} className="me-3 d-lg-none" />
            <div className="d-none d-lg-block mt-3">
              <Skeleton height={25} width={100} className="mb-lg-3" />
              <Skeleton height={20} width={60} />
            </div>
            <div className="d-lg-none mt-3">
              <Skeleton height={20} width={80} className="mb-2" />
              <Skeleton height={20} width={50} />
            </div>
          </div>
          <div className="d-flex align-items-center">
            <Skeleton height={28} width={70} className="me-4 d-none d-lg-block" />
            <Skeleton height={24} width={55} className="me-3 d-lg-none" />
            <Skeleton height={31} width={31} className="d-none d-lg-block" />
            <Skeleton height={25} width={25} className="d-lg-none" />
          </div>
        </div>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div className="d-flex">
            <Skeleton height={106} width={155} className="me-3 d-none d-lg-block" />
            <Skeleton height={85} width={135} className="me-3 d-lg-none" />
            <div className="d-none d-lg-block mt-3">
              <Skeleton height={25} width={100} className="mb-lg-3" />
              <Skeleton height={20} width={60} />
            </div>
            <div className="d-lg-none mt-3">
              <Skeleton height={20} width={80} className="mb-2" />
              <Skeleton height={20} width={50} />
            </div>
          </div>
          <div className="d-flex align-items-center">
            <Skeleton height={28} width={70} className="me-4 d-none d-lg-block" />
            <Skeleton height={24} width={55} className="me-3 d-lg-none" />
            <Skeleton height={31} width={31} className="d-none d-lg-block" />
            <Skeleton height={25} width={25} className="d-lg-none" />
          </div>
        </div>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div className="d-flex">
            <Skeleton height={106} width={155} className="me-3 d-none d-lg-block" />
            <Skeleton height={85} width={135} className="me-3 d-lg-none" />
            <div className="d-none d-lg-block mt-3">
              <Skeleton height={25} width={100} className="mb-lg-3" />
              <Skeleton height={20} width={60} />
            </div>
            <div className="d-lg-none mt-3">
              <Skeleton height={20} width={80} className="mb-2" />
              <Skeleton height={20} width={50} />
            </div>
          </div>
          <div className="d-flex align-items-center">
            <Skeleton height={28} width={70} className="me-4 d-none d-lg-block" />
            <Skeleton height={24} width={55} className="me-3 d-lg-none" />
            <Skeleton height={31} width={31} className="d-none d-lg-block" />
            <Skeleton height={25} width={25} className="d-lg-none" />
          </div>
        </div>
      </div>
      <div className="col-lg-4">
        <Skeleton height={30} width={175} className="mb-lg-4" />
        <Skeleton height={400} className="mb-4 d-none d-lg-block" />
        <Skeleton height={200} className="mb-4 d-lg-none" />
      </div>
    </div>
  );
}

export default MyCartLoader;
