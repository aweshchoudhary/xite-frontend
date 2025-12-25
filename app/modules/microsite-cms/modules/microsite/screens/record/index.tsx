import { Field, FieldGroup, FieldLabel } from "@ui/field";
import { Input } from "@ui/input";
import {
  IMicrosite,
  ITemplate,
} from "@microsite-cms/common/services/db/types/interfaces";
import RecordViewPage from "./components/record-view-page";
import RecordViewSection from "./components/record-view-section";
import RecordViewBranding from "./components/record-view-branding";
import { cn } from "@/modules/common/lib/utils";
import { buttonVariants } from "@ui/button";
import { Button } from "@ui/button";
import { Badge } from "@ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/tabs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@ui/breadcrumb";

interface RecordViewProps {
  microsite: IMicrosite;
  template: ITemplate;
  onEdit?: () => void;
}

export default function RecordView({
  microsite,
  template,
  onEdit,
}: RecordViewProps) {
  if (!microsite) {
    return <div>Microsite not found</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">
        {microsite.title || "Microsite"}
      </h1>
      <div className="space-y-10">
        <div className="flex items-end gap-5 justify-between">
          <FieldGroup className="max-w-xs">
            <Field>
              <FieldLabel htmlFor="microsite-title">Title</FieldLabel>
              <Input
                id="microsite-title"
                value={microsite.title || ""}
                readOnly
                className="bg-muted"
                aria-label="Microsite title"
              />
            </Field>
          </FieldGroup>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Badge variant={"outline"}>Template: {template.name}</Badge>
              <Badge variant={"outline"}>Cohort: {microsite.cohortId}</Badge>
              <Badge
                variant={
                  microsite.status === "active" ? "default" : "secondary"
                }
              >
                {microsite.status}
              </Badge>
            </div>
            {onEdit ? (
              <Button
                variant="default"
                size="sm"
                onClick={onEdit}
                aria-label="Edit microsite"
              >
                Edit
              </Button>
            ) : (
              <a
                className={cn(
                  buttonVariants({ variant: "default", size: "sm" })
                )}
                href={`/microsites/${microsite._id}/edit`}
                aria-label="Edit microsite"
              >
                Edit
              </a>
            )}
          </div>
        </div>

        <Tabs defaultValue="common" className="w-full space-y-3">
          <TabsList aria-label="Microsite content sections">
            <TabsTrigger value="common">Common</TabsTrigger>
            <TabsTrigger value="pages">Pages</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
          </TabsList>
          <TabsContent value="common">
            <div className="bg-primary/5 p-8 space-y-5 rounded-lg">
              {microsite.globalSections &&
                microsite.globalSections.length > 0 && (
                  <RecordViewSection
                    sections={microsite.globalSections
                      .map((section) => {
                        const templateSection = template?.globalSections?.find(
                          (s) => s.key === section.key
                        );
                        return templateSection
                          ? { section, templateSection }
                          : null;
                      })
                      .filter(
                        (
                          item
                        ): item is {
                          section: (typeof microsite.globalSections)[0];
                          templateSection: NonNullable<
                            typeof template.globalSections
                          >[0];
                        } => item !== null
                      )}
                    title="Global Sections"
                  />
                )}
            </div>
          </TabsContent>
          <TabsContent value="pages">
            <div className="bg-primary/5 p-8 space-y-5 rounded-lg">
              {microsite.pages && microsite.pages.length > 0 && (
                <RecordViewPage
                  pages={microsite.pages.map((page) => ({
                    page,
                    templatePage:
                      template.pages.find((p) => p.slug === page.meta.slug) ||
                      template.pages[0],
                  }))}
                />
              )}
            </div>
          </TabsContent>
          <TabsContent value="branding">
            <div className="bg-primary/5 p-8 space-y-5 rounded-lg">
              <RecordViewBranding branding={microsite.branding} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
