import dynamic from "next/dynamic";
import PropTypes from "prop-types";
import { callPostAPI } from "_services/CallAPI";

const TermAndConditons = dynamic(import("components/TermAndConditons"));
const MetaData = dynamic(import("components/Common/MetaData"));

export default function termAndConditons(props) {
  const { termsPageData, termsMetaContent } = props;
  return (
    <>
      <MetaData metaContent={{
        metaTitle: termsMetaContent.data.meta_title,
        metaDescription: termsMetaContent.data.meta_description,
        metaKeywords: termsMetaContent.data.meta_keywords,
      }} />
      <TermAndConditons termsPageData={termsPageData} />
    </>
  );
}

export async function getServerSideProps() {
  const response = {
    termsPageData: null,
    termsMetaContent: null,
  };

  const params = {
    slug: 'terms-and-conditions',
  };

  response.termsPageData = await callPostAPI(process.env.CMS_DATA, params);
  response.termsMetaContent = await callPostAPI(process.env.CMS_META_DATA, params);

  return {
    props: response,
  };
}

termAndConditons.propTypes = {
  termsPageData: PropTypes.object,
  termsMetaContent: PropTypes.object
};