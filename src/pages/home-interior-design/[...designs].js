import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { callPostAPI } from "_services/CallAPI";
import parse from 'html-react-parser';

const ExploreDesigns = dynamic(import("components/ExploreDesigns"));
const ExploreNavbar = dynamic(import("components/ExploreNavbar"));
const MetaData = dynamic(import("components/Common/MetaData"));

export default function exploreDesigns(props) {
  const { categoryData, exploreDesignsData, exploreMetaData } = props
  const router = useRouter();
  const { designs } = router.query;
  return (
    <>
      <MetaData metaContent={{
        metaTitle: exploreMetaData.data.category.meta_title && exploreMetaData.data.category.meta_title || 'Home Interior Designs',
        metaDescription: exploreMetaData.data.category.meta_description && exploreMetaData.data.category.meta_description || 'Home Interior Designs',
        metaKeywords: exploreMetaData.data.category.meta_keywords && exploreMetaData.data.category.meta_keywords || 'Home Interior Designs',
      }} />
      <ExploreNavbar designSlug={designs?.[0]} categoryData={categoryData} />
      <ExploreDesigns designSlug={designs?.[0]} exploreDesignsData={exploreDesignsData} />
      <div className="container pb-4">
        <div className="row">
          <div className="col-12">
            {exploreDesignsData && exploreDesignsData.data.category_description &&
              <div className="cms-text-content mb-lg-5 mb-4">
                {parse(exploreDesignsData.data.category_description)}
              </div>
            }
          </div>
        </div>
      </div>
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
    main_category_slug: context.params.designs[0],
  };
  const paramsMetaData = {
    category_slug: context.params.designs[0],
  };

  response.categoryData = await callPostAPI(process.env.CATEGORIES_DATA, {});
  response.exploreDesignsData = await callPostAPI(`${process.env.EXPLORE_DESIGNS_DATA}?page=${initial ? 1 : ''}`, paramsDesigns);
  response.exploreMetaData = await callPostAPI(process.env.CATEGORIES_DESCRIPTION, paramsMetaData);
  return {
    props: response,
  };
}

exploreDesigns.propTypes = {
  categoryData: PropTypes.object,
  exploreDesignsData: PropTypes.object,
  exploreMetaData: PropTypes.object
};