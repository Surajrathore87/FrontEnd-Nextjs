import React from 'react';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { callAPI } from '_services/CallAPI';
import { useEffect } from 'react';
import moment from 'moment';
import dynamic from 'next/dynamic';

const WithdrawalReqModal = dynamic(import('components/Modal/WithdrawalReqModal'));
function Withdrawal(props) {
  const { userDetails, getUserDetails } = props;
  const [redeemAllPoints, setRedeemAllPoints] = useState(null);
  const [upiId, setUpiId] = useState('');
  const [disableRedeem, setDisableRedeem] = useState(false);
  const [withdrawalStatus, setWithdrawalStatus] = useState(null);
  const [error, setError] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errorMessage, setErrorMessage] = useState({
    upi: '',
    points: '',
  });
  const toastConfig = {
    position: 'bottom-left',
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  useEffect(() => {
    withdrawalRequestStatus();
  }, []);

  function formValidation() {
    let upiMsg = '';
    let pointsMsg = '';
    let isValid = false;

    if (!upiId) {
      upiMsg = 'Please enter upi id';
    }
    if (!redeemAllPoints) {
      pointsMsg = 'Please enter redeem points';
    }
    if (redeemAllPoints && redeemAllPoints > userDetails.carpenter_points) {
      pointsMsg = 'Redeem points cannot be greater than available points';
    }

    if (!upiMsg && !pointsMsg) {
      isValid = true;
    }
    if (isValid) {
      setError(true);
      setErrorMessage({
        upi: '',
        points: '',
      });
      return true;
    } else {
      setError(true);
      setErrorMessage({
        upi: upiMsg,
        points: pointsMsg,
      });
      return false;
    }
  }

  function enterUpi(value) {
    setUpiId(value);
  }

  function redeemAll(e) {
    if (e.target.checked) {
      setRedeemAllPoints(userDetails.carpenter_points);
      setDisableRedeem(true);
    } else {
      setDisableRedeem(false);
      setRedeemAllPoints('');
    }
  }

  function redeemPoints(e) {
    if (e.target.value) {
      setRedeemAllPoints(Number(e.target.value));
    } else {
      setRedeemAllPoints('');
    }
  }

  async function requestWithdrawal() {
    if (formValidation()) {
      const params = {
        mobile_or_upi_id: upiId,
        points: redeemAllPoints,
      };
      callAPI('POST', process.env.WITHDRAWAL_REQUEST, params, (res) => {
        if (res.status) {
          const data = res['data'];
          toast.success(res['message'], toastConfig);
          getUserDetails();
          setRedeemAllPoints(null);
          setUpiId('');
          withdrawalRequestStatus();
        } else {
          toast.error(res['message'], toastConfig);
        }
      });
    }
  }

  function withdrawalRequestStatus() {
    callAPI('POST', process.env.WITHDRAWAL_STATUS_DATA, {}, (res) => {
      if (res.status) {
        const data = res['data'];
        setWithdrawalStatus(data.withdrawal_requests);
      }
    });
  }

  function requestRedeem() {
    if (formValidation()) {
      setShowConfirmation(true);
    }
  }

  function renderRequestData() {
    return withdrawalStatus.map((item, key) => {
      return (
        <tr key={key}>
          <td className="fs-16 fw-600 text-black border-0 border-bottom text-nowrap px-3 py-4">{key + 1}</td>
          <td className="fs-16 fw-600 text-black border-0 border-bottom text-nowrap px-3 py-4">
            {item.mobile_or_upi_id}
          </td>
          <td className="fs-16 fw-600 text-black border-0 border-bottom text-nowrap px-3 py-4">
            {moment(item.created_at).format('lll')}
          </td>
          <td className="fs-16 fw-600 text-black border-0 border-bottom text-nowrap px-3 py-4">
            <img src="/images/dd-icon.png" width={27} className="img-fluid mb-1" /> {item.points}
          </td>
          <td className="fs-16 fw-600 text-black border-0 border-bottom text-nowrap px-3 py-4 text-end">
            &#8377;{item.points_amount}
          </td>
          <td className="fs-16 fw-600 border-0 border-bottom text-nowrap px-3 py-4 text-end">
            <span className="text-black">{(item.status == 0 && 'Pending') || ''}</span>
            <span className="text-success">{(item.status == 1 && 'Accepted') || ''}</span>
            <span className="text-red">{(item.status == 2 && 'Rejected') || ''}</span>
          </td>
        </tr>
      );
    });
  }

  return (
    <>
      {showConfirmation && (
        <WithdrawalReqModal
          requestWithdrawal={requestWithdrawal}
          setShowConfirmation={setShowConfirmation}
          redeemAllPoints={redeemAllPoints}
        />
      )}
      <div className="withdrawal-section bg-white py-5">
        <div className="container">
          <div className="row">
            <div className="col-12 mb-4">
              <h1 className="inner-heading text-center">Withdrawal Request</h1>
            </div>
            <div className="col-lg-12">
              <div className="withdrawal-box bg-white p-lg-4 p-3 rounded-6 mx-auto w-100">
                <span className="fs-16 label-color-2 fw-600 d-block text-lg-end text-center">
                  Available Points: <img src="/images/dd-icon.png" width={27} className="img-fluid mb-1 ms-2" />{' '}
                  {userDetails.carpenter_points}
                </span>
                <p className="label-color-2 fs-16 fw-500 mt-3">
                  <label className="mw-100">Mobile No:</label>
                  <span className="label-color-1 ps-3">{userDetails.mobile_number}</span>
                </p>
                <div className="mb-3">
                  <div className="label-color-2 fs-16 fw-500 d-flex align-items-center">
                    <label htmlFor="upi" className="text-nowrap mw-100">
                      Enter upi:
                    </label>
                    <input
                      type="text"
                      id="upi"
                      value={upiId}
                      onChange={(e) => enterUpi(e.target.value)}
                      placeholder="Enter upi id or mobile"
                      className="form-control m-0 ms-3 fs-14 label-color-1 shadow-none"
                    />
                  </div>
                  {error && errorMessage.upi && (
                    <div className="d-flex mt-2">
                      <div className="mw-100 me-3"></div>
                      <small className="text-danger">{errorMessage.upi}</small>
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <div className="label-color-2 fs-16 fw-500 d-flex align-items-center">
                    <label htmlFor="points" className="text-nowrap mw-100">
                      Enter points:
                    </label>
                    <input
                      type="number"
                      name="points"
                      id="points"
                      disabled={disableRedeem}
                      onChange={redeemPoints}
                      value={(redeemAllPoints && redeemAllPoints) || ''}
                      placeholder="Enter redeem points"
                      className="form-control m-0 ms-3 fs-14 label-color-1 shadow-none"
                    />
                  </div>
                  {error && errorMessage.points && (
                    <div className="d-flex mt-2">
                      <div className="mw-100 me-3"></div>
                      <small className="text-danger">{errorMessage.points}</small>
                    </div>
                  )}
                </div>
                <div className="login-modal my-3 d-flex align-items-center">
                  <div className="mw-100"></div>
                  <div className="d-flex align-items-center form-group-check ms-3">
                    <input type="checkbox" id="redeem-all" onChange={redeemAll} />
                    <label
                      htmlFor="redeem-all"
                      className="fw-500 fs-16 label-color-1 cursor-pointer position-relative d-flex"
                    >
                      <div>Redeem all</div>
                    </label>
                  </div>
                </div>
                <div className="text-center my-3">
                  <button className="red-btn py-2 px-4 fw-500 mt-2" onClick={requestRedeem}>
                    Request
                  </button>
                </div>
                <div className="d-flex fs-14 label-color-1 fs-14 mb-1">
                  <span className="fw-500">Note:</span>
                  <span className="ps-1">
                    {userDetails.accountable_points} Point = {userDetails.accountable_points_amount} rupee
                  </span>
                </div>
                <span className="label-color-1 fs-14">The redemption will take around 5 to 7 working days.</span>
              </div>
            </div>
            {withdrawalStatus?.length > 0 && (
              <div className="col-lg-12">
                <div className="my-orders-section">
                  <div className="col-12 mb-5 pt-lg-5 pt-4">
                    <div className="d-flex mb-4">
                      <h2 className="label-color-2 fs-20">Request Status</h2>
                    </div>
                    <div className="table-responsive">
                      <table className="orders-table orders-table-rounded w-100">
                        <thead>
                          <tr>
                            <th className="fw-500 fs-16 text-black px-3 text-nowrap py-2">S.No.</th>
                            <th className='fw-500 fs-16 text-black px-3 text-nowrap py-2"'>Mobile or UPI Id</th>
                            <th className="fw-500 fs-16 text-black px-3 text-nowrap py-2">Date & Time</th>
                            <th className="fw-500 fs-16 text-black px-3 text-nowrap py-2">Points</th>
                            <th className="fw-500 fs-16 text-black px-3 text-nowrap py-2 text-end">Points Amount</th>
                            <th className="fw-500 fs-16 text-black px-3 text-nowrap py-2 text-end">Status</th>
                          </tr>
                        </thead>
                        <tbody>{renderRequestData()}</tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

Withdrawal.propTypes = {
  userDetails: PropTypes.object,
};

export default Withdrawal;
