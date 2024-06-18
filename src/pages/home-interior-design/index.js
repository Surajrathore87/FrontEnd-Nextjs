import dynamic from "next/dynamic";
import PropTypes from "prop-types";
import { callPostAPI } from "_services/CallAPI";

const ExploreDesigns = dynamic(import("components/ExploreDesigns"));
const ExploreNavbar = dynamic(import("components/ExploreNavbar"));
const MetaData = dynamic(import("components/Common/MetaData"));

export default function explore(props) {
  const { categoryData, exploreDesignsData, exploreMetaData } = props;
  return (
    <>
      <MetaData metaContent={{
        metaTitle: exploreMetaData.data.meta_title,
        metaDescription: exploreMetaData.data.meta_description,
        metaKeywords: exploreMetaData.data.meta_keywords,
      }} />
      <ExploreNavbar designSlug={0} categoryData={categoryData} />
      <ExploreDesigns designSlug={'all'} exploreDesignsData={exploreDesignsData} />
    </>
  );
}

export async function getServerSideProps(context, initial = false) {
  const response = {
    categoryData: null,
    exploreDesignsData: null,
    exploreMetaData: null,
  };

  const paramsDesigns = {
    thumbnail_id: 4,
    main_category_slug: context.params,
  };

  const paramsMetaData = {
    page_type: 'EXPLORE',
  };

  response.categoryData = await callPostAPI(process.env.CATEGORIES_DATA, {});
  response.exploreDesignsData = await callPostAPI(`${process.env.EXPLORE_DESIGNS_DATA}?page=${initial ? 1 : ''}`, paramsDesigns);
  response.exploreMetaData = await callPostAPI(process.env.CMS_SEO_META_DATA, paramsMetaData);

  return {
    props: response,
  };
}

explore.propTypes = {
  categoryData: PropTypes.object,
  exploreDesignsData: PropTypes.object,
  exploreMetaData: PropTypes.object
};