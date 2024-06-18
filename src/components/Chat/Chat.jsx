import DeleteMessageModal from 'components/Modal/DeleteMessageModal';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '_contexts/auth';
import { callAPI } from '_services/CallAPI';

const ChatList = dynamic(import('components/Chat/ChatList'));
const ChatFeed = dynamic(import('components/Chat/ChatFeed'));
const Template = dynamic(import('components/Chat/Template'));

function Chat(props) {
  const { sender } = props;
  const [updateUsers, setUpdateUsers] = useState(true);
  const [updateChat, setUpdateChat] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [showTemplate, setShowTemplate] = useState(false);
  const [showSelected, setShowSelected] = useState(false);
  const [isMsgSending, setIsMsgSending] = useState(false);
  const [pendingChat, setPendingChat] = useState(false);
  const [userType, setUserType] = useState('home-owner');
  const [pendingChatList, setPendingChatList] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [connectionId, setConnectionId] = useState('');
  const [singleDelete, setSingleDelete] = useState(false);
  const router = useRouter();
  const { userDetails, usersList, setUsersList } = useAuth();
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
    if (userDetails) {
      chatUsers();
    }
    const timer = setInterval(() => {
      chatUsers(false);
    }, 1000 * 20);
    return () => clearInterval(timer);
  }, [userDetails, updateUsers, updateChat, userType]);

  function chatUsers(item) {
    const params = {
      sender_id: userDetails.id,
      role_type: (userDetails.role_type == 'carpenter' && userType) || '',
    };
    callAPI('POST', process.env.CHAT_CONNECTIONS, params, (res) => {
      setIsLoading(false);
      if (res.status) {
        const data = res['data'];
        setUsersList(data);
      }
    });
  }

  // Chat send message
  function sendMessage(selectedUsers, selectedUrl) {
    if (selectedUrl && selectedUsers.length > 0) {
      setIsMsgSending(true);
      const params = {
        sender_id: userDetails.id,
        receiver_id: selectedUsers,
        message: '',
        type: 'TEXT',
        // template_id: selectedId,
        template_url: selectedUrl,
      };
      callAPI('POST', process.env.CHAT_SEND_MESSAGE, params, (res) => {
        setIsLoading(false);
        if (res.status) {
          const data = res['data'];
          setUpdateUsers(!updateUsers);
        }
        setShowSelected(false);
        setShowTemplate(false);
        setIsMsgSending(false);
      });
    }
  }

  function handleDeleteConnection(id) {
    setShowDeleteModal(true);
    setConnectionId(id);
  }

  function deleteConnection() {
    if (connectionId) {
      const params = {
        receiver_id: connectionId,
      };
      callAPI('POST', process.env.DELETE_CONNECTION, params, (res) => {
        if (res.status) {
          toast.success(res['message'], toastConfig);
          router.push('/chat');
        } else {
          toast.error(res['message'], toastConfig);
        }
      });
    }
  }

  return (
    <>
      <DeleteMessageModal
        show={showDeleteModal}
        closeModal={() => setShowDeleteModal(false)}
        confirmDelete={deleteConnection}
      />
      <section className="py-lg-4 chat-section">
        <div className="container">
          {/* <div className="row">
            <div className="col-12 d-none d-lg-block">
              <h1 className="inner-heading mb-lg-4 mb-0">Chat</h1>
            </div>
          </div> */}
          <div className="row align-items-stretch position-sticky">
            {showTemplate && (
              <div className="position-absolute template-wrapper bg-white w-100">
                <Template
                  setShowTemplate={setShowTemplate}
                  showSelected={showSelected}
                  setShowSelected={setShowSelected}
                  isMsgSending={isMsgSending}
                  sendMessage={sendMessage}
                />
              </div>
            )}

            {!showTemplate && (
              <>
                <div className={`col-lg-5 col-xl-4 position-relative ${(sender && 'd-none d-lg-block') || ''}`}>
                  <div className="ms-auto position-absolute template-btn d-flex align-items-center">
                    {pendingChatList.length != [] && (
                      <div className="me-2">
                        <img
                          src="/images/privacy.png"
                          alt=""
                          width={25}
                          className="cursor-pointer"
                          onClick={() => setPendingChat(!pendingChat)}
                        />
                      </div>
                    )}
                    {(userDetails &&
                      userDetails.role_name == 'Dealer' &&
                      usersList &&
                      usersList.connection_users?.length > 0 && (
                        <a
                          className="cursor-pointer decoration-none text-blue fw-500"
                          onClick={() => setShowTemplate(true)}
                        >
                          Template
                        </a>
                      )) ||
                      ''}
                  </div>

                  <ChatList
                    sender={sender}
                    usersList={usersList}
                    isLoading={isLoading}
                    userDetails={userDetails}
                    setUserType={setUserType}
                    userType={userType}
                    chatUsers={chatUsers}
                    showPendingChat={setPendingChat}
                    setSingleDelete={setSingleDelete}
                    singleDelete={singleDelete}
                  />
                </div>
                <div className={`col-lg-7 col-xl-8 ${(sender && 'd-block') || 'd-none d-lg-block'}`}>
                  {(sender && (
                    <ChatFeed
                      sender={sender}
                      usersList={usersList}
                      setUpdateUsers={setUpdateUsers}
                      updateUsers={updateUsers}
                      updateChat={updateChat}
                      setUpdateChat={setUpdateChat}
                      deleteConnection={handleDeleteConnection}
                      showPendingChat={pendingChat}
                      setPendingChatList={setPendingChatList}
                      setUserType={setUserType}
                      setSingleDelete={setSingleDelete}
                      singleDelete={singleDelete}
                    />
                  )) || (
                    <div className="d-flex align-items-center justify-content-center h-100 text-center">
                      <div>
                        <img src="/images/empty-chat.svg" alt="Empty Chat" className="img-fluid mb-4" width={350} />
                        <p className="fs-20 fw-600 label-color-2">Let's start chat with your connections!</p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default Chat;
