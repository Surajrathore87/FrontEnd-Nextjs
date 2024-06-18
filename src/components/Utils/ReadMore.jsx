import { useState } from 'react';

function ReadMore(props) {
  const { children, maxLength = 50 } = props;
  const text = children;
  const [isReadMore, setIsReadMore] = useState(true);
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };
  return (
    <p className="text main-p">
      {/* {(isReadMore && text.slice(0, maxLength)) || text}  */}
      {(isReadMore && text?.slice(0, maxLength)) ||
        text
          ?.split('\r\n\r\n')
          .map((paragraph, i) => <p>{paragraph.split('\n').reduce((total, line) => [total, <br />, line])}</p>)}
      {(text?.length > maxLength && (
        <span onClick={toggleReadMore} className="text-red fw-400 cursor-pointer ">
          {isReadMore ? '...Read more' : ' Show less'}
        </span>
      )) ||
        ''}
    </p>
  );
}

export default ReadMore;
