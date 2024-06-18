import { canvasPreview } from 'components/CropImage/canvasPreview';
import useDebounceEffect from 'components/CropImage/useDebounceEffect';
import React, { useState, useRef, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';

// This is to demonstate how to make and center a % aspect crop
// which is a bit trickier so we use some helper functions.
function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export default function ImageCropModal(props) {
  const { setShowImageCrop, setProfileImage, profileImage } = props;
  const previewCanvasRef = useRef(null);
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState({ aspect: 16 / 9 });
  const [completedCrop, setCompletedCrop] = useState();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [base64Canvas, setBase64Canvas] = useState(null);
  const [aspect, setAspect] = useState(10 / 10);
  let reader;
  const fileRef = useRef();
  const imgRef = useRef();

  useEffect(() => {
    reader = new FileReader();
    reader.onload = function (e) {
      imgRef.current.src = e.target.result;
    };
  }, [profileImage]);

  useEffect(() => {
    if (profileImage) {
      reader.readAsDataURL(profileImage);
    }
  }, [profileImage]);

  function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  useEffect(() => {
    if (previewCanvasRef && completedCrop) {
      const canvas = document.getElementById('canvas');
      const convertBinary = dataURLtoBlob(canvas.toDataURL('image/png'));
      setBase64Canvas(convertBinary);
    }
  }, [previewCanvasRef, completedCrop]);

  function onImageLoad(e) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  useDebounceEffect(
    async () => {
      if (completedCrop?.width && completedCrop?.height && imgRef.current && previewCanvasRef.current) {
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop, scale, rotate);
      }
    },
    100,
    [completedCrop, scale, rotate]
  );

  function savePrevImage() {
    setShowImageCrop(false);
    setProfileImage(base64Canvas || profileImage);
  }

  return (
    <Modal show={true} onHide={setShowImageCrop} centered size="lg" className="crop-modal">
      <Modal.Body className="text-center">
        <div className="d-flex align-items-center border-bottom pb-3">
          <h3 className="fw-600 label-color-2 mb-0 fs-22 mt-1">Select Image</h3>
          <button
            onClick={() => setShowImageCrop(false)}
            className="border-0 outline-none bg-transparent cross-btn p-0 position-absolute top-0 end-0 mt-3 me-3"
          >
            <img src="/images/filter-close-icon.png" alt="Close" width={35} />
          </button>
        </div>
        {!profileImage && (
          <div className="mt-4">
            <img src="/images/upload-icon.svg" className="img-fluid" width={80} />
            <h4 className="label-color-2 fs-18 mt-2">Upload profile</h4>
          </div>
        )}
        <div className="py-4 text-center">
          <input
            type="file"
            className="mb-3 select-profile-input overflow-hidden"
            ref={fileRef}
            onChange={(e) => {
              setProfileImage(e.target.files[0]);
            }}
            accept=".png, .gif, .jpeg, .svg"
            placeholder="Upload File"
          />
          <div className="d-lg-flex align-items-center justify-content-center">
            {profileImage && (
              <div>
                <h5 className="fs-18 label-color-2 fw-500 mb-3">Crop Image</h5>
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={aspect}
                >
                  <img
                    ref={imgRef}
                    src={imgSrc}
                    className="cropped-image"
                    style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                    onLoad={onImageLoad}
                  />
                </ReactCrop>
              </div>
            )}
            {completedCrop && (
              <div className="ms-lg-4">
                <h5 className="fs-18 label-color-2 fw-500 mb-3">Preview</h5>
                <canvas
                  id="canvas"
                  ref={previewCanvasRef}
                  className="preview-canvas"
                  style={{
                    objectFit: 'contain',
                    width: (completedCrop && completedCrop.width) || 0,
                    height: (completedCrop && completedCrop.height) || 0,
                  }}
                />
              </div>
            )}
          </div>
          <div className="text-center">
            <button className="blue-btn py-2 px-4 fw-500 fs-15 mt-4" onClick={savePrevImage} disabled={!profileImage}>
              Select
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
