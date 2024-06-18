import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { decrypt } from "_helper/encryptDecrypt";
import PropTypes from "prop-types";
import { callPostAPI } from "_services/CallAPI";

const FavouriteDesigns = dynamic(import("components/FavouriteDesigns"));
const MetaData = dynamic(import("components/Common/MetaData"));

export default function favoriteFolders(props) {
  const { favoritesMetaData } = props;
  const router = useRouter();
  const { folders } = router.query;
  const id = folders?.[0] && decrypt(folders?.[0].replace(/dpo/g, '/')) || '';
  return (
    <>
      <MetaData metaContent={{
        metaTitle: favoritesMetaData.data.meta_title,
        metaDescription: favoritesMetaData.data.meta_description,
        metaKeywords: favoritesMetaData.data.meta_keywords,
      }} />
      <FavouriteDesigns folderId={id} />
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

favoriteFolders.propTypes = {
  favoritesMetaData: PropTypes.object,
};