import { AuthProvider } from "_contexts/auth";
import "../../styles/globals.css";
import "../../styles/scss/_app.scss";
import 'react-toastify/dist/ReactToastify.css';
import 'react-loading-skeleton/dist/skeleton.css'
import dynamic from "next/dynamic";
import Head from "next/head";
import PropTypes from 'prop-types';
import { useRouter } from "next/router";

const Layout = dynamic(import("components/Layout/Layout"));
function MyApp({ Component, pageProps }) {
  const router = useRouter();
  return <>
    <AuthProvider>
      {router.pathname == '/payment-response-status' &&
        <Component {...pageProps} />
        ||
        < Layout >
          <Component {...pageProps} />
        </Layout>
      }
    </AuthProvider >
  </>
}

export default MyApp;

MyApp.propTypes = {
  Component: PropTypes.any,
  pageProps: PropTypes.any,
};