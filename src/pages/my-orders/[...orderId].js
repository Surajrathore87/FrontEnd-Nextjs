import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { decrypt } from "_helper/encryptDecrypt";
import PropTypes from "prop-types";
import { callPostAPI } from "_services/CallAPI";

const OrderDetails = dynamic(import("components/OrderDetails"));
const MetaData = dynamic(import("components/Common/MetaData"));

export default function orderDetailsPage(props) {
  const { ordersMetaData } = props;
  const router = useRouter();
  const { orderId } = router.query;
  const id = orderId?.[0] && decrypt(orderId?.[0].replace(/dpo/g, '/')) || '';
  return (
    <>
      <MetaData metaContent={{
        metaTitle: ordersMetaData.data.meta_title,
        metaDescription: ordersMetaData.data.meta_description,
        metaKeywords: ordersMetaData.data.meta_keywords,
      }} />
      <OrderDetails orderId={id} />
    </>
  );
}

export async function getServerSideProps() {
  const response = {
    planPageData: null,
    ordersMetaData: null,
  };
  const paramsMetaData = {
    page_type: 'ORDER',
  };

  response.planPageData = await callPostAPI(process.env.PLANS_LIST, {});
  response.ordersMetaData = await callPostAPI(process.env.CMS_SEO_META_DATA, paramsMetaData);

  return {
    props: response,
  };
}

orderDetailsPage.propTypes = {
  planPageData: PropTypes.object,
  ordersMetaData: PropTypes.object,
};