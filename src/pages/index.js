import dynamic from "next/dynamic";
import PropTypes from "prop-types";
import { callPostAPI } from "_services/CallAPI";

const Home = dynamic(import("components/Home/Home"));
const MetaData = dynamic(import("components/Common/MetaData"));

export default function homePage(props) {
  const { homePageData, categoryData, trendingDesignData, homeMetaData } =
    props;
  return (
    <>
      {/* <MetaData metaContent={{
        metaTitle: homeMetaData.data.meta_title,
        metaDescription: homeMetaData.data.meta_description,
        metaKeywords: homeMetaData.data.meta_keywords,
      }} /> */}
      <Home
        homePageData={homePageData}
        categoryData={categoryData}
        trendingDesignData={trendingDesignData}
      />
    </>
  );
}

export async function getServerSideProps() {
  const response = {
    homePageData: null,
    categoryData: null,
    trendingDesignData: null,
    homeMetaData: null,
  };
  const params = {
    thumbnail_id: 6,
  };
  const paramsCategory = {
    thumbnail_id: 3,
  };
  const paramsDesigns = {
    is_trending: 1,
    thumbnail_id: 4,
    main_category_slug: "",
  };
  const paramsMetaData = {
    page_type: "HOMEPAGE",
  };

  response.homePageData = await callPostAPI(process.env.HOME_PAGE_DATA, params);
  response.categoryData = await callPostAPI(
    process.env.CATEGORIES_DATA,
    paramsCategory
  );
  response.trendingDesignData = await callPostAPI(
    process.env.HOME_DESIGNS_DATA,
    paramsDesigns
  );
  response.homeMetaData = await callPostAPI(
    process.env.CMS_SEO_META_DATA,
    paramsMetaData
  );

  return {
    props: response,
  };
}

homePage.propTypes = {
  homePageData: PropTypes.object,
  categoryData: PropTypes.object,
  trendingDesignData: PropTypes.object,
  homeMetaData: PropTypes.object,
};
