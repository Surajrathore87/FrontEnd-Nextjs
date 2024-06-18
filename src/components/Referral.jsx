import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const ReferralModal = dynamic(import('components/Modal/ReferralModal'));

function Referral() {
  const [showReferModal, setShowReferModal] = useState();
  return (
    <>
      {showReferModal && <ReferralModal setShowReferModal={setShowReferModal} />}
      <section>
        <div className="container">
          <div className="row py-5">
            <div className="col-lg-12">
              <h1 className="inner-heading pb-3 text-center">Refer a Friend</h1>
              <div className="row pt-lg-5 py-4">
                <div className="col-lg-6 text-center mb-3 mb-lg-0">
                  <img src="/images/refer-users.svg" alt="Referral" className="img-fluid" />
                </div>
                <div className="col-lg-6 d-flex align-items-center text-center text-lg-start">
                  <div className="pe-lg-5">
                    <h2 className="fs-22 fw-500 label-color-2 mb-3">Refer and Earn!</h2>
                    <p className="label-color-1 lh-30">
                      You can refer your friend via referral code and get connected on DsignDpo. If you a carpenter, you
                      will receive referral points when your friend purchases a plan. Share the invite link now and
                      start earning!!!
                    </p>
                    <button className="btn blue-btn fw-500 fs-16 py-2 px-4" onClick={() => setShowReferModal(true)}>
                      Share Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

Referral.propTypes = {};
export default Referral;
