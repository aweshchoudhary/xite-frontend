"use client";

import CommonError from "@/modules/common/components/global/error/common-error";
import { useEffect } from "react";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <CommonError reset={reset} />;
}
