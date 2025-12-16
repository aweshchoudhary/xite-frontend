import { Field, FieldGroup, FieldLabel } from "@ui/field";
import { Input } from "@ui/input";
import {
  ISectionValue,
  ITemplateSection,
} from "@/modules/common/services/db/types/interfaces";
import RecordViewBlock from "./record-view-block";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ui/accordion";

interface RecordViewSectionProps {
  sections: Array<{
    section: ISectionValue;
    templateSection: ITemplateSection;
  }>;
  title?: string;
  fieldArrayName?: string;
}

export default function RecordViewSection({
  sections,
  title = "Sections",
}: RecordViewSectionProps) {
  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
      </header>

      <Accordion className="space-y-5" type="single" collapsible>
        {sections.map(({ section, templateSection }, index) => (
          <div key={index} className="relative group/section-item">
            <RecordViewSectionItem
              section={section}
              templateSection={templateSection}
              index={index}
            />
          </div>
        ))}
      </Accordion>
    </div>
  );
}

interface RecordViewSectionItemProps {
  section: ISectionValue;
  templateSection: ITemplateSection;
  index: number;
}

const RecordViewSectionItem = ({
  section,
  templateSection,
  index,
}: RecordViewSectionItemProps) => {
  return (
    <AccordionItem value={`section-${index}`}>
      <AccordionTrigger>{templateSection.title}</AccordionTrigger>
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
                  value={templateSection.title}
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
            blocks={section.blocks
              .map((block) => {
                const templateBlock = templateSection.blocks.find(
                  (b) => b.key === block.key
                );
                return templateBlock ? { block, templateBlock } : null;
              })
              .filter(
                (
                  item
                ): item is {
                  block: (typeof section.blocks)[0];
                  templateBlock: (typeof templateSection.blocks)[0];
                } => item !== null
              )}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
