"use client";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { MicrositeFormInput } from "@microsite-cms/common/services/db/actions/microsite/schema";
import { Button } from "@ui/button";
import { Plus, Square, List } from "lucide-react";
import {
  ITemplateBlock,
  ITemplateElement,
} from "@microsite-cms/common/services/db/types/interfaces";
import { Separator } from "@ui/separator";
import ElementWrapper from "./elements/element-wrapper";
import { Badge } from "@ui/badge";

type FieldArrayName =
  | `pages.${number}.sections.${number}.blocks`
  | `globalSections.${number}.blocks`;

interface FormBlockProps {
  form: UseFormReturn<MicrositeFormInput>;
  fieldArrayName: FieldArrayName;
  templateBlocks: ITemplateBlock[];
}

export default function FormBlock({
  form,
  fieldArrayName,
  templateBlocks,
}: FormBlockProps) {
  const blockFields = useFieldArray({
    control: form.control,
    name: fieldArrayName,
  });

  return (
    <div>
      <header className="flex items-center justify-between py-5">
        <h2 className="text-muted-foreground font-medium">Blocks</h2>
      </header>

      <div className="space-y-5 p-8 bg-accent/40 rounded-lg border-2 border-dashed border-border/50">
        {blockFields.fields.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Square className="size-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No blocks available</p>
          </div>
        ) : (
          blockFields.fields.map((_, index) => {
            const templateBlock = templateBlocks.find(
              (b) => b.key === form.getValues(`${fieldArrayName}.${index}.key`)
            );
            return (
              <FormBlockItem
                key={index}
                form={form}
                index={index}
                fieldArrayName={fieldArrayName}
                templateBlock={templateBlock}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

interface FormBlockItemProps {
  form: UseFormReturn<MicrositeFormInput>;
  index: number;
  fieldArrayName: FieldArrayName;
  templateBlock?: ITemplateBlock;
}

const FormBlockItem = ({
  form,
  index,
  fieldArrayName,
  templateBlock,
}: FormBlockItemProps) => {
  const blockType = form.getValues(`${fieldArrayName}.${index}.type`);
  const isRepeatable = form.getValues(`${fieldArrayName}.${index}.repeatable`);

  if (!templateBlock) {
    return null;
  }

  return (
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
            {blockType === "group" ? "Group block" : "Single block"}
          </Badge>
          {isRepeatable && (
            <Badge
              variant="secondary"
              className="text-[11px] uppercase tracking-wide"
            >
              Repeatable
            </Badge>
          )}
        </div>
      </div>

      <div className="space-y-5">
        {blockType === "single" && !isRepeatable && (
          <>
            <FormSingleValue
              form={form}
              fieldArrayName={fieldArrayName}
              index={index}
              element={templateBlock.elements[0]}
            />
          </>
        )}

        {blockType === "group" && !isRepeatable && (
          <FormGroupValue
            form={form}
            fieldArrayName={fieldArrayName}
            index={index}
            elements={templateBlock.elements}
          />
        )}

        {isRepeatable && (
          <FormRepeatableItems
            form={form}
            fieldArrayName={fieldArrayName}
            index={index}
            elements={templateBlock.elements}
          />
        )}
      </div>
    </div>
  );
};

interface FormSingleValueProps {
  form: UseFormReturn<MicrositeFormInput>;
  fieldArrayName: FieldArrayName;
  index: number;
  element: ITemplateElement;
}

const FormSingleValue = ({
  form,
  fieldArrayName,
  index,
  element,
}: FormSingleValueProps) => {
  return (
    <div className="space-y-4">
      <ElementWrapper
        form={form}
        fieldArrayName={`${fieldArrayName}.${index}.value.${element.key}`}
        index={index}
        element={element}
        type={element.type}
      />
    </div>
  );
};

interface FormGroupValueProps {
  form: UseFormReturn<MicrositeFormInput>;
  fieldArrayName: FieldArrayName;
  index: number;
  elements: ITemplateElement[];
}

const FormGroupValue = ({
  form,
  fieldArrayName,
  index,
  elements,
}: FormGroupValueProps) => {
  return (
    <div className="space-y-4">
      {elements.map((element, elementIndex) => (
        <ElementWrapper
          key={element.key}
          form={form}
          fieldArrayName={`${fieldArrayName}.${index}.value.${element.key}`}
          index={index}
          element={element}
          type={element.type}
        />
      ))}
    </div>
  );
};

interface FormRepeatableItemsProps {
  form: UseFormReturn<MicrositeFormInput>;
  fieldArrayName: FieldArrayName;
  index: number;
  elements: ITemplateElement[];
}

const FormRepeatableItems = ({
  form,
  fieldArrayName,
  index,
  elements,
}: FormRepeatableItemsProps) => {
  const itemsFields = useFieldArray({
    control: form.control,
    name: `${fieldArrayName}.${index}.items`,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium flex items-center gap-2">
            <List className="size-4" />
            Items
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Add or remove items from this repeatable block
          </p>
        </div>
        <Button
          onClick={() => {
            const newItem: { data: Record<string, unknown> } = {
              data: {},
            };
            elements.forEach((el) => {
              newItem.data[el.key] = "";
            });
            itemsFields.append(newItem);
          }}
          type="button"
          variant="secondary"
          size="sm"
          className="gap-2"
        >
          <Plus className="size-4" />
          Add Item
        </Button>
      </div>

      <Separator />

      {itemsFields.fields.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
          <List className="size-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No items added yet</p>
          <p className="text-xs mt-1">
            Click &quot;Add Item&quot; to create your first item
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {itemsFields.fields.map((_, itemIndex) => (
            <div key={itemIndex} className="relative group/item">
              <div className="space-y-4">
                {elements.map((element, elementIndex) => (
                  <ElementWrapper
                    key={element.key}
                    form={form}
                    fieldArrayName={`${fieldArrayName}.${index}.items.${itemIndex}.data.${element.key}`}
                    index={elementIndex}
                    element={element}
                    type={element.type}
                    label={`${element.title} ${itemIndex + 1}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
