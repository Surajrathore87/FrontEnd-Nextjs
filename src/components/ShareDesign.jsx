import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/router';
import React from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { copyToClipboard } from '_helper/copyToClipboard';

function ShareDesign() {
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

  const copiedLink = `https://www.dsigndpo.com${router.asPath}`;

  function copyLink() {
    copyToClipboard(copiedLink);
    toast.success('Copied to Clipboard', toastConfig);
  }

  function shareOnWhatsapp() {
    window.open(`https://wa.me/?text=Hey there, Look into the design ${encodeURI(copiedLink)}`);
  }

  return (
    <>
      <DropdownButton id="dropdown-basic-button" title="" className="share-dropdown" drop={'up'}>
        <Dropdown.Item onClick={copyLink}>
          <FontAwesomeIcon icon={faCopy} className="fs-20" width={20} height={20} />
        </Dropdown.Item>
        <Dropdown.Item onClick={shareOnWhatsapp}>
          <FontAwesomeIcon icon={faWhatsapp} className="fs-20" width={20} height={20} />
        </Dropdown.Item>
      </DropdownButton>
    </>
  );
}

export default ShareDesign;
