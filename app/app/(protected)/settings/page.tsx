import { auth } from "@/modules/common/authentication";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/modules/common/components/ui/avatar";
import { Mail } from "lucide-react";
import SignOutBtn from "./sign-out-btn";
import { getImageUrl } from "@/modules/common/lib/utils";

export default async function SettingsPage() {
  const session = await auth();
  return (
    <article className="spacing">
      <div className="2xl:p-10 xl:p-8 lg:p-6 p-5 bg-background rounded-lg shadow">
        <section className="mb-10">
          <div>
            <h1 className="h1">Settings</h1>
          </div>
        </section>
        <section>
          <div>
            <div className="mb-5">
              <div>
                <Avatar className="size-20">
                  {session?.user?.image && (
                    <AvatarImage src={getImageUrl(session?.user?.image)} />
                  )}
                  <AvatarFallback className="text-2xl font-medium">
                    {session?.user?.name?.split(" ")[0]?.charAt(0)}
                    {session?.user?.name?.split(" ")[1]?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            <h2 className="h2 capitalize mb-2">{session?.user?.name}</h2>
            <h3 className="h3 flex items-center gap-2">
              <Mail className="size-5 shrink-0 text-primary" />{" "}
              {session?.user?.email}
            </h3>
            <div className="mt-4">
              <SignOutBtn />
            </div>
          </div>
        </section>
      </div>
    </article>
  );
}
