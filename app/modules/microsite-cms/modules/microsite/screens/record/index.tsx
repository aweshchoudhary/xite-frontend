import { Field, FieldGroup, FieldLabel } from "@ui/field";
import { Input } from "@ui/input";
import {
  IMicrosite,
  ITemplate,
} from "@microsite-cms/common/services/db/types/interfaces";
import RecordViewPage from "./components/record-view-page";
import RecordViewSection from "./components/record-view-section";
import Link from "next/link";
import { cn } from "@/modules/common/lib/utils";
import { buttonVariants } from "@ui/button";
import { Badge } from "@ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/tabs";

interface RecordViewProps {
  microsite: IMicrosite;
  template: ITemplate;
}

export default function RecordView({ microsite, template }: RecordViewProps) {
  if (!microsite) {
    return <div>Microsite not found</div>;
  }

  return (
    <div>
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
            <Link
              className={cn(buttonVariants({ variant: "default", size: "sm" }))}
              href={`/microsites/${microsite._id}/edit`}
            >
              Edit
            </Link>
          </div>
        </div>

        <Tabs defaultValue="common" className="w-full space-y-3">
          <TabsList>
            <TabsTrigger value="common">Common</TabsTrigger>
            <TabsTrigger value="pages">Pages</TabsTrigger>
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
        </Tabs>
      </div>
    </div>
  );
}
