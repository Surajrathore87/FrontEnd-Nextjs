import React from 'react'
import dynamic from "next/dynamic";
import { useRouter } from 'next/router';
import PropTypes from "prop-types";
import { callPostAPI } from "_services/CallAPI";
import { decrypt } from '_helper/encryptDecrypt';

const Chat = dynamic(import("components/Chat/Chat"));
const MetaData = dynamic(import("components/Common/MetaData"));
export default function chatPage(props) {
  const router = useRouter();
  const sender = router.query;
  const { chatMetaData } = props;
  const chatId = sender?.chat?.[0] && decrypt(sender?.chat?.[0].replace(/dpo/g, '/')) || '';
  return (
    <>
      <MetaData metaContent={{
        metaTitle: chatMetaData.data.meta_title,
        metaDescription: chatMetaData.data.meta_description,
        metaKeywords: chatMetaData.data.meta_keywords,
      }} />
      <Chat sender={chatId} />
    </>
  );
}

export async function getServerSideProps() {
  const response = {
    chatMetaData: null,
  };

  const paramsMetaData = {
    page_type: 'CHAT',
  };

  response.chatMetaData = await callPostAPI(process.env.CMS_SEO_META_DATA, paramsMetaData);

  return {
    props: response,
  };
}
chatPage.propTypes = {
  chatMetaData: PropTypes.object,
};