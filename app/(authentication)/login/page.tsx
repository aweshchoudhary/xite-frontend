import LoginForm from "@/modules/common/authentication/components/forms/login/form";
import { getUser } from "@/modules/common/authentication/firebase/action";
import Image from "next/image";
import { redirect } from "next/navigation";
export default async function Login() {
  const session = await getUser();
  if (session) redirect("/");

  return (
    <section className="min-h-screen grid grid-cols-2">
      <div className="bg-primary flex items-center justify-center">
        <Image
          src="/xite-logo.png"
          alt="logo"
          width={1000}
          height={1000}
          className="w-100"
        />
      </div>
      <div className="flex items-center justify-center">
        <LoginForm />
      </div>
    </section>
  );
}
