"use client";
import { Field, FieldError, FieldGroup, FieldLabel } from "@ui/field";
import { Input } from "@ui/input";
import {
  Controller,
  UseFieldArrayReturn,
  UseFormReturn,
  useFieldArray,
} from "react-hook-form";
import { TemplateFormInput } from "@microsite-cms/common/services/db/actions/template/schema";
import { Button } from "@ui/button";
import { PlusIcon, TrashIcon } from "lucide-react";
import { Checkbox } from "@ui/checkbox";
import slugify from "slugify";
import FormSingleElement from "./form-element-single";
import FormElementGroup from "./form-element-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu";
import { Badge } from "@ui/badge";

type FieldArrayName =
  | `pages.${number}.sections.${number}.blocks`
  | `globalSections.${number}.blocks`;

interface FormBlockProps {
  form: UseFormReturn<TemplateFormInput>;
  fieldArrayName: FieldArrayName;
}

export default function FormBlock({ form, fieldArrayName }: FormBlockProps) {
  const blockFields = useFieldArray({
    control: form.control,
    name: fieldArrayName,
  });
  return (
    <div>
      <header className="flex items-center justify-between py-5">
        <h2 className="text-muted-foreground font-medium">Blocks</h2>
        <div>
          <FormBlockAddButton
            fieldArray={blockFields}
            index={blockFields.fields.length}
          />
        </div>
      </header>

      <div className="space-y-5 p-8 bg-accent/40 rounded-lg border-2 border-dashed border-border/50">
        {blockFields.fields.map((_, index) => (
          <div key={index} className="relative group/block-item">
            <FormBlockItem
              key={index}
              form={form}
              index={index}
              blockFields={blockFields}
              fieldArrayName={fieldArrayName}
            />
            <div className="absolute -bottom-4 z-50 right-1/2 -translate-x-1/2 opacity-0 group-hover/block-item:opacity-100 transition-all">
              <FormBlockAddButton fieldArray={blockFields} index={index} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface FormBlockItemProps {
  form: UseFormReturn<TemplateFormInput>;
  index: number;
  blockFields: UseFieldArrayReturn<TemplateFormInput, FieldArrayName>;
  fieldArrayName: FieldArrayName;
  setIsRepeatable?: (isRepeatable: boolean) => void;
}

const FormBlockItem = ({
  form,
  index,
  blockFields,
  fieldArrayName,
}: FormBlockItemProps) => {
  const blockType = form.watch(`${fieldArrayName}.${index}.type`);
  const isRepeatable = form.watch(`${fieldArrayName}.${index}.repeatable`);

  return (
    <div>
      <div className="w-full p-12 relative group/block-item border border-border/50 shadow-xs bg-background rounded-lg space-y-5">
        <Button
          onClick={() => blockFields.remove(index)}
          size="sm"
          variant="outline"
          type="button"
          className="absolute top-3 z-50 right-3 text-destructive opacity-0 group-hover/block-item:opacity-100 transition-all"
        >
          <TrashIcon className="size-3.5" />
          Block
        </Button>

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

        <div className="grid grid-cols-3 items-center gap-5">
          <FieldGroup>
            <Controller
              name={`${fieldArrayName}.${index}.title`}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`block-title-${index}`}>
                    Block Title
                  </FieldLabel>
                  <Input
                    {...field}
                    id={`block-title-${index}`}
                    aria-invalid={fieldState.invalid}
                    onChange={(e) => {
                      field.onChange(e);
                      const slug = slugify(e.target.value, { lower: true });
                      form.setValue(`${fieldArrayName}.${index}.key`, slug);

                      if (
                        form.getValues(`${fieldArrayName}.${index}.type`) ===
                        "single"
                      ) {
                        form.setValue(`${fieldArrayName}.${index}.elements.0`, {
                          key: `${slug}`,
                          title: e.target.value,
                          type: "text",
                          required: false,
                        });
                        form.trigger(`${fieldArrayName}.${index}.elements`);
                      }

                      form.trigger(`${fieldArrayName}.${index}.key`);
                    }}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          <FieldGroup>
            <Controller
              name={`${fieldArrayName}.${index}.key`}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`block-key-${index}`}>
                    Block Key
                  </FieldLabel>
                  <Input
                    {...field}
                    id={`block-key-${index}`}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          <FieldGroup>
            <Controller
              name={`${fieldArrayName}.${index}.repeatable`}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex items-center gap-2">
                    {" "}
                    <Checkbox
                      id={`block-repeatable-${index}`}
                      checked={!!field.value}
                      aria-invalid={fieldState.invalid}
                      onCheckedChange={(checked) => {
                        const isTrue = checked === true;

                        field.onChange(isTrue);
                      }}
                    />
                    <FieldLabel htmlFor={`block-repeatable-${index}`}>
                      Repeatable
                    </FieldLabel>
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </div>

        {form.getValues(`${fieldArrayName}.${index}.type`) === "group" ? (
          <FormElementGroup
            form={form}
            fieldArrayName={`${fieldArrayName}.${index}.elements`}
          />
        ) : (
          <FormSingleElement
            form={form}
            fieldArrayName={`${fieldArrayName}.${index}.elements`}
          />
        )}
      </div>
    </div>
  );
};

interface FormBlockAddButtonProps {
  fieldArray: UseFieldArrayReturn<TemplateFormInput, FieldArrayName>;
  index: number;
}

const FormBlockAddButton = ({ fieldArray, index }: FormBlockAddButtonProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-full shadow">
          <PlusIcon className="size-4" />
          Block
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() =>
            fieldArray.insert(index + 1, {
              key: "",
              title: "",
              repeatable: false,
              type: "single",
              elements: [
                {
                  key: "",
                  title: "",
                  type: "text",
                  required: true,
                },
              ],
            })
          }
        >
          <div>
            <p>Single</p>
            <p className="text-sm text-muted-foreground">
              A block with a single element
            </p>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            fieldArray.insert(index + 1, {
              key: "",
              title: "",
              repeatable: false,
              type: "group",
              elements: [
                {
                  key: "",
                  title: "",
                  type: "text",
                  required: true,
                },
              ],
            })
          }
        >
          <div>
            <p>Group</p>
            <p className="text-sm text-muted-foreground">
              A block with a group of elements
            </p>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
