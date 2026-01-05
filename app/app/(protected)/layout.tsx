import "react-phone-number-input/style.css";
import { Header } from "@/modules/common/components/layouts/header";
import "@/modules/common/database/prisma/seed/import-subjects-codes";
import { getUser } from "@/modules/common/authentication/firebase/action";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }
  return (
    <article className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 xl:p-10 lg:p-10 p-5">{children}</main>
    </article>
  );
}
