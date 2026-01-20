"use client";
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
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

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

  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<string>(searchParams.get("sub-tab") || "common");
  const router = useRouter();

  const onTabChange = (value: string) => {
    setActiveTab(value);
    // current url with query params
    const url = new URL(window.location.href);
    url.searchParams.set("sub-tab", value);
    window.history.pushState({}, "", url.toString());
  };

  if (!microsite) {
    return <div>Microsite not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-10">
        <div className="flex items-end gap-5 justify-between">
            <div className="flex items-center gap-2">
              <Badge variant={"outline"}>Template: {template.name}</Badge>
            </div>
            
            <div>
              <Link
                href={microsite.domain ? microsite.domain : `https://${template._id}.xedinstitute.org/${microsite.cohortId}`}
                target="_blank"
                className={cn(
                  buttonVariants({ variant: "default", size: "sm" })
                )}
                aria-label="Edit microsite"
              >
                Preview
              </Link>
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

        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full space-y-3">
          <TabsList aria-label="Microsite content sections">
            <TabsTrigger value="common">Global Sections</TabsTrigger>
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

                {microsite.globalSections.length === 0 && (
                  <div className="p-3 space-y-5 rounded-lg">
                    <p className="text-sm text-muted-foreground">Nothing to show here.</p>
                  </div>
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
              <RecordViewBranding
                branding={microsite.branding}
                domain={microsite.domain}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
