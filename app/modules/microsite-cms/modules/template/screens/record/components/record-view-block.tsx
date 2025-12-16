import { Field, FieldGroup, FieldLabel } from "@ui/field";
import { Input } from "@ui/input";
import { ITemplateBlock } from "@microsite-cms/common/services/db/types/interfaces";
import { Checkbox } from "@ui/checkbox";
import RecordViewElementGroup from "./record-view-element-group";
import RecordViewElementSingle from "./record-view-element-single";
import { Badge } from "@ui/badge";

interface RecordViewBlockProps {
  blocks: ITemplateBlock[];
  fieldArrayName: string;
}

export default function RecordViewBlock({
  blocks,
  fieldArrayName,
}: RecordViewBlockProps) {
  return (
    <div>
      <header className="flex items-center justify-between py-5">
        <h2 className="text-muted-foreground font-medium">Blocks</h2>
      </header>

      <div className="space-y-5 p-8 bg-accent/40 rounded-lg border-2 border-dashed border-border/50">
        {blocks.map((block, index) => (
          <div key={index} className="relative group/block-item">
            <RecordViewBlockItem
              block={block}
              index={index}
              fieldArrayName={fieldArrayName}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

interface RecordViewBlockItemProps {
  block: ITemplateBlock;
  index: number;
  fieldArrayName: string;
}

const RecordViewBlockItem = ({
  block,
  index,
  fieldArrayName,
}: RecordViewBlockItemProps) => {
  const isGroup = block.type === "group";
  const firstElement = block.elements?.[0];

  return (
    <div>
      <div className="w-full p-5 relative group/block-item border border-border/50 shadow-xs bg-background rounded-lg space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Block {index + 1}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="text-[11px] uppercase tracking-wide"
            >
              {block.type === "group" ? "Group block" : "Single block"}
            </Badge>
            {block.repeatable && (
              <Badge
                variant="secondary"
                className="text-[11px] uppercase tracking-wide"
              >
                Repeatable
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 items-center gap-5">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor={`block-title-${index}`}>
                Block Title
              </FieldLabel>
              <Input
                id={`block-title-${index}`}
                value={block.title}
                readOnly
                className="bg-muted"
              />
            </Field>
          </FieldGroup>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor={`block-key-${index}`}>Block Key</FieldLabel>
              <Input
                id={`block-key-${index}`}
                value={block.key}
                readOnly
                className="bg-muted"
              />
            </Field>
          </FieldGroup>
          <FieldGroup>
            <Field>
              <div className="flex items-center gap-2">
                <Checkbox
                  id={`block-repeatable-${index}`}
                  checked={!!block.repeatable}
                  disabled
                />
                <FieldLabel htmlFor={`block-repeatable-${index}`}>
                  Repeatable
                </FieldLabel>
              </div>
            </Field>
          </FieldGroup>
        </div>

        {isGroup ? (
          <RecordViewElementGroup
            elements={block.elements}
            fieldArrayName={`${fieldArrayName}.${index}.elements`}
          />
        ) : (
          firstElement && (
            <RecordViewElementSingle
              element={firstElement}
              index={0}
              fieldArrayName={`${fieldArrayName}.${index}.elements`}
            />
          )
        )}
      </div>
    </div>
  );
};
