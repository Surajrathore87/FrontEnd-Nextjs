import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { callAPI } from '_services/CallAPI';

function Searchbar(props) {
  const { setIsSearch } = props;
  const [isDesigns, setIsDesigns] = useState(false);
  const [searchData, setSearchData] = useState(null);
  const [searchImagePath, setSearchImagePath] = useState(null);
  const [errorDesign, setErrorDesign] = useState(null);

  useEffect(() => {
    document.body.addEventListener('click', removeSearches);
  }, []);

  const removeSearches = () => {
    setIsDesigns(false);
  };

  function searchDesigns(event) {
    setSearchData(null);
    if (event && event != ' ') {
      const params = {
        thumbnail_id: 2,
        search_key: event,
      };
      callAPI('POST', process.env.SEARCH_DESIGNS_DATA, params, (res) => {
        if (res.status) {
          const data = res['data'];
          setIsDesigns(true);
          setSearchData(data);
          setSearchImagePath(data.image_path);
          setErrorDesign(null);
        } else {
          setIsDesigns(true);
          setErrorDesign('Designs not available');
        }
      });
    }
  }

  function renderSearches() {
    return searchData.designs.map((item, key) => {
      return (
        <li key={key} onClick={() => setIsSearch(false)}>
          <Link href={`${(item.is_grouped != 1 && '/individual-design') || '/grouped-design'}/${item.slug}`}>
            <a
              className="cursor-pointer d-flex w-100 py-2 px-3 fs-20 label-color-1 decoration-none align-items-center
              justify-content-between"
              onClick={() => setIsDesigns(false)}
            >
              <div className="d-flex align-items-center">
                <div
                  className="search-img me-lg-3 me-2"
                  style={{
                    backgroundImage: `url(${searchImagePath + item.main_image.image})`,
                  }}
                ></div>
                {/* <img src={searchImagePath + item.main_image.image} alt="icon" className="img-fluid me-lg-3 me-2" /> */}
                <span>{item.root_category.name}</span>
              </div>
              <span className="fs-18">#{item.code}</span>
            </a>
          </Link>
        </li>
      );
    });
  }

  return (
    <>
      <div className="vh-100 w-100 d-flex justify-content-center header-search position-fixed top-0 start-0">
        <button
          className="bg-transparent border-0 fs-30 text-white position-absolute top-0 end-0 py-3 px-lg-5 px-3 outline-none"
          onClick={() => setIsSearch(false)}
        >
          <img src={'/images/close-white.svg'} width={35} className="img-fluid close-search" />
        </button>
        <div className="d-flex pt-5 header-search-input">
          <div className="position-relative w-100 mt-5">
            <div className={`${(isDesigns && 'radius-input') || ''} input-search w-100 bg-white position-relative`}>
              <input
                type="search"
                className={`bg-transparent outline-none fs-20 w-100`}
                placeholder="Search designs"
                onChange={(event) => searchDesigns(event.target.value)}
              />
            </div>
            {isDesigns && (
              <div className="header-search-list position-absolute border-top w-100 bg-white main-border main-shadow">
                <ul className="list-unstyled py-2 m-0">
                  {(searchData && renderSearches()) || ''}
                  {errorDesign && <li className="fw-500 text-center py-2 fs-18">{errorDesign}</li>}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
export default Searchbar;
