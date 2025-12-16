import LoginForm from "@/modules/common/authentication/components/forms/login/form";
import { getUser } from "@/modules/common/authentication/firebase/action";
import Image from "next/image";
import { redirect } from "next/navigation";
export default async function Login() {
  const session = await getUser();
  if (session) redirect("/");

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center flex-col gap-4">
      <Image
        src="/xite-logo.png"
        alt="logo"
        width={1000}
        height={1000}
        className="w-100"
      />
      <LoginForm />
    </div>
  );
}
