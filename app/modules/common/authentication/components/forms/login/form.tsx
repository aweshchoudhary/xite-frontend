"use client";

import { Button } from "@ui/button";
import { loginFormAction } from "./action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../../firebase/client";

export default function LoginForm() {
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      await loginFormAction(idToken);
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
        onClick={handleLogin}
      >
        Continue with Google
      </Button>
    </div>
  );
}
