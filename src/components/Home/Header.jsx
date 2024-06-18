import React, { useEffect, useState } from 'react';
import { Dropdown, Nav, Navbar } from 'react-bootstrap';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '_contexts/auth';

const Login = dynamic(() => import('components/Login/Login'), { ssr: false });
const OtpVerify = dynamic(import('components/Login/OtpVerify'), { ssr: false });
const UserRole = dynamic(import('components/Login/UserRole'));
const ProfileSetup = dynamic(import('components/Login/ProfileSetup'));
const Searchbar = dynamic(import('components/Searchbar'));

function Header() {
  const [scroll, setScroll] = useState(false);
  const [isActive, setActive] = useState(true);
  const [mobileNumber, setMobileNumber] = useState(null);
  const [sendOtp, setSendOtp] = useState(null);
  const [registerData, setRegisterData] = useState(null);
  const [isSearch, setIsSearch] = useState(false);
  const [dealerInfo, setDealerInfo] = useState(null);
  const {
    setIsLoggedIn,
    isLoggedIn,
    isContextLoaded,
    logout,
    checkActivePlan,
    showLogin,
    setShowLogin,
    showOtpModal,
    setShowOtpModal,
    showRoleModal,
    setShowRoleModal,
    showProfileSetup,
    setShowProfileSetup,
    userDetails,
  } = useAuth();
  const router = useRouter();

  useEffect(() => {
    window.addEventListener('scroll', () => {
      setScroll(window.scrollY > 500);
    });
  }, []);

  useEffect(() => {
    window.addEventListener(
      'contextmenu',
      function (e) {
        e.preventDefault();
      },
      false
    );
  }, []);

  function showLoginModal() {
    setShowLogin(true);
    setActive(true);
  }

  const handleToggle = () => {
    setActive(false);
  };
  const handleClose = () => {
    setActive(true);
  };

  function logoutUser() {
    logout();
    setIsLoggedIn(false);
  }

  return (
    <>
      <div
        className={`header-footer-p main-navbar py-md-0 font-inter ${
          (router.pathname == '/' && 'home-header header-bg') || ''
        } ${(scroll && 'position-sticky w-100 header-sticky bg-white') || ''} 
        ${(router.pathname == '/designs/[...item]' && 'd-none') || ''}`}
      >
        <Navbar expand="lg" className={`py-xl-0 py-2`}>
          <Link href="/" title="DsignDpo" className="navbar-brand ">
            <a className="nav-link p-0 me-md-4">
              {scroll ? (
                <img src="/images/main-logo.svg" className="logo-icon" />
              ) : (
                <>
                  <img src="/images/main-logo.svg" height={36} className=" d-none inner-logo-white" />
                  <img src="/images/main-logo.svg" height={36} className="logo-icon inner-logo-blue" />
                </>
              )}
            </a>
          </Link>
          <div className="d-flex align-items-center d-none menu-collapse-box">
            <div className="d-flex align-items-center">
              <img src="/images/search.svg" className="inner-logo-white" onClick={() => setIsSearch(true)} />
              <div className="ms-3">
                <Link href={'/favourites'}>
                  <a className="d-flex align-items-center cursor-pointer position-relative" title="Favourites">
                    {scroll ? (
                      <img src="/images/heart.svg" alt="" title="Favourites" width={18} />
                    ) : (
                      <>
                        <img src="/images/heart.svg" alt="" title="Favourites" width={18} className="inner-logo-blue" />
                        <img src="/images/heart.svg" width={18} className=" d-none inner-logo-white like" />
                      </>
                    )}
                    {(userDetails && userDetails.wishlist_count > 0 && (
                      <span className="count-tag bg-red text-white fs-11 d-flex justify-content-center align-items-center">
                        {userDetails && userDetails.wishlist_count}
                      </span>
                    )) ||
                      ''}
                  </a>
                </Link>
              </div>
              <div className="ms-3">
                <Link href="/my-cart">
                  <a className="d-flex align-items-center cursor-pointer position-relative" title="cart">
                    {scroll ? (
                      <img src="/images/shopping-bag.svg" alt="Cart" title="Cart" width={18} />
                    ) : (
                      <>
                        <img
                          src="/images/shopping-bag.svg"
                          alt="Cart"
                          title="Cart"
                          width={18}
                          className="inner-logo-blue"
                        />
                        <img
                          src="/images/shopping-bag.svg"
                          alt="Cart"
                          title="Cart"
                          width={18}
                          className="d-none inner-logo-white"
                        />
                      </>
                    )}
                    {(userDetails && userDetails.cart_count > 0 && (
                      <span className="count-tag bg-red text-white fs-11 d-flex justify-content-center align-items-center">
                        {userDetails && userDetails.cart_count}
                      </span>
                    )) ||
                      ''}
                  </a>
                </Link>
              </div>
              <div className="menu-collapse-icon ms-4">
                <img src="/images/menu-icon.svg" onClick={handleToggle} />
              </div>
            </div>
          </div>
          <Navbar.Collapse id="basic-navbar-nav" className="main-menu-bar">
            <Nav className={`me-auto`}>
              <Link href="/" title="Home">
                <a className={`mx-1 nav-link text-nowarp nav-items ${(router.asPath == '/' && 'active') || ''}`}>
                  Home
                </a>
              </Link>
              <Link href="/about-us" title="About us">
                <a
                  className={`mx-1 nav-link text-nowarp nav-items ${(router.asPath == '/about-us' && 'active') || ''}`}
                >
                  About Us
                </a>
              </Link>
              <Link href="/home-interior-design" title="Explore">
                <a
                  className={`mx-1 nav-link text-nowarp nav-items ${
                    (router.asPath == '/home-interior-design' && 'active') || ''
                  }`}
                >
                  Explore
                </a>
              </Link>
              <a
                className={`mx-1 nav-link text-nowarp nav-items cursor-pointer`}
                target="blank"
                href="https://www.dsigndpo.com/blog/"
                title="Blog"
              >
                Blog
              </a>
              <Link href="/contact-us" title="Contact us">
                <a
                  className={`mx-1 nav-link text-nowarp nav-items ${
                    (router.asPath == '/contact-us' && 'active') || ''
                  }`}
                >
                  Contact Us
                </a>
              </Link>
            </Nav>
            <Nav className="ms-auto d-flex align-items-center">
              <div className="d-flex align-items-center">
                <div onClick={() => setIsSearch(true)} className="cursor-pointer">
                  {(scroll && <img src="/images/search-blue-icon.svg" alt="Search" title="Search" />) || (
                    <>
                      <img src="/images/search-blue-icon.svg" alt="Search" title="Search" className="inner-logo-blue" />
                      <img src="/images/search.svg" className=" d-none inner-logo-white" />
                    </>
                  )}
                </div>
                <div className="ms-4">
                  <Link href="/favourites">
                    <a className="d-flex align-items-center cursor-pointer position-relative" title="Favourites">
                      {(scroll && <img src="/images/favorite-blue-icon.svg" alt="" title="Favourites" />) || (
                        <>
                          <img
                            src="/images/favorite-blue-icon.svg"
                            alt=""
                            title="Favourites"
                            className="inner-logo-blue"
                          />
                          <img src="/images/heart.svg" className=" d-none inner-logo-white" />
                        </>
                      )}
                      {userDetails && userDetails.wishlist_count > 0 && (
                        <span className="count-tag bg-red text-white fs-12 d-flex justify-content-center align-items-center">
                          {userDetails && userDetails.wishlist_count}
                        </span>
                      )}
                    </a>
                  </Link>
                </div>
                <div className="ms-4">
                  <Link href="/my-cart">
                    <a className="d-flex align-items-center cursor-pointer position-relative" title="Cart">
                      {(scroll && <img src="/images/cart-blue-icon.svg" alt="Cart" title="Cart" />) || (
                        <>
                          <img src="/images/cart-blue-icon.svg" alt="Cart" title="Cart" className="inner-logo-blue" />
                          <img
                            src="/images/shopping-bag.svg"
                            alt="Cart"
                            title="Cart"
                            className="d-none inner-logo-white"
                          />
                        </>
                      )}
                      {userDetails && userDetails.cart_count > 0 && (
                        <span className="count-tag bg-red text-white fs-12 d-flex justify-content-center align-items-center">
                          {userDetails && userDetails.cart_count}
                        </span>
                      )}
                    </a>
                  </Link>
                </div>
              </div>
              {(isContextLoaded && checkActivePlan == 0 && (
                <Link href="/plans">
                  <a
                    title="Upgrade to Premium"
                    className="d-flex align-items-center fw-600 pe-1 py-1 ps-4 decoration-none upgrade-pro"
                  >
                    <img src="/images/header-crown.svg" width={16} height={16} className="me-2" />
                    <span className="fw-500">Upgrade Pro</span>
                  </a>
                </Link>
              )) ||
                (userDetails && (
                  <div className="label-color-2 fs-16 fw-600 ps-4 d-flex align-items-center" title="Credits">
                    <img src="/images/credit-icon.png" className="img-fluid me-1" width={30} />
                    <span>{userDetails.wallet_credits}</span>
                  </div>
                ))}
              <div className="nav-link user-icon py-1 ps-3">
                {isContextLoaded && !isLoggedIn && (
                  <button
                    className="rounded-6 signin-btn shadow-none fs-15 fw-600"
                    title="Sign In"
                    onClick={showLoginModal}
                  >
                    Sign In
                  </button>
                )}
                {isLoggedIn && (
                  <Dropdown>
                    <Dropdown.Toggle id="dropdown-basic">
                      <div className="user-logo d-flex align-items-center justify-content-center">
                        <img src="/images/user.svg" />
                      </div>
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="py-3">
                      <div
                        className="d-flex align-items-center ps-4 pb-3
                    "
                      >
                        <div className="pe-3">
                          <img
                            width={65}
                            height={65}
                            src={
                              (userDetails &&
                                userDetails.profile_image &&
                                userDetails.image_path + userDetails.profile_image) ||
                              '/images/upload-avtar.svg'
                            }
                            className="header-user-image rounded-circle"
                          />
                        </div>
                        <div>
                          <h3 className="line-clamp-1 p-0 mb-1">{userDetails && userDetails.name}</h3>
                          <p className="p-0 m-0">{userDetails && userDetails.role_name}</p>
                        </div>
                      </div>
                      <hr className="p-0 m-0 my-1" />
                      {(userDetails && userDetails.carpenter_points && (
                        <>
                          <Dropdown.Item className="p-0 w-100">
                            <Link href={'/withdrawal'}>
                              <a
                                className="px-4 d-flex w-100 py-1
                                align-items-center justify-content-between fs-15 decoration-none label-color-2"
                              >
                                <span>Available Points:</span>
                                <div>
                                  <img src="/images/dd-icon.png" width={24} className="img-fluid mb-1 me-1" />
                                  <span>{userDetails.carpenter_points}</span>
                                </div>
                              </a>
                            </Link>
                          </Dropdown.Item>
                          <hr className="p-0 m-0 my-1" />
                        </>
                      )) ||
                        ''}
                      <Dropdown.Item className="p-0">
                        <Link href="/my-profile">
                          <a className="ps-4 dropdown-item">
                            <img className="me-2" src="/images/edit.svg" /> Edit Profile
                          </a>
                        </Link>
                      </Dropdown.Item>
                      <Dropdown.Item className="p-0">
                        <Link href="/plans">
                          <a className="ps-4 dropdown-item">
                            <img className="me-2" src="/images/crown.svg" /> <span className="ms-1">Go Pro</span>
                          </a>
                        </Link>
                      </Dropdown.Item>
                      <Dropdown.Item className="p-0">
                        <Link href="/referral">
                          <a className="ps-4 dropdown-item">
                            <img className="me-2" src="/images/refer-a-friend.svg" width={20} />{' '}
                            <span className="ms-1">Refer a Friend</span>
                          </a>
                        </Link>
                      </Dropdown.Item>
                      {(userDetails && userDetails.role_name == 'Carpenter' && (
                        <Dropdown.Item className="p-0">
                          <Link href="/withdrawal">
                            <a className="ps-4 dropdown-item">
                              <img className="me-2" src="/images/rupee-icon.svg" />
                              <span>Withdrawal</span>
                            </a>
                          </Link>
                        </Dropdown.Item>
                      )) ||
                        ''}
                      <hr className="p-0 m-0 my-1" />
                      {isLoggedIn && userDetails && userDetails.role_name != 'Interior Designer' && (
                        <Dropdown.Item className="p-0">
                          <Link href="/chat">
                            <a className="ps-4 dropdown-item">
                              <img className="me-2" src="/images/chat-icon.svg" /> Chat
                            </a>
                          </Link>
                        </Dropdown.Item>
                      )}
                      <Dropdown.Item className="p-0">
                        <Link href="/favourites">
                          <a className="ps-4 dropdown-item">
                            <img className="me-2" src="/images/heart-profile.svg" /> My Favourites
                          </a>
                        </Link>
                      </Dropdown.Item>
                      <Dropdown.Item className="p-0">
                        <Link href="/my-orders">
                          <a className="ps-4 dropdown-item">
                            <img className="me-2" src="/images/file-input.svg" /> My Orders
                          </a>
                        </Link>
                      </Dropdown.Item>
                      <hr className="p-0 m-0 my-1" />
                      <Dropdown.Item className="p-0">
                        <a className="ps-4 dropdown-item cursor-pointer" onClick={logoutUser}>
                          <img className="me-2" src="/images/log-out.svg" /> Sign Out
                        </a>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
              </div>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
      <div
        className={isActive ? '' : 'overlay-stock-bg w-100 h-100 d-lg-none position-fixed start-0 top-0'}
        onClick={handleClose}
      >
        <img
          src="/images/close-icon-mobile.png"
          alt=""
          className={isActive ? 'd-none' : `ms-auto position-absolute mt-1 me-1 d-block cross-icon`}
          onClick={handleClose}
          width={25}
          height={25}
        />
      </div>
      <div
        className={`bg-white mobile-menu shadow position-fixed top-0 end-100 overflow-hidden  ${
          isActive ? '' : 'navbar-collapse'
        }`}
      >
        {isContextLoaded && !isLoggedIn && (
          <div>
            <div className="py-3 px-2 d-flex align-items-center ">
              <img
                src="/images/main-logo.svg"
                width={160}
                height="30"
                onClick={handleClose}
                className="me-auto logo-icon"
              />
            </div>
            <hr className="m-0" />
          </div>
        )}
        <div className="h-100 position-relative">
          {isContextLoaded && isLoggedIn && (
            <div className="edit-profile-mobile d-flex align-items-center px-4">
              <div className="d-flex align-items-center">
                <div className="pe-3">
                  <img
                    width={60}
                    height={60}
                    src={
                      (userDetails &&
                        userDetails.profile_image &&
                        userDetails.image_path + userDetails.profile_image) ||
                      '/images/upload-avtar.svg'
                    }
                    className="header-user-image rounded-circle"
                  />
                </div>
                <div>
                  <h3 className="text-white fs-18 mb-1 line-clamp-1">
                    {(userDetails && userDetails.name) || (userDetails && userDetails.mobile_number)}
                  </h3>
                  <Link href={'/my-profile'}>
                    <a className="fs-13 fw-600 text-red decoration-none cursor-pointer" onClick={handleClose}>
                      Edit Profile
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          )}
          <nav className="p-0 m-0 h-100" type="none">
            {/* <div className="d-flex align-items-center py-3 signin-prime">
              <div className="mobile-search-box px-2 d-flex align-items-center py-1">
                <img src="/images/search-icon.svg" width={18} height={18} className="me-2 " />
                <input type="text" className="border-0" placeholder="Search" />
              </div>
            </div>
            <hr className="m-0" /> */}
            {(userDetails && userDetails.carpenter_points && (
              <>
                <Link href={'/withdrawal'}>
                  <a
                    className="px-4 d-flex align-items-center label-color-2 decoration-none justify-content-between fs-15 pt-2 fw-500"
                    onClick={handleClose}
                  >
                    <span>Available Points:</span>
                    <div>
                      <img src="/images/dd-icon.png" width={24} className="img-fluid mb-1 me-1" />
                      <span>{userDetails.carpenter_points}</span>
                    </div>
                  </a>
                </Link>
                <hr className="p-0 m-0 my-1" />
              </>
            )) ||
              ''}
            <ul className="p-0 pt-3 m-0 mobile-menu-ul" type="none">
              <li className="mb-3 fs-14 fw-500" onClick={handleClose}>
                <Link href={'/plans'}>
                  <a onClick={handleClose} className="text-blue">
                    <img src="/images/crown-icon.svg" className="me-3 mb-1" width={22} />
                    <span>Upgrade to Pro</span>
                  </a>
                </Link>
              </li>
              <li className="fs-14 fw-500 label-color-1 ">Links</li>
              <li className=" fs-14 fw-500" onClick={handleClose}>
                <Link href="/" title="Home">
                  <a>
                    <img src="/images/home-icon-mobile.svg" className="me-2 mb-1" width={18} />
                    Home
                  </a>
                </Link>
              </li>

              <li className=" fs-14 fw-500" onClick={handleClose}>
                <Link href="/home-interior-design" title="Explore">
                  <a>
                    <img src="/images/explore-design.svg" className="me-2 mb-1" width={18} />
                    Explore
                  </a>
                </Link>
              </li>
              <li className=" fs-14 fw-500" onClick={handleClose}>
                <Link href="/categories" title="Category">
                  <a>
                    <img src="/images/category.svg" className="me-2 mb-1" width={18} />
                    Category
                  </a>
                </Link>
              </li>
              {isLoggedIn && (
                <li className=" fs-14 fw-500" onClick={handleClose}>
                  <Link href="/referral" title="Referral">
                    <a>
                      <img src="/images/refer-a-friend.svg" className="me-2 mb-1" width={18} />
                      Referral
                    </a>
                  </Link>
                </li>
              )}
              {isLoggedIn && userDetails && userDetails.role_name == 'Carpenter' && (
                <li className=" fs-14 fw-500" onClick={handleClose}>
                  <Link href="/withdrawal" title="Withdrawal">
                    <a>
                      <img src="/images/rupee-icon.svg" className="me-2 mb-1" width={18} />
                      Withdrawal
                    </a>
                  </Link>
                </li>
              )}
              {isLoggedIn && userDetails && userDetails?.role_name != 'Interior Designer' && (
                <li className=" fs-14 fw-500" onClick={handleClose}>
                  <Link href="/chat" title="Chat">
                    <a>
                      <img src="/images/chat-icon.svg" className="me-2 mb-1" width={18} />
                      Chat
                    </a>
                  </Link>
                </li>
              )}
              {isContextLoaded && isLoggedIn && (
                <li className=" fs-14 fw-500" onClick={handleClose}>
                  <Link href="/my-orders" title="My Orders">
                    <a>
                      <img src="/images/file-input.svg" className="me-2 mb-1" width={18} />
                      My Orders
                    </a>
                  </Link>
                </li>
              )}
              <li className=" fs-14 fw-500" onClick={handleClose}>
                <Link href="/about-us" title="About us">
                  <a>
                    <img src="/images/info.svg" className="me-2 mb-1" width={18} />
                    About us
                  </a>
                </Link>
              </li>
              {/* <li className=" fs-14 fw-500" onClick={handleClose}>
                <Link href="/help-center" title="Help Center">
                  <a>
                    <img src="/images/help-circle.svg" className="me-2 mb-1" width={18} />
                    Help Center
                  </a>
                </Link>
              </li> */}
              <li className=" fs-14 fw-500" onClick={handleClose}>
                <Link href="/faq" title="FAQ's">
                  <a>
                    <img src="/images/faq.svg" className="me-2 mb-1" width={18} />
                    FAQ's
                  </a>
                </Link>
              </li>
              <li className=" fs-14 fw-500" onClick={handleClose}>
                <Link href="/contact-us" title="Contact us">
                  <a>
                    <img src="/images/contact.svg" className="me-2 mb-1" width={18} />
                    Contact us
                  </a>
                </Link>
              </li>
              {isContextLoaded && isLoggedIn && (
                <li onClick={handleClose}>
                  <a className="fs-14 fw-500" onClick={logoutUser}>
                    <img src="/images/log-out.svg" className="me-2 mb-1" width={18} /> Sign Out
                  </a>
                </li>
              )}
            </ul>
          </nav>
          {!isLoggedIn && (
            <div className="pt-2 w-100 px-3 mobile-signin position-absolute text-center">
              <button className="blue-btn px-5 py-2" onClick={showLoginModal}>
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>
      {showLogin && (
        <Login
          setShowLogin={setShowLogin}
          setShowOtpModal={setShowOtpModal}
          setMobileNumber={setMobileNumber}
          setSendOtp={setSendOtp}
          mobileNumber={mobileNumber}
          setShowRoleModal={setShowRoleModal}
          setShowProfileSetup={setShowProfileSetup}
        />
      )}
      {showOtpModal && (
        <OtpVerify
          setShowOtpModal={setShowOtpModal}
          mobileNumber={mobileNumber}
          setMobileNumber={setMobileNumber}
          sendOtp={sendOtp}
          setSendOtp={setSendOtp}
          setShowRoleModal={setShowRoleModal}
          setRegisterData={setRegisterData}
          registerData={registerData}
          setShowProfileSetup={setShowProfileSetup}
        />
      )}
      {showRoleModal && (
        <UserRole
          setShowRoleModal={setShowRoleModal}
          setRegisterData={setRegisterData}
          setShowProfileSetup={setShowProfileSetup}
          registerData={registerData}
          setMobileNumber={setMobileNumber}
        />
      )}
      {showProfileSetup && (
        <ProfileSetup
          setShowProfileSetup={setShowProfileSetup}
          registerData={registerData}
          setDealerInfo={setDealerInfo}
          setMobileNumber={setMobileNumber}
        />
      )}
      {isSearch && <Searchbar setIsSearch={setIsSearch} />}
    </>
  );
}
export default Header;
