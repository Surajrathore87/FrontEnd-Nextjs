import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { callPostAPI } from "_services/CallAPI";

const IndividualDesign = dynamic(import("components/IndividualDesign"));
const MetaData = dynamic(import("components/Common/MetaData"));
export default function singleDesign(props) {
  const { designDetailsData, designsMetaData } = props
  const router = useRouter();
  const { product } = router.query;

  return (
    <>
      <MetaData metaContent={{
        metaTitle: designsMetaData.data.meta_title,
        metaDescription: designsMetaData.data.meta_description,
        metaKeywords: designsMetaData.data.meta_keywords,
      }} />
      <IndividualDesign designCode={product?.[0]} designDetailsData={designDetailsData} />
    </>
  );
}

export async function getServerSideProps(context) {
  const response = {
    designDetailsData: null,
    designsMetaData: null,
  };
  const params = {
    slug: context.params,
    thumbnail_id: 3,
    zoom_thumbnail_id: 8,
  };
  const paramsMetaData = {
    slug: context.params,
  };

  response.designDetailsData = await callPostAPI(process.env.DESIGN_DETAIL_DATA, params);
  response.designsMetaData = await callPostAPI(process.env.DESIGNS_META_DATA, paramsMetaData);

  return {
    props: response,
  };
}

singleDesign.propTypes = {
  designDetailsData: PropTypes.object,
  designsMetaData: PropTypes.object,
};