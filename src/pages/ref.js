import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuth } from "_contexts/auth";

export default function ref() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const code = router.query.code;

  useEffect(() => {
    if (code && !isLoggedIn) {
      Cookies.set('refCode', code);
      router.push('/');
    } else if (isLoggedIn) {
      router.push('/');
    }
  }, [code, isLoggedIn])

  return (
    <>
    </>
  );
}
