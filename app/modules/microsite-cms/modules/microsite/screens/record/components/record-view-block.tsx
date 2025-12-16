import { Field, FieldGroup, FieldLabel } from "@ui/field";
import { Input } from "@ui/input";
import { Textarea } from "@ui/textarea";
import {
  IBlockValue,
  ITemplateBlock,
} from "@/modules/common/services/db/types/interfaces";
import { Checkbox } from "@ui/checkbox";
import RecordViewValue from "./record-view-value";
import { Separator } from "@ui/separator";
import { Badge } from "@ui/badge";

interface RecordViewBlockProps {
  blocks: Array<{ block: IBlockValue; templateBlock: ITemplateBlock }>;
}

export default function RecordViewBlock({ blocks }: RecordViewBlockProps) {
  return (
    <div>
      <header className="flex items-center justify-between py-5">
        <h2 className="text-muted-foreground font-medium">Blocks</h2>
      </header>

      <div className="space-y-5 p-8 bg-accent/40 rounded-lg border-2 border-dashed border-border/50">
        {blocks.map(({ block, templateBlock }, index) => (
          <div key={index} className="relative group/block-item">
            <RecordViewBlockItem
              block={block}
              templateBlock={templateBlock}
              index={index}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

interface RecordViewBlockItemProps {
  block: IBlockValue;
  templateBlock: ITemplateBlock;
  index: number;
}

const RecordViewBlockItem = ({
  block,
  templateBlock,
  index,
}: RecordViewBlockItemProps) => {
  const isGroup = block.type === "group";
  const isRepeatable = block.repeatable;

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
                value={templateBlock.title}
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

        {/* Display values based on block type */}
        {isRepeatable && block.items ? (
          <div className="space-y-4">
            <header className="flex items-center justify-between py-2">
              <h3 className="text-sm font-medium">Items</h3>
            </header>
            <div className="space-y-4">
              {block.items.map((item, itemIndex) => {
                // Handle both database structure (item.data) and form structure (item directly or item.value)
                const itemData =
                  (
                    item as {
                      data?: Record<string, unknown>;
                      value?: Record<string, unknown>;
                    }
                  )?.data ||
                  (
                    item as {
                      data?: Record<string, unknown>;
                      value?: Record<string, unknown>;
                    }
                  )?.value ||
                  (item as Record<string, unknown>);

                return (
                  <div
                    key={itemIndex}
                    className="p-4 border rounded-lg bg-background"
                  >
                    <div className="space-y-4">
                      {isGroup
                        ? // Group type: display all elements from the item
                          templateBlock.elements.map((element) => {
                            // Handle nested value structure: itemData[element.key] or itemData[element.key].value
                            const elementData = itemData[element.key];
                            const elementValue =
                              typeof elementData === "object" &&
                              elementData !== null &&
                              "value" in elementData
                                ? (elementData as { value: unknown }).value
                                : elementData;
                            return (
                              <RecordViewValue
                                key={element.key}
                                element={element}
                                value={elementValue}
                                index={itemIndex}
                              />
                            );
                          })
                        : // Single type: display the single element
                          templateBlock.elements[0] &&
                          (() => {
                            const elementData =
                              itemData[templateBlock.elements[0].key];
                            const elementValue =
                              typeof elementData === "object" &&
                              elementData !== null &&
                              "value" in elementData
                                ? (elementData as { value: unknown }).value
                                : elementData;
                            return (
                              <RecordViewValue
                                element={templateBlock.elements[0]}
                                value={elementValue}
                                index={itemIndex}
                              />
                            );
                          })()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {isGroup && block.value
              ? // Group type: display all elements from the value object
                templateBlock.elements.map((element) => {
                  // Handle nested value structure: block.value[element.key] or block.value[element.key].value
                  const elementData = (
                    block.value as Record<string, unknown>
                  )?.[element.key];
                  const elementValue =
                    typeof elementData === "object" &&
                    elementData !== null &&
                    "value" in elementData
                      ? (elementData as { value: unknown }).value
                      : elementData;
                  return (
                    <RecordViewValue
                      key={element.key}
                      element={element}
                      value={elementValue}
                      index={index}
                    />
                  );
                })
              : // Single type: display the single element value
                templateBlock.elements[0] &&
                (() => {
                  // For single type, the value might be nested: block.value[element.key].value
                  const elementData = block.value
                    ? (block.value as Record<string, unknown>)?.[
                        templateBlock.elements[0].key
                      ]
                    : block.value;
                  const elementValue =
                    typeof elementData === "object" &&
                    elementData !== null &&
                    "value" in elementData
                      ? (elementData as { value: unknown }).value
                      : elementData || block.value;
                  return (
                    <RecordViewValue
                      element={templateBlock.elements[0]}
                      value={elementValue}
                      index={index}
                    />
                  );
                })()}
          </div>
        )}
      </div>
    </div>
  );
};
