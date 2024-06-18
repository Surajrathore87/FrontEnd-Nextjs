import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React from "react";
import { decrypt } from "_helper/encryptDecrypt";
import { callPostAPI } from "_services/CallAPI";
import PropTypes from "prop-types";

const PaymentResponse = dynamic(import("components/PaymentResponse"));
const MetaData = dynamic(import("components/Common/MetaData"));

export default function plansResponse(props) {
  const { planStatus } = props;
  const router = useRouter();
  const paymentId = router.query.payment_id;
  const paymentRequestId = router.query.payment_request_id;
  const paymentStatus = router.query.payment_status;

  return (
    <>
      <MetaData metaContent={{
        metaTitle: planStatus.data.meta_title,
        metaDescription: planStatus.data.meta_description,
        metaKeywords: planStatus.data.meta_keywords,
      }} />
      <PaymentResponse paymentId={paymentId}
        paymentRequestId={paymentRequestId}
        paymentStatus={paymentStatus} />
    </>
  );
}

export async function getServerSideProps() {
  const response = {
    planStatus: null,
  };

  response.planStatus = await callPostAPI(process.env.PAYMENT_STATUS_META_DATA, {});

  return {
    props: response,
  };
}

plansResponse.propTypes = {
  planStatus: PropTypes.object,
};