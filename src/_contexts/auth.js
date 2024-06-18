import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { callAPI } from '_services/CallAPI';
import { toast } from 'react-toastify';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isContextLoaded, setIsContextLoaded] = useState(false);
  const [showLogin, setShowLogin] = useState();
  const [showOtpModal, setShowOtpModal] = useState();
  const [showRoleModal, setShowRoleModal] = useState();
  const [showProfileSetup, setShowProfileSetup] = useState();
  const [userDetails, setUserDetails] = useState(null);
  const [usersList, setUsersList] = useState(null);
  const [checkActivePlan, setCheckActivePlan] = useState(0);
  const [refCode, setRefCode] = useState('');
  const router = useRouter();
  const refCodeUrl = router.asPath.replace('/?refCode=', '');
  const refCodes = router.asPath;

  useEffect(() => {
    if (refCodeUrl != refCodes && isLoggedIn) {
      getReferralCode();
    }
  }, [refCodeUrl, isLoggedIn])

  function getReferralCode() {
    const params = {
      referral_code: refCodeUrl.replace('/?refCode=', ''),
    };
    callAPI('POST', process.env.CREATE_CHAT_CONNECTION, params, (res) => {
      if (res.status) {
        router.push('/chat');
      }
    });
  }




  useEffect(() => {
    const token = Cookies.get("access_token");
    if (token) {
      setIsLoggedIn(true);
      setIsContextLoaded(true);
    } else {
      setIsLoggedIn(false);
      setIsContextLoaded(true);
    }
  }, [])


  function beforeLogin() {
    if (window.location.pathname === '/my-profile') {
      window.location.pathname = '/';
    } else if (window.location.pathname === '/my-orders') {
      window.location.pathname = '/';
    } else if (window.location.pathname === '/chat') {
      window.location.pathname = '/';
    } else if (window.location.pathname === '/referral') {
      window.location.pathname = '/';
    } else if (window.location.pathname === '/withdrawal') {
      window.location.pathname = '/';
    } else if (router.pathname == '/my-orders/[...orderId]') {
      window.location.pathname = '/';
    } else if (router.pathname === '/chat/[...chat]') {
      window.location.pathname = '/';
    }
  }

  const logout = () => {
    Cookies.remove('access_token');
    setCurrentUser(null);
    setUserDetails(null);
    beforeLogin();
  };

  useEffect(() => {
    if (isLoggedIn) {
      getUserDetails();
    }
  }, [isLoggedIn]);


  useEffect(() => {
    if (isContextLoaded && !isLoggedIn) {
      beforeLogin();
    }
  }, [isContextLoaded, isLoggedIn]);

  function getUserDetails() {
    callAPI('POST', process.env.USER_DETAILS_DATA, {}, (res) => {
      if (res.status) {
        const data = res['data'];
        setUserDetails(data);
        setCheckActivePlan(data.check_active_plan);
      } else {
        logout();
      }
    });
  }

  return (
    <>
      <AuthContext.Provider value={{
        isContextLoaded, logout, isLoggedIn, setIsLoggedIn, setCurrentUser, currentUser, showLogin,
        setShowLogin, showOtpModal, setShowOtpModal, showRoleModal, setShowRoleModal, showProfileSetup,
        setShowProfileSetup, userDetails, setUserDetails, checkActivePlan, setCheckActivePlan, getUserDetails,
        usersList, setUsersList, refCode
      }}>
        {children}
      </AuthContext.Provider>
    </>
  );
};


AuthProvider.propTypes = {
  children: PropTypes.any,
};

export const useAuth = () => useContext(AuthContext);

export const ProtectRoute = ({ children }) => {
  const { isAuthenticated, isContextLoaded } = useAuth();
  const router = useRouter();
  if (isContextLoaded || (!isAuthenticated && router.pathname === '/my-profile')) {
    return <></>;
  }
  return children;
};
