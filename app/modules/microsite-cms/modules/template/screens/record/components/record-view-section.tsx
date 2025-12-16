import { Field, FieldGroup, FieldLabel } from "@ui/field";
import { Input } from "@ui/input";
import { ITemplateSection } from "@/modules/common/services/db/types/interfaces";
import RecordViewBlock from "./record-view-block";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ui/accordion";

interface RecordViewSectionProps {
  sections: ITemplateSection[];
  fieldArrayName: string;
  title?: string;
}

export default function RecordViewSection({
  sections,
  fieldArrayName,
  title = "Sections",
}: RecordViewSectionProps) {
  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
      </header>

      <Accordion className="space-y-5" type="single" collapsible>
        {sections.map((section, index) => (
          <div key={index} className="relative group/section-item">
            <RecordViewSectionItem
              section={section}
              index={index}
              fieldArrayName={fieldArrayName}
            />
          </div>
        ))}
      </Accordion>
    </div>
  );
}

interface RecordViewSectionItemProps {
  section: ITemplateSection;
  index: number;
  fieldArrayName: string;
}

const RecordViewSectionItem = ({
  section,
  index,
  fieldArrayName,
}: RecordViewSectionItemProps) => {
  return (
    <AccordionItem value={`section-${index}`}>
      <AccordionTrigger>{section.title}</AccordionTrigger>
      <AccordionContent>
        <div className="w-full relative p-8 space-y-5 bg-background shadow-xs rounded-xl">
          <div className="grid grid-cols-2 gap-5">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor={`section-title-${index}`}>
                  Title
                </FieldLabel>
                <Input
                  id={`section-title-${index}`}
                  value={section.title}
                  readOnly
                  className="bg-muted"
                />
              </Field>
            </FieldGroup>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor={`section-key-${index}`}>Key</FieldLabel>
                <Input
                  id={`section-key-${index}`}
                  value={section.key}
                  readOnly
                  className="bg-muted"
                />
              </Field>
            </FieldGroup>
          </div>

          <RecordViewBlock
            blocks={section.blocks}
            fieldArrayName={`${fieldArrayName}.${index}.blocks`}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
