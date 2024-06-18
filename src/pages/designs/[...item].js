import dynamic from "next/dynamic";
import React from 'react';
import { useRouter } from 'next/router';
import PropTypes from "prop-types";
import { callPostAPI } from "_services/CallAPI";

const ListItems = dynamic(import("components/ListItems"));
const MetaDataDesigns = dynamic(import("components/Common/MetaDataDesigns"));
export default function designDetail(props) {
  const { designDetailsData, designsMetaData } = props
  const router = useRouter();
  const { item } = router.query;

  return (
    <>
      <MetaDataDesigns metaContent={{
        metaTitle: designsMetaData.data.meta_title,
        metaDescription: designsMetaData.data.meta_description,
        metaKeywords: designsMetaData.data.meta_keywords,
      }}
        designGrouped={designDetailsData?.data?.design_detail?.is_grouped}
        designCode={designDetailsData?.data?.design_detail?.code}
      />
      <ListItems designCode={item?.[0]} designDetailsData={designDetailsData} />
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
    main_category_slug: '',
    is_trending: 0,
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

designDetail.propTypes = {
  designDetailsData: PropTypes.object,
  designsMetaData: PropTypes.object,
};