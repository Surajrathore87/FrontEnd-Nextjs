import { faFileVideo, faImages, faWindowClose } from '@fortawesome/free-regular-svg-icons';
import {
  faArrowLeft,
  faArrowRight,
  faEllipsisV,
  faFile,
  faPaperclip,
  faShare,
  faTimesCircle,
  faTrash,
  faTrashAlt,
  faVideo,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { callAPI } from '_services/CallAPI';
import InfiniteScroll from 'react-infinite-scroll-component';
import Cookies from 'js-cookie';
import Axios from 'axios';
import { useAuth } from '_contexts/auth';
import { Dropdown, DropdownButton, Spinner } from 'react-bootstrap';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { downLoadPdf } from '_utils/downloadLoadPDF';
import DeleteMessageModal from 'components/Modal/DeleteMessageModal';
import { callPostAPI } from '_services/CallAPI';
// import { downLoadPdf } from '_utils/DownloadLoadPDF';

const ChatImageView = dynamic(import('components/Chat/ChatImageView'));
const Template = dynamic(import('components/Chat/Template'));
const TemplateUsers = dynamic(import('components/Modal/TemplateUsers'));

function ChatFeed(props) {
  const {
    sender,
    updateUsers,
    setUpdateUsers,
    updateChat,
    setUpdateChat,
    deleteConnection,
    showPendingChat,
    setPendingChatList,
    setSingleDelete,
    singleDelete,
  } = props;
  const [chatData, setChatData] = useState([]);
  const [feedImagePath, setFeedImagePath] = useState(null);
  const [feedVideoPath, setFeedVideoPath] = useState(null);
  const [feedFilePath, setFeedFilePath] = useState(null);
  const [connectionUser, setConnectionUser] = useState(null);
  const [hasMoreStatus, setHasMoreStatus] = useState(true);
  const [showTemplateUsers, setShowTemplateUsers] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);
  const [isForward, setIsForward] = useState(false);
  const [viewChatImage, setViewChatImage] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [totalMsgCount, setTotalMsgCount] = useState(0);
  const [page, setPage] = useState(1);
  const [inputMessage, setInputMessage] = useState('');
  const [pendingChat, setPendingChat] = useState([]);
  const [viewChatVideo, setViewChatVideo] = useState(null);
  const { userDetails } = useAuth();
  const [imgsSrc, setImgsSrc] = useState([]);
  const [videosSrc, setVideosSrc] = useState([]);
  const [filesSrc, setFilesSrc] = useState([]);
  // const [singleDelete, setSingleDelete] = useState(false);
  const [singleMessage, setSingleMessage] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(false);
  const [clearChatModal, setClearChatModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chatReceiver, setChatReceiver] = useState(0);

  const router = useRouter();
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
    getPendingChatList();
  }, []);

  function getPendingChatList() {
    callAPI('POST', process.env.PENDING_CHAT, {}, (res) => {
      console.log('PENDING_CHAT', res);
      if (res.status) {
        const data = res['data'];
        setPendingChat(data.chats);
        setPendingChatList(data.chats);
      }
    });
  }
  console.log('pendingChat', pendingChat);

  function renderPendingChatFeed() {
    return pendingChat.map((item, key) => {
      return (
        <Fragment key={key}>
          <div className="sender-msg mb-2">
            <div className="row chat-img-row m-0 justify-content-end ms-auto">
              {item.type == 'IMAGE' && (
                <div className="col-6 pe-2 ps-0">
                  <div className="d-flex">
                    <span className="cursor-pointer" onClick={() => forwardMsg(item.id)}>
                      {/* <FontAwesomeIcon icon={faShare} width={16} className="label-color-3 ms-2" /> */}
                    </span>
                    <div
                      onClick={() => setViewChatImage(feedImagePath + item.message)}
                      className="chat-img rounded mb-1 cursor-pointer"
                      style={{ backgroundImage: `url(${feedImagePath + item.message})` }}
                    ></div>
                  </div>
                  {item.is_approved == 2 && (
                    <span className="text-red fs-12 fw-bold text-nowrap">Rejected by admin</span>
                  )}
                </div>
              )}
            </div>
            {item.type == 'TEXT' && (
              <div className="">
                <div className="d-flex">
                  <span className="cursor-pointer ms-auto" onClick={() => forwardMsg(item.id)}>
                    {/* <FontAwesomeIcon icon={faShare} width={16} className="label-color-3 me-2" /> */}
                  </span>
                  {(item.message.slice(0, 4) == 'http' && (
                    <a href={item.message} target="blank" className="chat-msg-box d-block p-3 fs-15 fw-500 text-white">
                      {item.message}
                    </a>
                  )) || <div className="chat-msg-box p-3 fs-15 fw-500 text-white">{item.message}</div>}
                </div>
                <div className="text-end">
                  {item.is_approved == 2 && (
                    <span className="text-red fs-12 fw-bold text-nowrap">Rejected by admin</span>
                  )}
                </div>
              </div>
            )}
            {item.type == 'FILE' && (
              <div className="d-flex align-items-center">
                <span className="cursor-pointer ms-auto"></span>
                <div className="chat-video-box p-2 bg-white shadow rounded cursor-pointer">
                  <a href={feedFilePath + item.message} target="_blank" className="text-decoration-none">
                    <div className="px-3 py-2 bg-blue text-white rounded d-flex align-items-center ">
                      <FontAwesomeIcon icon={faFile} className="fs-15 me-2" width={25} height={30} />
                      <p className="fs-15 fw-700 ellipsis-center m-0">{item.message}</p>
                    </div>
                  </a>
                </div>
              </div>
            )}

            {item.type == 'VIDEO' && (
              <div className="d-flex align-items-center">
                <span className="cursor-pointer ms-auto"></span>
                <div
                  onClick={() => setViewChatVideo(feedVideoPath + item.message)}
                  className="chat-video-box p-2 bg-white shadow rounded cursor-pointer"
                >
                  <div className="px-3 py-2 bg-blue text-white rounded d-flex align-items-center ">
                    <FontAwesomeIcon icon={faFileVideo} className="fs-15 me-2" width={25} height={30} />
                    <p className="fs-15 fw-700 ellipsis-center m-0">{item.message}</p>
                  </div>
                </div>
              </div>
            )}
            <p className="label-color-1 fs-12 fw-500 mb-0 mt-2 text-end">
              {moment(item.created_at).startOf('minute').fromNow().replace('ago', '')}
            </p>
          </div>
        </Fragment>
      );
    });
  }

  // Message scroll to bottom
  useEffect(() => {
    const el = document.getElementById('chat-feed');
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [chatData]);
  // Chat feed
  useEffect(() => {
    // if (sender && userDetails) {
    //   // usersChatData();
    //   onScroll();
    //   // setChatData([]);
    // }
    const timer = setInterval(() => {
      setUpdateUsers(!updateUsers);
      setIsLoading(false);
      setChatData([]);
      if (userDetails) {
        const params = {
          sender_id: userDetails.id,
          receiver_id: Number(sender),
        };
        callAPI('POST', process.env.CHAT_READ, params, (res) => {
          if (res.status) {
          }
        });
      }
    }, 1000 * 20);
    return () => clearInterval(timer);
  }, [userDetails, sender, updateUsers]);

  useEffect(() => {
    if (sender != chatReceiver && sender && userDetails) {
      setChatReceiver(sender);
      setPage(1);
      setHasMoreStatus(true);
      usersChatData(1, sender);
      onScroll();
    } else {
      setChatReceiver(sender);
      setPage(page);
      usersChatData(1, chatReceiver);
      setHasMoreStatus(true);
      onScroll();
    }
  }, [userDetails, sender, updateUsers]);

  // useEffect(() => {
  //   if ( page != currentPage) {
  //     usersChatData(page, sender);
  //   }
  // }, [userDetails, sender, updateUsers]);

  // useEffect(() => {
  //   if (chatReceiver>0 && sender && userDetails) {
  //     usersChatData();
  //   }
  // }, [userDetails, sender, updateUsers]);

  // Chat Image preview
  const onSelectImage = (e) => {
    for (const file of e.target.files) {
      setSelectedImages((prev) => [...prev, file]);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImgsSrc((imgs) => [...imgs, reader.result]);
      };
    }
  };

  // Chat Video preview
  const onSelectVideo = (e) => {
    // const videoSize = e.target.files[0].size / 1024 / 1024;
    // if (videoSize <= 50) {
    for (const file of e.target.files) {
      setSelectedVideos((prev) => [...prev, file]);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setVideosSrc((videos) => [...videos, reader.result]);
      };
    }
    // } else {
    //   toast.success('Ensure your file is less than 50MB in size before uploading', toastConfig);
    //   setSelectedVideos([]);
    //   setVideosSrc([]);
    // }
  };
  // Chat File preview
  const onSelectFile = (e) => {
    // const fileSize = e.target.files[0].size / 1024 / 1024;
    // if (fileSize <= 50) {
    for (const file of e.target.files) {
      setSelectedFiles((prev) => [...prev, file]);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setFilesSrc((files) => [...files, reader.result]);
      };
    }
    // } else {
    //   toast.success('Ensure your file is less than 50MB in size before uploading', toastConfig);
    //   setSelectedFiles([]);
    //   setFilesSrc([]);
    // }
  };

  // Chat Feed data
  useEffect(() => {
    if (totalMsgCount && totalMsgCount == chatData.length) {
      setHasMoreStatus(false);
    }
  }, [chatData]);

  const onScroll = (event) => {
    const count = Math.ceil(totalMsgCount / 50);
    if (page < count) {
      const target = event?.target || 0;
      if (Math.round(target.scrollBottom + target.offsetHeight) == target.scrollHeight + 1) {
        target.scrollTo(0, target.scrollHeight);
        const timer = setTimeout(() => {
          setPage((prev) => (prev += 1));
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  };

  async function usersChatData(pageNo, receiver) {
    if (userDetails && receiver) {
      const params = {
        sender_id: userDetails.id,
        receiver_id: Number(receiver),
        connection_user_id: Number(receiver),
      };
      const res = await callPostAPI(`${process.env.USERS_CHAT_DATA}?page=${pageNo}`, params);

      // await callAPI('POST', `${process.env.USERS_CHAT_DATA}?page=${page}`, params, (res) => {
      if (res.status) {
        const data = res['data'];
        // setChatData(data.chats);
        setPage(data.paginate.current_page + 1);
        setCurrentPage(data.paginate.current_page);
        setTotalMsgCount(data.paginate.total);
        if (pageNo != 1 && receiver == chatReceiver) {
          setChatData((prev) => [...prev, ...data.chats]);
        } else {
          setChatData(data.chats);
        }
        if (!data.paginate.next_page_url) {
          setHasMoreStatus(false);
          setPage(data.paginate.current_page);
        }
        setConnectionUser(data.connection_user);
        setFeedImagePath(data.image_path);
        setFeedVideoPath(data.video_path);
        setFeedFilePath(data.file_path);
        setUpdateChat(!updateChat);
        const uniqueArray = data.chats.filter(function (item, ids, newChat) {
          return newChat.indexOf(item) == ids;
        });
        // setChatData(uniqueArray);
      }
      // });
    }
  }

  // function dataURLtoBlob(dataurl) {
  //   var arr = dataurl.split(','),
  //     mime = arr[0].match(/:(.*?);/)[1],
  //     bstr = atob(arr[1]),
  //     n = bstr.length,
  //     u8arr = new Uint8Array(n);
  //   while (n--) {
  //     u8arr[n] = bstr.charCodeAt(n);
  //   }
  //   return new Blob([u8arr], { type: mime });
  // }

  // Chat send message
  async function sendMessage(e) {
    e.preventDefault();
    if (inputMessage || imgsSrc?.length > 0 || videosSrc?.length > 0 || filesSrc?.length > 0) {
      setIsLoading(true);
      const params = {
        sender_id: userDetails.id,
        receiver_id: sender,
        message: inputMessage,
        type: 'TEXT',
      };

      // Images
      if (imgsSrc?.length > 0) {
        for (let i = 0; i < imgsSrc.length; i++) {
          params[`image${i}`] = selectedImages[i];
        }
      } else {
        ('');
      }
      // Video
      if (videosSrc?.length > 0) {
        for (let i = 0; i < videosSrc.length; i++) {
          params[`video${i}`] = selectedVideos[i];
        }
      } else {
        ('');
      }
      // Files
      if (filesSrc?.length > 0) {
        for (let i = 0; i < filesSrc.length; i++) {
          params[`file${i}`] = selectedFiles[i];
        }
      } else {
        ('');
      }

      const _headers = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'api-version': 'v1',
          Authorization: `Bearer ${Cookies.get('access_token')}`,
        },
      };
      const formData = new FormData();
      Object.keys(params).forEach((key) => formData.append(key, params[key]));

      const response = await Axios.post(`${process.env.BASE_API_URL}chat/send-message`, formData, _headers);
      const res = response.data;
      if (res.code == 200) {
        const data = res['data'];
        // usersChatData(1, chatReceiver);
        setInputMessage('');
        setSelectedFiles([]);
        setSelectedImages([]);
        setSelectedVideos([]);
        setImgsSrc([]);
        setVideosSrc([]);
        setFilesSrc([]);
        setUpdateUsers(!updateUsers);
        setIsLoading(false);
        setChatData([]);
        // ()=>usersChatData(page)();
        // onChatUpdate();
      } else {
        const errorData = res['data'];
        setIsLoading(false);
      }
    }
  }

  // function downloadFiles(e) {
  //   const pathFile = feedFilePath + e;
  //   // window.location.href = String(pathFile);
  //   // // create an anchor element with the download attribute
  //   // const anchor = document.createElement('a');
  //   // anchor.href = pathFile;

  //   // // simulate a click on the anchor to start the download
  //   // document.body.appendChild(anchor);
  //   // anchor.click();
  //   // document.body.removeChild(anchor);
  //   const pdfUrl = String(pathFile);
  //   const link = document.createElement('a');
  //   link.download = e;
  //   link.href = pdfUrl;
  //   link.click();
  // }

  function forwardMsg(id) {
    setShowTemplateUsers(true);
    setSelectedId(id);
    setIsForward(true);
  }

  function getSingleMessage(event) {
    let updatedList = [...singleMessage];
    if (event.target.checked) {
      updatedList = [...singleMessage, event.target.value];
    } else {
      updatedList.splice(singleMessage.indexOf(event.target.value), 1);
    }
    setSingleMessage(updatedList);
  }

  function renderChatFeed() {
    return chatData.map((item, key) => {
      return (
        <Fragment key={key}>
          {(item.sender_id != userDetails.id && (
            <div className="reciever-msg mb-2">
              <div className="d-flex align-items-center justify-content-between ">
                <div className="row chat-img-row align-items-center m-0">
                  {item.type == 'IMAGE' && (
                    <>
                      <div className="col-12 pe-2 ps-0">
                        <div className="d-flex align-items-center">
                          <div
                            className="chat-img rounded mb-1 cursor-pointer"
                            onClick={() => setViewChatImage(feedImagePath + item.message)}
                            style={{ backgroundImage: `url(${feedImagePath + item.message})` }}
                          ></div>
                          <span className="cursor-pointer" onClick={() => forwardMsg(item.id)}>
                            <FontAwesomeIcon icon={faShare} width={16} className="label-color-3 ms-2" />
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                {item.type == 'IMAGE' && (
                  <div className="d-flex align-items-center form-group-check pt-3">
                    {singleDelete && (
                      <>
                        <input
                          type="checkbox"
                          value={item.id}
                          id={item.id}
                          className="form-check cursor-pointer"
                          onChange={(event) => getSingleMessage(event)}
                        />
                        <label
                          htmlFor={item.id}
                          className="fw-500 fs-13 label-color-1 cursor-pointer position-relative d-flex"
                        ></label>
                      </>
                    )}
                  </div>
                )}
              </div>
              {item.type == 'TEXT' && (
                <div className="d-flex align-items-center justify-content-between ">
                  <div className="d-flex align-items-center">
                    {(item.message.slice(0, 4) == 'http' && (
                      <a href={item.message} target="blank" className="chat-msg-box p-3 fs-15 fw-500">
                        {item.message}
                      </a>
                    )) || <div className="chat-msg-box p-3 fs-15 fw-500">{item.message}</div>}
                    <span className="cursor-pointer" onClick={() => forwardMsg(item.id)}>
                      <FontAwesomeIcon icon={faShare} width={16} className="label-color-3 ms-2" />
                    </span>
                  </div>
                  <div className="d-flex align-items-center form-group-check pt-3">
                    {singleDelete && (
                      <>
                        <input
                          type="checkbox"
                          value={item.id}
                          id={item.id}
                          className="form-check cursor-pointer"
                          onChange={(event) => getSingleMessage(event)}
                        />
                        <label
                          htmlFor={item.id}
                          className="fw-500 fs-13 label-color-1 cursor-pointer position-relative d-flex"
                        ></label>
                      </>
                    )}
                  </div>
                </div>
              )}
              {item.type == 'FILE' && (
                <div className="d-flex align-items-center justify-content-between ">
                  <div className="d-flex align-items-center">
                    {/* <div className="chat-video-box p-2 bg-white shadow rounded cursor-pointer">
                      <div className="px-3 py-2 bg-blue text-white rounded">
                        <FontAwesomeIcon icon={faFile} className="fs-15 me-2" width={25} height={30} />
                        <span className="fs-15 fw-700">{item.message}</span>
                      </div>
                    </div> */}

                    <div className="chat-video-box p-2 bg-white shadow rounded cursor-pointer">
                      <a href={feedFilePath + item.message} target="_blank" className="text-decoration-none">
                        <div
                          className="px-3 py-2 bg-blue text-white rounded d-flex align-items-center "
                          // onClick={() => downloadFiles(item.message)}
                        >
                          <FontAwesomeIcon icon={faFile} className="fs-15 me-2" width={25} height={30} />
                          <p className="fs-15 fw-700 ellipsis-center m-0">{item.message}</p>
                        </div>
                      </a>
                    </div>

                    {/* <div className="chat-msg-box p-3 fs-15 fw-500">{item.message}</div> */}
                    <span className="cursor-pointer" onClick={() => forwardMsg(item.id)}>
                      <FontAwesomeIcon icon={faShare} width={16} className="label-color-3 ms-2" />
                    </span>
                  </div>
                  <div className="d-flex align-items-center form-group-check pt-3">
                    {singleDelete && (
                      <>
                        <input
                          type="checkbox"
                          value={item.id}
                          id={item.id}
                          className="form-check cursor-pointer"
                          onChange={(event) => getSingleMessage(event)}
                        />
                        <label
                          htmlFor={item.id}
                          className="fw-500 fs-13 label-color-1 cursor-pointer position-relative d-flex"
                        ></label>
                      </>
                    )}
                  </div>
                </div>
              )}
              {item.type == 'VIDEO' && (
                <div className="d-flex align-items-center justify-content-between ">
                  <div className="d-flex align-items-center">
                    <div
                      onClick={() => setViewChatVideo(feedVideoPath + item.message)}
                      className="chat-video-box p-2 bg-white shadow rounded cursor-pointer"
                    >
                      <div className="px-3 py-2 bg-blue text-white rounded d-flex align-items-center ">
                        <FontAwesomeIcon icon={faFileVideo} className="fs-15 me-2" width={25} height={30} />
                        <p className="fs-15 fw-700 ellipsis-center m-0">{item.message}</p>
                      </div>
                    </div>

                    {/* <div className="chat-msg-box p-3 fs-15 fw-500">{item.message}</div> */}
                    <span className="cursor-pointer" onClick={() => forwardMsg(item.id)}>
                      <FontAwesomeIcon icon={faShare} width={16} className="label-color-3 ms-2" />
                    </span>
                  </div>
                  <div className="d-flex align-items-center form-group-check pt-3">
                    {singleDelete && (
                      <>
                        <input
                          type="checkbox"
                          value={item.id}
                          id={item.id}
                          className="form-check cursor-pointer"
                          onChange={(event) => getSingleMessage(event)}
                        />
                        <label
                          htmlFor={item.id}
                          className="fw-500 fs-13 label-color-1 cursor-pointer position-relative d-flex"
                        ></label>
                      </>
                    )}
                  </div>
                </div>
              )}
              <p className="label-color-1 fs-12 fw-500 mb-0 mt-2">
                {moment(item.created_at).startOf('minute').fromNow().replace('ago', '')}
              </p>
            </div>
          )) || (
            <div className="sender-msg mb-2">
              <div className="d-flex justify-content-between align-items-center">
                {item.type == 'IMAGE' && (
                  <div className="d-flex align-items-center form-group-check pt-3">
                    {singleDelete && (
                      <>
                        <input
                          type="checkbox"
                          value={item.id}
                          id={item.id}
                          className="form-check cursor-pointer"
                          onChange={(event) => getSingleMessage(event)}
                        />
                        <label
                          htmlFor={item.id}
                          className="fw-500 fs-13 label-color-1 cursor-pointer position-relative d-flex"
                        ></label>
                      </>
                    )}
                  </div>
                )}
                <div className="row chat-img-row m-0 justify-content-end ms-aut">
                  {item.type == 'IMAGE' && (
                    <div className="col-12 pe-2 ps-0">
                      <div className="d-flex align-items-center">
                        <span className="cursor-pointer" onClick={() => forwardMsg(item.id)}>
                          <FontAwesomeIcon icon={faShare} width={16} className="label-color-3 me-2" />
                        </span>
                        <div
                          onClick={() => setViewChatImage(feedImagePath + item.message)}
                          className="chat-img rounded mb-1 cursor-pointer"
                          style={{ backgroundImage: `url(${feedImagePath + item.message})` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {item.type == 'TEXT' && (
                <div className="d-flex align-items-center">
                  <div className="d-flex align-items-center form-group-check pt-3">
                    {singleDelete && (
                      <>
                        <input
                          type="checkbox"
                          value={item.id}
                          id={item.id}
                          className="form-check cursor-pointer"
                          onChange={(event) => getSingleMessage(event)}
                        />
                        <label
                          htmlFor={item.id}
                          className="fw-500 fs-13 label-color-1 cursor-pointer position-relative d-flex"
                        ></label>
                      </>
                    )}
                  </div>
                  <span className="cursor-pointer ms-auto" onClick={() => forwardMsg(item.id)}>
                    <FontAwesomeIcon icon={faShare} width={16} className="label-color-3 me-2" />
                  </span>
                  {(item.message.slice(0, 4) == 'http' && (
                    <a href={item.message} target="blank" className="chat-msg-box d-block p-3 fs-15 fw-500 text-white">
                      {item.message}
                    </a>
                  )) || <div className="chat-msg-box p-3 fs-15 fw-500 text-white">{item.message}</div>}
                </div>
              )}
              {item.type == 'FILE' && (
                <div className="d-flex align-items-center">
                  <div className="d-flex align-items-center form-group-check pt-3">
                    {singleDelete && (
                      <>
                        <input
                          type="checkbox"
                          value={item.id}
                          id={item.id}
                          className="form-check cursor-pointer"
                          onChange={(event) => getSingleMessage(event)}
                        />
                        <label
                          htmlFor={item.id}
                          className="fw-500 fs-13 label-color-1 cursor-pointer position-relative d-flex"
                        ></label>
                      </>
                    )}
                  </div>
                  <span className="cursor-pointer ms-auto" onClick={() => forwardMsg(item.id)}>
                    <FontAwesomeIcon icon={faShare} width={16} className="label-color-3 me-2" />
                  </span>
                  <div className="chat-video-box p-2 bg-white shadow rounded cursor-pointer">
                    <a href={feedFilePath + item.message} target="_blank" className="text-decoration-none">
                      <div
                        className="px-3 py-2 bg-blue text-white rounded d-flex align-items-center "
                        // onClick={() => downloadFiles(item.message)}
                      >
                        <FontAwesomeIcon icon={faFile} className="fs-15 me-2" width={25} height={30} />
                        <p className="fs-15 fw-700 ellipsis-center m-0">{item.message}</p>
                      </div>
                    </a>
                  </div>
                </div>
              )}
              {item.type == 'VIDEO' && (
                <div className="d-flex align-items-center">
                  <div className="d-flex align-items-center form-group-check pt-3">
                    {singleDelete && (
                      <>
                        <input
                          type="checkbox"
                          value={item.id}
                          id={item.id}
                          className="form-check cursor-pointer"
                          onChange={(event) => getSingleMessage(event)}
                        />
                        <label
                          htmlFor={item.id}
                          className="fw-500 fs-13 label-color-1 cursor-pointer position-relative d-flex"
                        ></label>
                      </>
                    )}
                  </div>
                  <span className="cursor-pointer ms-auto" onClick={() => forwardMsg(item.id)}>
                    <FontAwesomeIcon icon={faShare} width={16} className="label-color-3 me-2" />
                  </span>
                  {/* <a target="blank" className="chat-msg-box d-block p-3 fs-15 fw-500 text-white">
                    VIDEO
                  </a> */}
                  <div
                    onClick={() => setViewChatVideo(feedVideoPath + item.message)}
                    className="chat-video-box p-2 bg-white shadow rounded cursor-pointer"
                  >
                    <div className="px-3 py-2 bg-blue text-white rounded d-flex align-items-center ">
                      <FontAwesomeIcon icon={faFileVideo} className="fs-15 me-2" width={25} height={30} />
                      <p className="fs-15 fw-700 ellipsis-center m-0">{item.message}</p>
                    </div>
                  </div>
                </div>
              )}
              <p className="label-color-1 fs-12 fw-500 mb-0 mt-2 text-end">
                {moment(item.created_at).startOf('minute').fromNow().replace('ago', '')}
              </p>
            </div>
          )}
        </Fragment>
      );
    });
  }

  function removeImage(key) {
    const list = [...imgsSrc];
    const fileList = [...selectedImages];
    list.splice(key, 1);
    setImgsSrc(list);
    setSelectedImages(fileList);
  }

  function removeVideos(key) {
    const list = [...videosSrc];
    const fileList = [...selectedVideos];
    list.splice(key, 1);
    setVideosSrc(list);
    setSelectedVideos(fileList);
  }

  function removeFiles(key) {
    const list = [...filesSrc];
    const fileList = [...selectedVideos];
    list.splice(key, 1);
    setFilesSrc(list);
    setSelectedVideos(fileList);
  }

  function clearChat() {
    const params = {
      receiver_id: Number(sender),
    };
    callAPI('POST', process.env.CLEAR_CHAT, params, (res) => {
      if (res.status) {
        setChatData([]);
        setClearChatModal(false);
        toast.success(res['message'], toastConfig);
      } else {
        toast.error(res['message'], toastConfig);
      }
    });
  }

  function handleDeleteConnection(id) {
    setShowDeleteModal(true);
  }

  function deleteSingleMessage() {
    const params = {
      receiver_id: Number(sender),
      messages_id: singleMessage.join(','),
    };
    callAPI('POST', process.env.CLEAR_CHAT, params, (res) => {
      if (res.status) {
        setShowDeleteModal(false);
        setChatData([]);
        setSingleDelete(false);
        usersChatData(page, chatReceiver);
        toast.success(res['message'], toastConfig);
        setSingleMessage([]);
      } else {
        toast.error(res['message'], toastConfig);
      }
    });
  }

  function clearDeleteMessageList() {
    setShowDeleteModal(false);
    setSingleDelete(false);
    setSingleMessage([]);
  }

  return (
    <>
      <DeleteMessageModal
        show={showDeleteModal}
        closeModal={clearDeleteMessageList}
        confirmDelete={deleteSingleMessage}
        module="SingleDelete"
      />
      <DeleteMessageModal
        show={clearChatModal}
        closeModal={() => setClearChatModal(false)}
        confirmDelete={clearChat}
        module="ClearChat"
      />
      {showTemplateUsers && (
        <TemplateUsers
          setShowTemplateUsers={setShowTemplateUsers}
          selectedId={selectedId}
          isForward={isForward}
          senderID={sender}
        />
      )}
      {(viewChatImage || viewChatVideo) && (
        <ChatImageView
          viewChatImage={viewChatImage}
          setViewChatImage={setViewChatImage}
          viewChatVideo={viewChatVideo}
          setViewChatVideo={setViewChatVideo}
        />
      )}
      {showTemplate && <Template setShowTemplate={setShowTemplate} />}
      <div className="right-chat-box overflow-hidden h-100 d-flex flex-column">
        {(showPendingChat && (
          <div className="border-bottom py-lg-3 px-3 py-2 ps-lg-3 ps-0 d-flex align-items-center">
            Pending For Approval
          </div>
        )) || (
          <div className="border-bottom py-lg-3 px-3 py-2 ps-lg-3 ps-0 d-flex align-items-center">
            {(connectionUser && (
              <>
                <button
                  className="bg-transparent outline-none border-0 text-blue p-0 d-lg-none me-2"
                  onClick={() => router.back()}
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="fs-15" width={15} />
                </button>
                <div
                  className="list-user user-active rounded-circle position-relative"
                  style={{
                    backgroundImage: `url(${
                      (connectionUser.profile_image &&
                        userDetails &&
                        userDetails.image_path + connectionUser.profile_image) ||
                      '/images/avatar.svg'
                    })`,
                  }}
                ></div>
                <div className="ms-3">
                  <p className="fs-14 label-color-2 fw-600 mb-1">
                    {(connectionUser.name && connectionUser.name) || connectionUser?.mobile_number || 'DesignDpo'}
                  </p>
                  {/* <p className="fs-13 label-color-1 mb-0">{userDetails && userDetails.role_name}</p> */}
                </div>
              </>
            )) ||
              ''}
            <div className="ms-auto d-flex align-items-center">
              {(singleDelete &&
                ((singleMessage.length != 0 && (
                  <div className="me-2">
                    <FontAwesomeIcon
                      icon={faTrashAlt}
                      className="text-red cursor-pointer"
                      width={16}
                      onClick={handleDeleteConnection}
                    />
                  </div>
                )) || (
                  <div className="me-2">
                    <FontAwesomeIcon
                      icon={faTimesCircle}
                      className="text-red cursor-pointer"
                      width={22}
                      onClick={() => setSingleDelete(!singleDelete)}
                    />
                  </div>
                ))) ||
                ''}
              <DropdownButton
                align="end"
                className="chat-dropdown"
                title={<FontAwesomeIcon icon={faEllipsisV} width={8} className="label-color-1" />}
                variant="none"
              >
                <Dropdown.Item eventKey="1" onClick={() => setClearChatModal(true)}>
                  Clear Chat
                </Dropdown.Item>
                <Dropdown.Item eventKey="2" onClick={() => deleteConnection(sender)}>
                  Delete Connection
                </Dropdown.Item>
                <Dropdown.Item eventKey="3" onClick={() => setSingleDelete(!singleDelete)}>
                  Delete Message
                </Dropdown.Item>
              </DropdownButton>
            </div>
          </div>
        )}
        {(showPendingChat && (
          <div className="d-flex h-100 w-100 align-items-end">
            {chatData &&
              userDetails &&
              ((
                <div className="w-100 d-flex flex-column chat-screen pending-chat-screen pb-2 p-0" id="chat-feed">
                  {/* <div className="chat-today mb-4 mt-3 position-relative">
          <span
            className="position-absolute mx-auto start-0 end-0 d-flex align-items-center
            bg-white label-color-1 fs-12 justify-content-center fw-500"
          >
            Today
          </span>
          </div> */}
                  {chatData && (
                    <div
                      className=""
                      id="scrollableDiv"
                      style={{
                        overflow: 'auto',
                        display: 'flex',
                        flexDirection: 'column-reverse',
                        height: 700,
                      }}
                      onScroll={onScroll}
                    >
                      <InfiniteScroll
                        dataLength={chatData.length}
                        next={() => usersChatData(page, chatReceiver)}
                        hasMore={hasMoreStatus}
                        height={680}
                        inverse={true}
                        className={'p-lg-4 p-3 pb-2'}
                        style={{ display: 'flex', flexDirection: 'column-reverse' }} //To put endMessage and loader to the top.
                        loader={
                          <div className="text-center label-color-1">
                            <Spinner animation="border" variant="primary" className="text-blue mx-auto" size="md" />
                          </div>
                        }
                        scrollableTarget="scrollableDiv"
                        endMessage={''}
                      >
                        {showPendingChat && renderPendingChatFeed()}
                      </InfiniteScroll>
                    </div>
                  )}
                </div>
              ) ||
                '')}
          </div>
        )) || (
          <div className="d-flex h-100 w-100 align-items-end">
            {chatData &&
              userDetails &&
              ((
                <div className="w-100 d-flex flex-column chat-screen pb-2 p-0" id="chat-feed">
                  {/* <div className="chat-today mb-4 mt-3 position-relative">
              <span
                className="position-absolute mx-auto start-0 end-0 d-flex align-items-center
                bg-white label-color-1 fs-12 justify-content-center fw-500"
              >
                Today
              </span>
              </div> */}
                  {chatData && (
                    <div
                      className=""
                      id="scrollableDiv"
                      style={{
                        overflow: 'auto',
                        display: 'flex',
                        flexDirection: 'column-reverse',
                      }}
                      onScroll={onScroll}
                    >
                      <InfiniteScroll
                        dataLength={chatData.length}
                        next={() => usersChatData(page, chatReceiver)}
                        hasMore={hasMoreStatus}
                        height={510}
                        inverse={true}
                        className={'p-lg-4 p-3 pb-2'}
                        style={{ display: 'flex', flexDirection: 'column-reverse' }} //To put endMessage and loader to the top.
                        loader={
                          <div className="text-center label-color-1">
                            <Spinner animation="border" variant="primary" className="text-blue mx-auto" size="md" />
                          </div>
                        }
                        scrollableTarget="scrollableDiv"
                        endMessage={''}
                      >
                        {(showPendingChat && renderPendingChatFeed()) || renderChatFeed()}
                      </InfiniteScroll>
                    </div>
                  )}
                </div>
              ) ||
                '')}
          </div>
        )}
        {!showPendingChat && (
          <div className="d-flex mt-auto px-lg-4 px-3 mb-4 chat-feed-inputs">
            <div className="w-100 rounded-6 position-relative">
              <form onSubmit={sendMessage}>
                <div className="upload-wrapper">
                  {imgsSrc?.length > 0 && (
                    <div className="upload-label d-flex align-items-center bg-light p-3 mb-2 rounded-6">
                      {imgsSrc.map((item, key) => (
                        <div
                          key={key}
                          className="me-3 rounded chat-prev position-relative"
                          style={{ backgroundImage: `url(${item})` }}
                        >
                          <img
                            src="/images/close-card.svg"
                            alt="remove"
                            className="img-fluid position-absolute cursor-pointer"
                            width={18}
                            onClick={() => removeImage(key)}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  {videosSrc?.length > 0 && (
                    <div className="upload-label d-flex align-items-center bg-light p-3 mb-2 rounded-6">
                      {videosSrc.map((item, key) => (
                        <div key={key} className="me-3 rounded chat-prev chat-prev-video position-relative">
                          {/* <FontAwesomeIcon icon={faFileVideo} className="fs-12 label-color-1" width={50} /> */}
                          <video width="60" height="60">
                            <source src={`${item}`} type="video/mp4" />
                            <source src={`${item}`} type="video/ogg" />
                            Your browser does not support the video tag.
                          </video>
                          <img
                            src="/images/close-card.svg"
                            alt="remove"
                            className="img-fluid position-absolute cursor-pointer"
                            width={18}
                            onClick={() => removeVideos(key)}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  {filesSrc?.length > 0 && (
                    <div className="upload-label d-flex align-items-center bg-light p-3 mb-2 rounded-6">
                      {filesSrc.map((item, key) => (
                        <div key={key} className="me-3 rounded chat-prev chat-prev-video position-relative text-center">
                          <FontAwesomeIcon icon={faFile} className="label-color-1" width={40} />
                          <img
                            src="/images/close-card.svg"
                            alt="remove"
                            className="img-fluid position-absolute cursor-pointer"
                            width={18}
                            onClick={() => removeFiles(key)}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="chat-media-select position-absolute">
                    <Dropdown>
                      <Dropdown.Toggle id="dropdown-basic" className="border-0 outline-none bg-transparent shadow-none">
                        <FontAwesomeIcon icon={faPaperclip} className="" width={20} />
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <div className="cursor-pointer">
                          <div className="text-center">
                            {imgsSrc?.length < 5 && (
                              <label
                                htmlFor="chat-image"
                                className="chat-image-select position-relative cursor-pointer"
                              >
                                <FontAwesomeIcon icon={faImages} className="cursor-pointer pb-2" title="Image" />
                                <input
                                  type="file"
                                  name="profile_image"
                                  className="upload-box m-auto position-absolute start-0 w-100 cursor-pointer"
                                  onChange={onSelectImage}
                                  multiple
                                  accept=".png, .gif, .jpeg, .jpg"
                                  placeholder="Upload Image"
                                />
                              </label>
                            )}
                          </div>
                        </div>
                        <div className="cursor-pointer">
                          <div className="text-center">
                            {videosSrc?.length < 5 && (
                              <label
                                htmlFor="chat-image"
                                className="chat-image-select position-relative cursor-pointer"
                              >
                                <FontAwesomeIcon icon={faVideo} className="cursor-pointer pb-2 ms-1" title="Video" />
                                <input
                                  type="file"
                                  name="video_image"
                                  className="upload-box m-auto position-absolute start-0 w-100 cursor-pointer"
                                  onChange={onSelectVideo}
                                  multiple
                                  accept=".mp4, .mkv"
                                  placeholder="Upload Image"
                                />
                              </label>
                            )}
                          </div>
                        </div>
                        <div className="cursor-pointer">
                          <div className="text-center">
                            {filesSrc?.length < 5 && (
                              <label
                                htmlFor="chat-image"
                                className="chat-image-select position-relative cursor-pointer"
                              >
                                <FontAwesomeIcon
                                  icon={faFile}
                                  className="cursor-pointer pb-2 ms-1 fs-12"
                                  title="File"
                                  width={16}
                                />
                                <input
                                  type="file"
                                  name="file_image"
                                  className="upload-box m-auto position-absolute start-0 w-100 cursor-pointer"
                                  onChange={onSelectFile}
                                  multiple
                                  accept=".pdf, .zip"
                                  placeholder="Upload Image"
                                />
                              </label>
                            )}
                          </div>
                        </div>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
                <input
                  type="text"
                  className="w-100 chat-input border rounded-6 fs-14 label-color-1"
                  placeholder="Write your message here..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                />
                <button
                  className="blue-btn send-msg-btn p-0 position-absolute"
                  title="Send"
                  type="submit"
                  disabled={isLoading}
                >
                  {(isLoading && <Spinner animation="border" variant="white" className="mt-1 mx-auto spinner" />) || (
                    <FontAwesomeIcon icon={faArrowRight} width={14} />
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
export default ChatFeed;
