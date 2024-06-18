import dynamic from "next/dynamic";
import PropTypes from "prop-types";
import { callPostAPI } from "_services/CallAPI";

const MyCart = dynamic(import("components/MyCart"));
const MetaData = dynamic(import("components/Common/MetaData"));

export default function cartPage(props) {
  const { cartMetaData } = props;
  return (
    <>
      <MetaData metaContent={{
        metaTitle: cartMetaData.data.meta_title,
        metaDescription: cartMetaData.data.meta_description,
        metaKeywords: cartMetaData.data.meta_keywords,
      }} />
      <MyCart />
    </>
  );
}

export async function getServerSideProps() {
  const response = {
    cartMetaData: null,
  };

  const paramsMetaData = {
    page_type: 'CART',
  };

  response.cartMetaData = await callPostAPI(process.env.CMS_SEO_META_DATA, paramsMetaData);

  return {
    props: response,
  };
}

cartPage.propTypes = {
  cartMetaData: PropTypes.object,
};