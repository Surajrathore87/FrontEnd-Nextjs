import dynamic from "next/dynamic";
import PropTypes from "prop-types";
import { callPostAPI } from "_services/CallAPI";

const ExploreCategories = dynamic(import("components/ExploreCategories"));
const MetaData = dynamic(import("components/Common/MetaData"));

export default function categories(props) {
  const { categoriesPageData, categoryMetaData } = props;
  return (
    <>
      <MetaData metaContent={{
        metaTitle: categoryMetaData.data.meta_title,
        metaDescription: categoryMetaData.data.meta_description,
        metaKeywords: categoryMetaData.data.meta_keywords,
      }} />
      <ExploreCategories categoriesPageData={categoriesPageData} />
    </>
  );
}

export async function getServerSideProps() {
  const response = {
    categoriesPageData: null,
    categoryMetaData: null,
  };

  const params = {
    thumbnail_id: 3,
  };

  const paramsMetaData = {
    page_type: 'CATEGORIES',
  };

  response.categoriesPageData = await callPostAPI(process.env.CATEGORIES_DATA, params);
  response.categoryMetaData = await callPostAPI(process.env.CMS_SEO_META_DATA, paramsMetaData);

  return {
    props: response,
  };
}

categories.propTypes = {
  categoriesPageData: PropTypes.object,
  categoryMetaData: PropTypes.object,
};