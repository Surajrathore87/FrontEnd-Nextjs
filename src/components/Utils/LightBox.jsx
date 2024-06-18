import FslightboxReact from 'fslightbox-react';
import React, { useState } from 'react';

function LightBox(props) {
  const { toggler } = props;
  // const [toggler, setToggler] = useState(false);
  return (
    <>
      {/* <button onClick={() => setToggler(!toggler)}>Toggle Lightbox</button> */}
      <div className="light-box">
        <FslightboxReact
          toggler={toggler}
          sources={['https://i.imgur.com/fsyrScY.jpg', './images/image-modal.png', './images/list-item-map.png']}
        />
      </div>
    </>
  );
}

export default LightBox;
