import "react-phone-number-input/style.css";
import { Header } from "@/modules/common/components/layouts/header";
import "@/modules/common/database/prisma/seed/import-subjects-codes";
import { getUser } from "@/modules/common/authentication/firebase/action";
import { redirect } from "next/navigation";
import { AuthProvider } from "@/modules/common/authentication/firebase/auth-context";
import { PAGE_PADDING } from "@/modules/common/lib/spacing-config";

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
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className={`flex-1 ${PAGE_PADDING}`}>{children}</main>
      </div>
    </AuthProvider>
  );
}
