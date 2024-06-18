import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { callAPI } from '_services/CallAPI';
import dynamic from 'next/dynamic';
import { useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { Spinner } from 'react-bootstrap';

const EmptyWishlist = dynamic(import('components/EmptyWishlist'));
const FavouriteDesignsLoader = dynamic(import('components/Loaders/FavouriteDesignsLoader'));
const RemoveFromWishlist = dynamic(import('./Modal/RemoveFromWishlist'));

function FavouriteDesigns(props) {
  const { folderId } = props;
  const [designData, setDesignData] = useState([]);
  const [folderData, setFolderData] = useState(null);
  const [imagePath, setImagePath] = useState(null);
  const [updateWishlist, setUpdateWishlist] = useState(false);
  const [showRemoveWishlist, setShowRemoveWishlist] = useState(false);
  const [designId, setDesignId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPageCount, setTotalPageCount] = useState(null);
  const [pages, setPages] = useState(1);
  const timelineRef = useRef();

  useEffect(() => {
    if (folderId) {
      getDesignData();
    }
  }, [updateWishlist, folderId]);

  function loadMore() {
    if (pages <= totalPageCount) {
      getDesignData();
    }
  }

  function getDesignData() {
    const params = {
      wishlist_folder_id: folderId,
      thumbnail_id: 4,
      page: pages,
    };
    callAPI('POST', process.env.WISHLIST_DESIGNS, params, (res) => {
      setIsLoading(false);
      if (res.status) {
        const data = res['data'];
        setImagePath(data.image_path);
        setFolderData(data.wishlist_folder);
        setDesignData((prev) => [...prev, ...data.wishlist_designs]);
        setTotalPageCount(res['data'].paginate.last_page);

        setPages((prev) => prev + 1);
      }
    });
  }

  function removeFromWishlist(itemId) {
    setShowRemoveWishlist(true);
    setDesignId(itemId);
  }

  function renderDesigns() {
    return designData.map((item, key) => {
      return (
        <div className="col-lg-3 col-md-6 position-relative" key={key}>
          <div className="shadow fingure-tips-box bg-white favourite-img-box my-3">
            <Link href={`${(item.is_grouped == 1 && '/grouped-design') || '/individual-design'}/${item.slug}`}>
              <a
                className="decoration-none user-favorite-folder d-block cursor-pointer"
                style={{
                  backgroundImage: `url(${imagePath + item.main_image.image})`,
                }}
              ></a>
            </Link>
            <div className="py-3 px-3">
              <div className="d-flex align-items-center justify-content-between">
                <div className="mw-80">
                  <Link href={`${(item.is_grouped == 1 && '/grouped-design') || '/individual-design'}/${item.slug}`}>
                    <a className="decoration-none">
                      <h3 className="m-0 fs-20 fw-600 text-black p-0 cursor-pointer line-clamp-1">
                        {item.root_category.name}
                      </h3>
                    </a>
                  </Link>
                  <p className="label-color-1 fw-500 fs-14 m-0">#{item.code}</p>
                  {/* {item.is_grouped == 1 && (
                    <p className="text-black mb-0 fs-14 mt-2 line-clamp-1">
                      ({item.latest_size.category_size.name}: {item.latest_size.size.name}{' '}
                      {item.latest_size.category_size.unit_type == 1 && 'Feet'})
                    </p>
                  )} */}
                </div>
                <div className="w-100">
                  <span
                    onClick={() => removeFromWishlist(item.id)}
                    className="heart-icon d-flex ms-auto align-items-center
                  justify-content-center cursor-pointer iswishlist"
                  ></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });
  }

  return (
    <>
      {showRemoveWishlist && (
        <RemoveFromWishlist
          designId={designId}
          setShowRemoveWishlist={setShowRemoveWishlist}
          setUpdateWishlist={setUpdateWishlist}
          updateWishlist={updateWishlist}
        />
      )}
      <div className="container list-page pb-4 pt-lg-5 pt-4">
        <div className="row">
          <div className="d-flex mb-3">
            <h1 className="inner-heading m-0">{folderData && folderData.name}</h1>
          </div>
          {!isLoading && designData?.length > 0 && (
            <InfiniteScroll
              pageStart={1}
              loadMore={loadMore}
              hasMore={pages <= totalPageCount}
              className="row"
              loader={
                <div className="text-center label-color-1">
                  <Spinner animation="border" variant="primary" className="text-blue mx-auto" size="md" />
                </div>
              }
              useWindow={false} // Set this to true if the parent container has a fixed height
              getScrollParent={() => timelineRef.current} // Set this to the ref of the container to be scrolled
            >
              {renderDesigns()}
            </InfiniteScroll>
          )}
          {isLoading && <FavouriteDesignsLoader />}
          {!isLoading && designData?.length == 0 && <EmptyWishlist />}
        </div>
      </div>
    </>
  );
}

export default FavouriteDesigns;
