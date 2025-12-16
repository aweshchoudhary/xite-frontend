import { Field, FieldGroup, FieldLabel } from "@ui/field";
import { Input } from "@ui/input";
import { Textarea } from "@ui/textarea";
import {
  IPageValue,
  ITemplatePage,
} from "@/modules/common/services/db/types/interfaces";
import RecordViewSection from "./record-view-section";
import { FileText } from "lucide-react";

interface RecordViewPageProps {
  pages: Array<{ page: IPageValue; templatePage: ITemplatePage }>;
}

export default function RecordViewPage({ pages }: RecordViewPageProps) {
  if (pages.length === 0) {
    return (
      <div className="py-12">
        <div className="text-center text-muted-foreground">
          <FileText className="size-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No pages available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Pages</h2>
      </header>

      <div className="space-y-5">
        {pages.map(({ page, templatePage }, index) => (
          <div key={index} className="relative group/page-item">
            <RecordViewPageItem
              page={page}
              templatePage={templatePage}
              index={index}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

interface RecordViewPageItemProps {
  page: IPageValue;
  templatePage: ITemplatePage;
  index: number;
}

const RecordViewPageItem = ({
  page,
  templatePage,
  index,
}: RecordViewPageItemProps) => {
  return (
    <div className="w-full relative p-8 space-y-6 bg-background shadow-xs rounded-xl border border-border/50">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Page {index + 1}
          </p>
          <p className="text-sm text-muted-foreground">
            {templatePage?.title || page.meta?.title || page.name || "Page"}
          </p>
        </div>
        <FileText className="size-4 text-muted-foreground" />
      </div>

      <div className="grid grid-cols-2 gap-5">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor={`name-${index}`}>Page Name</FieldLabel>
            <Input
              id={`name-${index}`}
              value={page.name || ""}
              readOnly
              className="bg-muted"
            />
          </Field>
        </FieldGroup>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor={`slug-${index}`}>Page Slug</FieldLabel>
            <Input
              id={`slug-${index}`}
              value={page.meta?.slug || ""}
              readOnly
              className="bg-muted"
            />
          </Field>
        </FieldGroup>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor={`meta-title-${index}`}>Meta Title</FieldLabel>
            <Input
              id={`meta-title-${index}`}
              value={page.meta?.title || ""}
              readOnly
              className="bg-muted"
            />
          </Field>
        </FieldGroup>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor={`meta-description-${index}`}>
              Meta Description
            </FieldLabel>
            <Textarea
              id={`meta-description-${index}`}
              value={page.meta?.description || ""}
              readOnly
              className="bg-muted"
            />
          </Field>
        </FieldGroup>
      </div>

      <RecordViewSection
        sections={page.sections
          .map((section) => {
            const templateSection = templatePage.sections.find(
              (s) => s.key === section.key
            );
            return templateSection ? { section, templateSection } : null;
          })
          .filter(
            (
              item
            ): item is {
              section: (typeof page.sections)[0];
              templateSection: (typeof templatePage.sections)[0];
            } => item !== null
          )}
        fieldArrayName={`pages.${index}.sections`}
      />
    </div>
  );
};
