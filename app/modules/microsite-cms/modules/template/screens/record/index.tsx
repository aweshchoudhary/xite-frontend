import { ITemplate } from "@microsite-cms/common/services/db/types/interfaces";
import RecordViewPage from "./components/record-view-page";
import RecordViewSection from "./components/record-view-section";
import Link from "next/link";
import { cn } from "@/modules/common/lib/utils";
import { buttonVariants } from "@ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/tabs";
import { Pencil } from "lucide-react";
import { Badge } from "@ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@ui/breadcrumb";

interface RecordViewProps {
  template: ITemplate;
}

export default function RecordView({ template }: RecordViewProps) {
  if (!template) {
    return <div>Template not found</div>;
  }

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/cms?tab=templates">Templates</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{template.name || "Template"}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="space-y-10">
        <div className="flex items-end gap-5 justify-between">
          <h1 className="text-2xl font-bold">{template.name}</h1>
          <div className="flex items-center gap-2">
            <Badge className="text-sm" variant={"secondary"}>
              {template.status}
            </Badge>
            <Badge className="text-sm" variant={"outline"}>
              Type: {template.type}
            </Badge>
            <Link
              href={`/templates/${template._id}/edit`}
              className={cn(
                buttonVariants({ variant: "outline", size: "icon" })
              )}
              aria-label="Edit template"
            >
              <Pencil className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <Tabs defaultValue="common" className="w-full space-y-3">
          <TabsList aria-label="Template content sections">
            <TabsTrigger value="common">Common</TabsTrigger>
            <TabsTrigger value="pages">Pages</TabsTrigger>
          </TabsList>
          <TabsContent value="common">
            <div className="bg-primary/5 p-8 space-y-5 rounded-lg">
              <RecordViewSection
                sections={template.globalSections || []}
                fieldArrayName="globalSections"
                title="Global Sections"
              />
            </div>
          </TabsContent>
          <TabsContent value="pages">
            <div className="bg-primary/5 p-8 space-y-5 rounded-lg">
              <RecordViewPage pages={template.pages || []} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
