"use client";

import { Button } from "@ui/button";
import { loginFormAction } from "./action";

export default function LoginForm() {
  const loginAction = async () => {
    loginFormAction();
  };

  return (
    <div>
      <Button onClick={loginAction}>Login with Google</Button>
    </div>
  );
}
