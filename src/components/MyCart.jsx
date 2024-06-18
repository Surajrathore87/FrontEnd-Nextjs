import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '_contexts/auth';
import { callAPI } from '_services/CallAPI';
import RemoveCartModal from './Modal/RemoveCartModal';
import WishlistFolders from './Modal/WishlistFolders';

const MyCartLoader = dynamic(import('components/Loaders/MyCartLoader'));
const BuyPlanModal = dynamic(import('components/Modal/BuyPlanModal'));
const SuccessPlan = dynamic(import('components/Modal/SuccessPlan'));

function MyCart() {
  const [cartData, setCartData] = useState(null);
  const [individualCartData, setIndividualCartData] = useState(null);
  const [groupedCartData, setGroupedCartData] = useState(null);
  const [cartImagePath, setCartImagePath] = useState(null);
  const [cartTotalPrice, setCartTotalPrice] = useState(0);
  const [priceDiscount, setPriceDiscount] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showBuyPlan, setShowBuyPlan] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [purchaseOrderId, setPurchaseOrderId] = useState(null);
  const [removeDesign, setRemoveDesign] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [cartItemId, setCartItemId] = useState(null);
  const [isCartItem, setIsCartItem] = useState(false);
  const [isFavorite, setIsFavorite] = useState(null);
  const [updateWishlist, setUpdateWishlist] = useState(false);
  const { isLoggedIn, isContextLoaded, getUserDetails, userDetails } = useAuth();
  const router = useRouter();
  const walletCredits = userDetails && userDetails.wallet_credits;

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
    if (isLoggedIn) {
      getCartData();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      cartTotal();
    }
  }, [isLoggedIn, groupedCartData, individualCartData]);

  function getCartData() {
    callAPI('POST', process.env.CART_DATA, {}, (res) => {
      setIsLoading(false);
      if (res.status) {
        const data = res['data'];
        setCartData(data);
        setIndividualCartData(data.individual_cart_data);
        setGroupedCartData(data.grouped_cart_data);
        setCartImagePath(data.image_path);
        setPriceDiscount(data.design_dpo_discount);
      } else {
        setCartData(null);
      }
    });
  }

  function renderGroupedCart() {
    return groupedCartData.map((item, key) => (
      <div key={key} className="mb-3 mb-lg-4">
        <h5 className="fs-20 fw-700 heading-fonts mb-3">{item.group_design.root_category.name}</h5>
        <div className="cart-box main-border rounded-6 mb-3">
          <div className="d-lg-flex p-3 p-lg-4 align-items-center cart-item position-relative">
            <Link href={`/grouped-design/${item.group_design.slug}`}>
              <a className="decoration-none cursor-pointer d-flex align-items-center">
                <img
                  src={item.group_design.main_image && cartImagePath + item.group_design.main_image.image}
                  className="me-3 mb-2 mb-lg-0 img-fluid cart-preview-img"
                />
                <div className="mb-2 mb-lg-0 text-nowrap">
                  <h6 className="fs-18 fw-600 text-black mb-lg-2 mb-0">Main Image</h6>
                  <span className="label-color-1 fs-14 fw-500">{item.group_design.code}</span>
                </div>
              </a>
            </Link>
            <div className="d-flex align-items-center w-100">
              <p className="m-0 label-color-1 fs-15 fw-500 ms-lg-auto">
                Total design: {item.group_design.groups.length}
              </p>
              <h4 className="fs-20 fw-700 text-black mb-0 ms-auto me-4 d-flex align-items-center">
                {/* {(item.price > 0 && '₹') || ''}
                {(item.price == 0 && 'Free') || item.price} */}
                <img src="/images/credit-icon.png" className="img-fluid me-1" width={30} />
                <span> {item.group_design.price}</span>
              </h4>
              <img
                src="images/close-card.svg"
                onClick={() => removeCartItem(item.group_design_id, item.group_design.is_wishlist)}
                className="cursor-pointer remove-cart-icon"
                alt="Remove"
                title="Remove"
              />
            </div>
          </div>
          <div className="p-3 p-lg-4">
            <div className="row">
              {item.group_design.groups.map((groupItem, key) => (
                <div className="col-lg-3 col-6 mb-3" key={key}>
                  <div className="position-relative">
                    {/* <img
                      src="images/close-card.svg"
                      alt="image"
                      width={20}
                      title="Remove"
                      onClick={(itemId) => removeFromCart((itemId = groupItem.design.id))}
                      className="position-absolute cursor-pointer remove-item-icon"
                    /> */}
                    <Link href={`/individual-design/${groupItem.design.slug}`}>
                      <a className="cursor-pointer decoration-none d-block">
                        <img
                          src={cartImagePath + groupItem.design.main_image.image}
                          alt="image"
                          className="img-fluid mb-3 cart-item-image"
                        />
                        <div className="d-flex align-items-center justify-content-between">
                          <div>
                            <h6 className="fs-15 fw-600 text-black mb-1">{groupItem.design.root_category.name}</h6>
                            <span className="label-color-1 fs-13 fw-500">{groupItem.design.code}</span>
                          </div>
                          <h5 className="m-0 fs-16 fw-700 text-black d-flex align-items-center">
                            <img src="/images/credit-icon.png" className="img-fluid me-1" width={20} />
                            <span>{groupItem.design.price}</span>
                            {/* {(groupItem.design.price > 0 && '₹') || ''}
                            {(groupItem.design.price == 0 && 'Free') || groupItem.design.price} */}
                          </h5>
                        </div>
                      </a>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ));
  }

  function renderIndivisualCart() {
    return individualCartData.map((item, key) => (
      <div className="d-flex p-3 p-lg-4 align-items-center cart-item" key={key}>
        <Link href={`/individual-design/${item.slug}`}>
          <a className="decoration-none cursor-pointer d-flex align-items-center">
            <img src={cartImagePath + item.main_image.image} className="me-3 img-fluid cart-preview-img" />
            <div>
              <h6 className="fs-18 fw-600 text-black">{item.root_category.name}</h6>
              <span className="label-color-1 fs-14 fw-500">{item.code}</span>
            </div>
          </a>
        </Link>
        <h4 className="fs-20 fw-700 text-black mb-0 ms-auto me-4 d-flex align-items-center">
          {/* {(item.price > 0 && '₹') || ''}
          {(item.price == 0 && 'Free') || item.price} */}
          <img src="/images/credit-icon.png" className="img-fluid me-1" width={30} />
          <span> {item.price}</span>
        </h4>
        <img
          src="images/close-card.svg"
          onClick={() => removeCartItem(item.id, item.is_wishlist)}
          className="cursor-pointer"
          alt="Remove"
          title="Remove"
        />
      </div>
    ));
  }

  function removeFromCart(itemId) {
    const params = {
      design_id: itemId,
    };
    callAPI('POST', process.env.REMOVE_FROM_CART, params, (res) => {
      if (res.status) {
        toast.success(res['message'], toastConfig);
        getCartData();
        getUserDetails();
      } else {
        toast.error(res['message'], toastConfig);
      }
    });
  }

  function emptyCart() {
    return (
      <div className="pb-4 mb-4 d-flex align-items-center w-100 justify-content-center">
        <div className="text-center">
          <img src="/images/page-not-found.svg" alt="Empty Cart" className="img-fluid" width={450} />
          <h4 className="text-black fw-700 heading-fonts">Your Cart is Empty</h4>
          <Link href={'/home-interior-design'}>
            <a className="fs-16 fw-400 blue-btn mt-4 w-75 mx-auto btn" title="Continue Searching">
              Continue Searching
            </a>
          </Link>
        </div>
      </div>
    );
  }

  function cartTotal() {
    let indvPrice = 0;
    let grpPrice = 0;
    if (groupedCartData?.length > 0) {
      grpPrice = groupedCartData.map((grp) => grp.group_design.price).reduce((acc, grp) => grp + acc);
    }
    if (individualCartData?.length > 0) {
      indvPrice = individualCartData.map((grp) => grp.price).reduce((acc, grp) => grp + acc);
    }
    setCartTotalPrice(grpPrice + indvPrice);
  }

  function orderCheckout() {
    callAPI('POST', process.env.BUY_DESIGNS, {}, (res) => {
      if (res.status) {
        const data = res['data'];
        getCartData();
        getUserDetails();
        toast.success(res['message'], toastConfig);
        setShowSuccess(true);
        setPurchaseOrderId(data.data.order_id);
      } else {
        setErrorMessage(res['message']);
        setShowBuyPlan(true);
      }
    });
  }

  function removeCartItem(cartId, isDesignFavorite) {
    setRemoveDesign(true);
    setCartItemId(cartId);
    setIsFavorite(isDesignFavorite);
  }

  return (
    <>
      {removeDesign && (
        <RemoveCartModal
          setRemoveDesign={setRemoveDesign}
          setShowFolderModal={setShowFolderModal}
          cartItemId={cartItemId}
          removeFromCart={removeFromCart}
          setIsCartItem={setIsCartItem}
          isFavorite={isFavorite}
        />
      )}
      {showFolderModal && (
        <WishlistFolders
          setShowFolderModal={setShowFolderModal}
          wishlistId={cartItemId}
          removeFromCart={removeFromCart}
          isCartItem={isCartItem}
          setUpdateWishlist={setUpdateWishlist}
          updateWishlist={setUpdateWishlist}
        />
      )}
      {showSuccess && <SuccessPlan setShowSuccess={setShowSuccess} purchaseOrderId={purchaseOrderId} />}
      {showBuyPlan && <BuyPlanModal setShowBuyPlan={setShowBuyPlan} errorMessage={errorMessage} />}
      {isLoggedIn && (
        <section className="my-cart-section">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="py-lg-4 py-3">
                  <h1 className="fs-30 fw-700 text-black m-0 heading-fonts">My Cart</h1>
                </div>
                {!isLoading && cartData && (
                  <div className="row">
                    <div className="col-lg-8">
                      {(groupedCartData?.length > 0 && <div className="mb-lg-5 mb-4">{renderGroupedCart()}</div>) || ''}
                      {(individualCartData?.length > 0 && (
                        <div className="mb-lg-5 mb-4 indv-carts">
                          <h5 className="fs-20 fw-700 heading-fonts mb-3">Separate Designs</h5>
                          <div className="cart-box main-border rounded-6 mb-3">{renderIndivisualCart()}</div>
                        </div>
                      )) ||
                        ''}
                    </div>
                    <div className="col-lg-4 mb-4">
                      <div className="order-summary">
                        <h5 className="fs-20 fw-700 heading-fonts mb-3">Order Summary</h5>
                        <div className="summary-box main-border rounded-6">
                          <div className="order-detail px-4">
                            <h6 className="d-flex justify-content-between fw-500 mb-3 py-1 px-2 fs-16 text-black">
                              <span>Total Design</span>
                              <span>{groupedCartData.length + individualCartData.length}</span>
                            </h6>
                            <h6 className="d-flex justify-content-between fw-500 mb-3 py-1 px-2 fs-16 text-black">
                              <span>Subtotal</span>
                              <span>
                                <img src="/images/credit-icon.png" className="img-fluid me-1 mb-1" width={20} />
                                {cartTotalPrice && cartTotalPrice}
                              </span>
                            </h6>
                            {/* <h6 className="d-flex justify-content-between fw-500 mb-3 py-1 px-2 fs-16 text-black">
                              <span>Discount ({priceDiscount}%)</span>
                              <span>₹{cartTotalPrice && (cartTotalPrice * priceDiscount) / 100}</span>
                            </h6> */}
                            <div className="order-total pt-4 pb-2 px-2">
                              <h6 className="d-flex justify-content-between fw-700 m-0 fs-20 text-black">
                                <span>Total</span>
                                <span>
                                  {/* {(cartTotalPrice > 0 && '₹') || ''} */}
                                  {/* {(cartTotalPrice &&
                                    cartTotalPrice > 0 &&
                                    (cartTotalPrice * (100 - priceDiscount)) / 100) ||
                                    'Free'} */}
                                  <img src="/images/credit-icon.png" className="img-fluid me-1 mb-1" width={25} />
                                  {cartTotalPrice && cartTotalPrice}
                                </span>
                              </h6>
                            </div>
                          </div>
                          <div className="px-4 order-buttons">
                            <button
                              className="shadow-none outline-none text-white checkout-btn bg-blue w-100 fs-16 rounded-6 fw-700"
                              title="Proceed to checkout"
                              onClick={orderCheckout}
                            >
                              {(cartTotalPrice && cartTotalPrice != 0 && 'Proceed to Checkout') || 'Add to My Orders'}
                            </button>
                            <Link href={'/home-interior-design'}>
                              <a
                                className="btn outline-none py-3 label-color-1 continue-shop-btn bg-white w-100 fs-16 rounded-6 fw-700"
                                title="Continue Searching"
                              >
                                <img src="images/angle-left.svg" className="me-3" />
                                Continue Searching
                              </a>
                            </Link>
                            {/* <p className="m-0 fs-13 fw-500 text-center text-black">
                              All design item prices are inclusive of 18% GST.
                            </p> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {isLoading && <MyCartLoader />}
                {!isLoading && !cartData && emptyCart()}
              </div>
            </div>
          </div>
        </section>
      )}
      {isContextLoaded && !isLoggedIn && emptyCart()}
    </>
  );
}

export default MyCart;
