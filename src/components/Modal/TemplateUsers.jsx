import React, { useEffect } from 'react';
import { useState } from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAuth } from '_contexts/auth';
import { callAPI } from '_services/CallAPI';
import { useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroller';

function TemplateUsers(props) {
  const { setShowTemplateUsers, selectedId, sendMessage, isMsgSending, isForward, mainImage, senderID } = props;
  const { userDetails, usersList } = useAuth();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [forwarding, setForwarding] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [usersData, setUsersData] = useState([]);
  const [totalPageCount, setTotalPageCount] = useState(null);
  const [pages, setPages] = useState(1);
  const toastConfig = {
    position: 'bottom-left',
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  const timelineRef = useRef();

  useEffect(() => {
    if (userDetails) {
      chatUsers();
    }
  }, [userDetails]);

  function loadMore() {
    if (pages <= totalPageCount) {
      chatUsers();
    }
  }

  function chatUsers() {
    const params = {
      sender_id: userDetails.id,
      role_type: '',
      page: pages,
    };
    callAPI('POST', process.env.CHAT_CONNECTIONS, params, (res) => {
      if (res.status) {
        const connectionData = res['data'].connection_users;
        setTotalPageCount(res['data'].paginate.last_page);
        setUsersData((prev) => [...prev, ...connectionData]);

        setPages((prev) => prev + 1);
      }
    });
  }

  function selectUsers(e) {
    const userId = Number(e.target.value);
    if (e.target.checked) {
      setSelectedUsers((prev) => {
        return [...prev, userId];
      });
    } else {
      const newList = [...selectedUsers].filter((id) => id != userId);
      setSelectedUsers(newList);
    }
  }

  function selectAllUsers(e) {
    if (e.target.checked) {
      // const users =
      //   usersData.map((item) => userDetails && userDetails.id == item.sender_user_id && item.receiver_user_id) ||
      //   item.sender_user_id;
      const users =usersData.map((item)=> item.receiver_id);
      setSelectedUsers(users);
    } else {
      setSelectedUsers([]);
    }
  }

  function sendTemplate() {
    if (selectedUsers.length > 0) {
      sendMessage(selectedUsers, mainImage);
    } else {
      setErrorMessage('Please select users');
    }
  }

  function renderUsers() {
    return usersData.map((item, key) => {
      return (
        <li key={key}>
          <a className={`border-bottom p-3 d-flex cursor-pointer decoration-none`}>
            <div className="d-flex align-items-center w-100">
              <div
                className={`list-user rounded-circle position-relative ${
                  (item.receiver_last_message && item.sender_last_message && 'user-active') || ''
                }`}
                style={{
                  backgroundImage: `url(${
                    (item.profile_image && userDetails.image_path + item.profile_image) || '/images/avatar.svg'
                  })`,
                }}
              ></div>
              <div className="ms-lg-3 ms-2">
                <p className={`fs-15 fw-600 mb-1 label-color-2`}>{(item.name && item.name) || item.mobile_number}</p>
              </div>
              <div className="ms-auto form-group-check position-relative">
                <input
                  type="checkbox"
                  id={key}
                  value={
                    // (userDetails && userDetails.id == item.sender_user_id && item.receiver_user_id) ||
                    // item.sender_user_id
                    item.receiver_id
                  }
                  onChange={selectUsers}
                  checked={
                    // (userDetails &&
                    //   userDetails.id == item.sender_user_id &&
                    //   selectedUsers.includes(item.receiver_user_id)) ||
                    // selectedUsers.includes(item.sender_user_id)
                    selectedUsers.includes(item.receiver_user_id) || selectedUsers.includes(item.receiver_id)
                  }
                />
                <label htmlFor={key} className="user-list-label"></label>
              </div>
            </div>
          </a>
        </li>
      );
    });
  }

  function msgForward() {
    if (selectedUsers.length > 0) {
      const params = {
        message_id: selectedId,
        receiver_id: selectedUsers,
      };
      setForwarding(true);
      callAPI('POST', process.env.FORWARD_MSG, params, (res) => {
        if (res.status) {
          setShowTemplateUsers(false);
          toast.success(res['message'], toastConfig);
        }
      });
    } else {
      setErrorMessage('Please select users');
    }
  }

  return (
    <>
      <Modal show={true} centered contentClassName="border-0">
        <Modal.Body className="border-0">
          <button
            onClick={() => setShowTemplateUsers(false)}
            className="border-0 outline-none bg-transparent cross-btn p-0 position-absolute top-0 end-0 mt-3 me-3"
          >
            <img src="/images/filter-close-icon.png" alt="Close" width={35} />
          </button>
          <h5 className="m-0 label-color-2 fw-500">Select Users</h5>
          {usersData?.length > 0 && (
            <div className="chat-section py-2">
              <div className="ms-auto w-max-content form-group-check position-relative mt-3">
                <input
                  type="checkbox"
                  id={'select-all'}
                  onChange={selectAllUsers}
                  checked={selectedUsers?.length == usersData?.length}
                />
                <label htmlFor={'select-all'} className="user-list-label label-color-1 lh-26 cursor-pointer">
                  Select All
                </label>
              </div>
              <ul className="chat-list h-100 d-flex flex-column list-unstyled pt-3 m-0 " id="scrollableDiv">
                <InfiniteScroll
                  pageStart={1}
                  loadMore={loadMore}
                  hasMore={pages <= totalPageCount}
                  loader={
                    <div className="text-center label-color-1">
                      <Spinner animation="border" variant="primary" className="text-blue mx-auto" size="md" />
                    </div>
                  }
                  useWindow={false} // Set this to true if the parent container has a fixed height
                  getScrollParent={() => timelineRef.current} // Set this to the ref of the container to be scrolled
                >
                  {renderUsers()}
                </InfiniteScroll>
              </ul>
              <div className="text-center mt-3">
                {(errorMessage && <p className="text-danger fs-14">{errorMessage}</p>) || ''}
                <button
                  className="btn shadow-none red-btn px-4 py-2 fs-16 fw-500 mx-2"
                  onClick={() => setShowTemplateUsers(false)}
                >
                  Cancel
                </button>
                {!isForward && (
                  <button
                    className="btn shadow-none blue-btn px-4 py-2 fs-16 fw-500 mx-2"
                    onClick={sendTemplate}
                    disabled={isMsgSending}
                  >
                    Send
                    {isMsgSending && <Spinner animation="border" variant="light" className="ms-2" size="sm" />}
                  </button>
                )}
                {isForward && (
                  <button
                    className="btn shadow-none blue-btn px-4 py-2 fs-16 fw-500 mx-2"
                    onClick={msgForward}
                    disabled={forwarding}
                  >
                    Forward
                    {forwarding && <Spinner animation="border" variant="light" className="ms-2" size="sm" />}
                  </button>
                )}
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}
export default TemplateUsers;
