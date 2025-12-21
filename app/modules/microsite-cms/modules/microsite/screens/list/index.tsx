import { buttonVariants } from "@ui/button";
import { cn } from "@/modules/common/lib/utils";
import Link from "next/link";
import { fetchMicrosites } from "./actions/fetch";
import CardList from "./components/card-list";
import { PlusIcon } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@ui/breadcrumb";

export default async function Microsites() {
  const microsites = await fetchMicrosites();

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Microsites</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="bg-primary/5 p-10 space-y-5 rounded-lg">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Microsites</h1>
          <Link
            className={cn(buttonVariants({ variant: "light" }))}
            href="/microsites/new"
            aria-label="Create new microsite"
          >
            <PlusIcon className="size-4" aria-hidden="true" />
            Microsite
          </Link>
        </header>
        <CardList microsites={microsites} />
      </div>
    </div>
  );
}
