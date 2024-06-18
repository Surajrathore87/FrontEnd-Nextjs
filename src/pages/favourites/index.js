import dynamic from "next/dynamic";
import PropTypes from "prop-types";
import { callPostAPI } from "_services/CallAPI";

const Favourites = dynamic(import("components/Favourites"));
const MetaData = dynamic(import("components/Common/MetaData"));

export default function favorites(props) {
  const { favoritesMetaData } = props;
  return (
    <>
      <MetaData metaContent={{
        metaTitle: favoritesMetaData.data.meta_title,
        metaDescription: favoritesMetaData.data.meta_description,
        metaKeywords: favoritesMetaData.data.meta_keywords,
      }} />
      <Favourites />
    </>
  );
}

export async function getServerSideProps() {
  const response = {
    favoritesMetaData: null,
  };

  const paramsMetaData = {
    page_type: 'FAVORITES',
  };

  response.favoritesMetaData = await callPostAPI(process.env.CMS_SEO_META_DATA, paramsMetaData);

  return {
    props: response,
  };
}

favorites.propTypes = {
  favoritesMetaData: PropTypes.object,
};