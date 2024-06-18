import React from 'react';

function ChatImageView(props) {
  const { viewChatImage, setViewChatImage, viewChatVideo, setViewChatVideo } = props;
  return (
    <>
      <div
        className="bg-white vh-100 w-100 overflow-hidden d-flex align-items-center
        justify-content-center position-fixed top-0 start-0 chat-image-view p-4"
      >
        {viewChatImage && (
          <button
            onClick={() => setViewChatImage(null)}
            className="border-0 outline-none cross-btn p-0 position-absolute top-0 end-0 mt-3 me-3 bg-transparent"
          >
            <img src="/images/close-square.svg" alt="Close" width={40} />
          </button>
        )}
        {viewChatVideo && (
          <button
            onClick={() => setViewChatVideo(null)}
            className="border-0 outline-none cross-btn p-0 position-absolute top-0 end-0 mt-3 me-3 bg-transparent"
          >
            <img src="/images/close-square.svg" alt="Close" width={40} />
          </button>
        )}
        {viewChatImage && <img src={viewChatImage} className="img-fluid mh-100" />}
        {viewChatVideo && (
          <video width="700" height="700" className="img-fluid" controls>
            <source src={`${viewChatVideo}`} type="video/mp4" />
            <source src={`${viewChatVideo}`} type="video/ogg" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </>
  );
}
export default ChatImageView;
