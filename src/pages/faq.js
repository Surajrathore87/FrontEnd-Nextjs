import dynamic from "next/dynamic";
import PropTypes from "prop-types";
import { callPostAPI } from "_services/CallAPI";

const Faq = dynamic(import("components/Faq"));
const MetaData = dynamic(import("components/Common/MetaData"));

export default function faq(props) {
  const { faqPageData, faqMetaData } = props;
  return (
    <>
      <MetaData metaContent={{
        metaTitle: faqMetaData.data.meta_title,
        metaDescription: faqMetaData.data.meta_description,
        metaKeywords: faqMetaData.data.meta_keywords,
      }} />
      <Faq faqPageData={faqPageData} />
    </>
  );
}

export async function getServerSideProps() {
  const response = {
    faqPageData: null,
    faqMetaData: null,
  };

  const params = {
    role_id: 0,
  };

  const paramsMetaData = {
    page_type: 'FAQ',
  };

  response.faqPageData = await callPostAPI(process.env.FAQ_DATA, params);
  response.faqMetaData = await callPostAPI(process.env.CMS_SEO_META_DATA, paramsMetaData);

  return {
    props: response,
  };
}

faq.propTypes = {
  faqPageData: PropTypes.object,
  faqMetaData: PropTypes.object,
};