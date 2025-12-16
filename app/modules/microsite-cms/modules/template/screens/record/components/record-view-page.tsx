import { Field, FieldGroup, FieldLabel } from "@ui/field";
import { Input } from "@ui/input";
import { ITemplatePage } from "@/modules/common/services/db/types/interfaces";
import RecordViewSection from "./record-view-section";

interface RecordViewPageProps {
  pages: ITemplatePage[];
}

export default function RecordViewPage({ pages }: RecordViewPageProps) {
  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Pages</h2>
      </header>

      <div className="space-y-5">
        {pages.map((page, index) => (
          <div key={index} className="relative group/page-item">
            <RecordViewPageItem page={page} index={index} />
          </div>
        ))}
      </div>
    </div>
  );
}

interface RecordViewPageItemProps {
  page: ITemplatePage;
  index: number;
}

const RecordViewPageItem = ({ page, index }: RecordViewPageItemProps) => {
  return (
    <div className="w-full relative space-y-8">
      <div className="grid grid-cols-2 gap-5">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor={`title-${index}`}>Title</FieldLabel>
            <Input
              id={`title-${index}`}
              value={page.title}
              readOnly
              className="bg-muted"
            />
          </Field>
        </FieldGroup>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor={`slug-${index}`}>Slug</FieldLabel>
            <Input
              id={`slug-${index}`}
              value={page.slug}
              readOnly
              className="bg-muted"
            />
          </Field>
        </FieldGroup>
      </div>
      <RecordViewSection
        sections={page.sections}
        fieldArrayName={`pages.${index}.sections`}
      />
    </div>
  );
};
