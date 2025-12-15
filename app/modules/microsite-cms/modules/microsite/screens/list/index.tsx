import { buttonVariants } from "@/modules/common/components/ui/button";
import { cn } from "@/modules/common/lib/utils";
import Link from "next/link";
import { fetchMicrosites } from "./actions/fetch";
import CardList from "./components/card-list";
import { PlusIcon } from "lucide-react";

export default async function Microsites() {
  const microsites = await fetchMicrosites();

  return (
    <div className="bg-primary/5 p-10 space-y-5 rounded-lg">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Microsites</h1>
        <Link
          className={cn(buttonVariants({ variant: "light" }))}
          href="/microsites/new"
        >
          <PlusIcon className="size-4" />
          Microsite
        </Link>
      </header>
      <CardList microsites={microsites} />
    </div>
  );
}
