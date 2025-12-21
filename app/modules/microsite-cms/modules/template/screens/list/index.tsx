import { buttonVariants } from "@ui/button";
import { fetchTemplates } from "./actions/fetch";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/modules/common/lib/utils";
import CardList from "./components/card-list";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@ui/breadcrumb";

export default async function Templates() {
  const templates = await fetchTemplates();

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Templates</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="bg-primary/5 p-10 space-y-5 rounded-lg">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Templates</h1>
          <Link
            className={cn(buttonVariants({ variant: "light" }))}
            href="/templates/new"
            aria-label="Create new template"
          >
            <PlusIcon className="size-4" aria-hidden="true" />
            Template
          </Link>
        </header>
        <CardList templates={templates} />
      </div>
    </div>
  );
}
