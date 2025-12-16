import { buttonVariants } from "@ui/button";
import { fetchTemplates } from "./actions/fetch";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/modules/common/lib/utils";
import CardList from "./components/card-list";

export default async function Templates() {
  const templates = await fetchTemplates();

  return (
    <div className="bg-primary/5 p-10 space-y-5 rounded-lg">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Templates</h1>
        <Link
          className={cn(buttonVariants({ variant: "light" }))}
          href="/templates/new"
        >
          <PlusIcon className="size-4" />
          Template
        </Link>
      </header>
      <CardList templates={templates} />
    </div>
  );
}
