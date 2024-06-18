import React, { useEffect, useState } from 'react';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 600) {
      setVisible(true);
    } else if (scrolled <= 600) {
      setVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisible);
  }, []);

  return (
    <button
      className="position-fixed scroll-to-top border-0 rounded-circle text-white"
      onClick={scrollToTop}
      style={{ display: visible ? 'inline' : 'none' }}
    >
      <FontAwesomeIcon icon={faArrowUp} width={20} height={17} />
    </button>
  );
}

export default ScrollToTop;
