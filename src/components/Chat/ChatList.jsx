import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { encrypt } from '_helper/encryptDecrypt';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { callAPI } from '_services/CallAPI';

const ReferralModal = dynamic(import('components/Modal/ReferralModal'));

function ChatList(props) {
  const {
    usersList,
    userDetails,
    sender,
    isLoading,
    setUserType,
    userType,
    chatUsers,
    showPendingChat,
    setSingleDelete,
  } = props;
  const [showReferModal, setShowReferModal] = useState();
  const [chatId, setChatId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (router.pathname == '/chat') {
      setUserType('home-owner');
    } else {
      const user = localStorage.getItem('chatUserType');
      if (user == 'home-owner') {
        setUserType('home-owner');
      } else {
        setUserType('dealer');
      }
    }
  }, [router]);

  function goToCHAT(id) {
    setChatId(id);
    setSingleDelete(false);
    showPendingChat(false);
    const encryptCode = encrypt(id).replace(/\//g, 'dpo');
    router.push(`/chat/${encryptCode}`);
    if (userDetails) {
      const params = {
        sender_id: userDetails.id,
        receiver_id: id,
      };
      callAPI('POST', process.env.CHAT_READ, params, (res) => {
        if (res.status) {
        }
      });
    }
  }

  function renderUsers() {
    return usersList.connection_users.map((item, key) => {
      // console.log('userList', usersList.connection_users);
      return (
        <li key={key}>
          <a
            className={`border-bottom p-3 d-flex cursor-pointer decoration-none position-relative
            ${(chatId == item?.receiver_user_id && 'bg-light') || ''}`}
            onClick={() =>
              goToCHAT(
                (userDetails && userDetails.id == item.receiver_user_id && item.sender_user_id) || item.receiver_user_id
              )
            }
          >
            <div className="d-flex align-items-center">
              <div
                className={`list-user rounded-circle position-relative ${
                  (item.sender_chat_count > 0 && item.receiver_chat_count > 0 && 'user-active') || ''
                }`}
                style={{
                  backgroundImage: `url(${
                    (item.profile_image && userDetails.image_path + item.profile_image) || '/images/avatar.svg'
                  })`,
                }}
              ></div>
              <div className="ms-lg-3 ms-2 position-relative">
                <p
                  className={`fs-15 fw-600 mb-1 line-clamp-1 ${
                    (sender == item.id && 'text-blue') || 'label-color-2'
                  }  ${(item.is_read == 0 && 'msg-unread') || ''}`}
                >
                  {(item.name && item.name) || item.mobile_number}
                </p>
                <p className={`fs-13 label-color-1 m-0 line-clamp-1 ${(item.is_read == 0 && 'fw-600') || ''}`}>
                  {(item.type == 'IMAGE' && 'Image') ||
                    (item.type == 'VIDEO' && 'Video') ||
                    (item.type == 'FILE' && 'File') ||
                    item.message}
                </p>
              </div>
            </div>
            <p className="fs-13 label-color-1 m-0 ms-auto text-nowrap">
              {(item.created_at && moment(item.created_at).startOf('minute').fromNow().replace('ago', '')) || ''}
            </p>
          </a>
        </li>
      );
    });
  }

  function renderConnections(item) {
    setUserType(item);
    localStorage.setItem('chatUserType', item);
  }

  console.log('user Type', userType);

  return (
    <>
      {showReferModal && <ReferralModal setShowReferModal={setShowReferModal} />}
      <div className="left-chat-box overflow-hidden h-100">
        <div className="chat-list-header border-bottom d-flex align-items-center p-lg-3 py-3 justify-content-between">
          <h2 className="fw-700 label-color-2 m-0 heading-fonts">Chats</h2>
          {/* <div>
            <button className="blue-btn add-chat-btn p-0" title="Add Peoples">
              <img src="/images/plus-white.svg" className="img-fluid plus-white" />
              <img src="/images/plus-blue.svg" className="img-fluid d-none plus-blue" />
            </button>
          </div> */}
        </div>
        {/* <div className="location-box px-lg-4 py-3 d-flex align-items-center">
          <div className="location-icon bg-white border rounded-circle d-flex align-items-center justify-content-center me-lg-3 me-2">
            <img src="/images/map-pin.svg" className="img-fluid" />
          </div>
          <div>
            <p className="fs-14 label-color-1 mb-1">Showing dealers from location</p>
            <p className="fs-15 label-color-2 fw-600 mb-0">Jodhpur - 342001</p>
          </div>
        </div> */}
        {userDetails?.role_type == 'carpenter' && (
          <div className="d-flex border-bottom py-2 connection-btn">
            <div className="col-6 text-center px-2">
              <button
                className={`w-100 py-2 ${userType == 'home-owner' && 'active'}`}
                onClick={() => renderConnections('home-owner')}
              >
                Home
              </button>
            </div>
            <div className="col-6 text-center px-2">
              <button
                className={`w-100 py-2 ${userType == 'dealer' && 'active'}`}
                onClick={() => renderConnections('dealer')}
              >
                Dealer
              </button>
            </div>
          </div>
        )}
        {!isLoading && userDetails && usersList.connection_users?.length > 0 && (
          <ul className="chat-list h-100 d-flex flex-column list-unstyled py-3">{renderUsers()}</ul>
        )}

        {!isLoading && userDetails && usersList.connection_users?.length < 1 && (
          <div className="h-100 p-3 d-flex py-5 justify-content-center">
            <div className="text-center py-5">
              <img src="/images/chat-list-img.svg" alt="Chat" className="img-fluid mb-4" />
              <p className="label-color-2 fs-17 fw-500 mb-3">
                Refer your friend via referral code and get connected on chat
              </p>
              <button className="btn blue-btn fw-500 fs-16 py-2 px-4" onClick={() => setShowReferModal(true)}>
                Share Now
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
export default ChatList;
