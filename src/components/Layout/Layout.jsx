import React from 'react';
import dynamic from 'next/dynamic';
import { ToastContainer } from 'react-toastify';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';

const Header = dynamic(import('components/Home/Header'));
const Footer = dynamic(import('components/Home/Footer'));

function Layout(props) {
  const router = useRouter();
  const { children } = props;
  return (
    <>
      <ToastContainer />
      <Header />
      {children}
      {router.pathname != '/chat/[...chat]' && router.pathname != '/chat' && <Footer />}
    </>
  );
}

export default Layout;
Layout.propTypes = {
  children: PropTypes.object,
};
