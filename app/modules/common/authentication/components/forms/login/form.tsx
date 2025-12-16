"use client";

import { Button } from "@ui/button";
import { loginFormAction } from "./action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();

  const loginAction = async () => {
    try {
      await loginFormAction();
      toast.success("Login successful");
      router.push("/");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to login");
    }
  };

  return (
    <div>
      <Button
        variant="secondary"
        className="text-lg px-5 py-3 bg-white"
        size="lg"
        onClick={loginAction}
      >
        Continue with Google
      </Button>
    </div>
  );
}
