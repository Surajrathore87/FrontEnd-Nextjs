import dynamic from "next/dynamic";
import PropTypes from "prop-types";
import { useAuth } from "_contexts/auth";
import { callPostAPI } from "_services/CallAPI";

const Withdrawal = dynamic(import("components/Withdrawal"));
const MetaData = dynamic(import("components/Common/MetaData"));
export default function withdrawal(props) {
  const { userDetails, getUserDetails } = useAuth();
  const { withdrawalMetaData } = props;
  return (
    <>
      <MetaData metaContent={{
        metaTitle: withdrawalMetaData.data.meta_title,
        metaDescription: withdrawalMetaData.data.meta_description,
        metaKeywords: withdrawalMetaData.data.meta_keywords,
      }} />
      {userDetails && userDetails.role_name == 'Carpenter' && <Withdrawal userDetails={userDetails} getUserDetails={getUserDetails} />}
    </>
  );
}

export async function getServerSideProps() {
  const response = {
    withdrawalMetaData: null,
  };

  const paramsMetaData = {
    page_type: 'WITHDRAWALREQUEST',
  };

  response.withdrawalMetaData = await callPostAPI(process.env.CMS_SEO_META_DATA, paramsMetaData);

  return {
    props: response,
  };
}
withdrawal.propTypes = {
  withdrawalMetaData: PropTypes.object,
};