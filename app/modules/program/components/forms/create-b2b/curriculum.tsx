"use client";
import {
  Controller,
  FieldArrayWithId,
  UseFormReturn,
  useFieldArray,
  UseFieldArrayReturn,
} from "react-hook-form";
import { Input } from "@ui/input";
import { Button } from "@ui/button";
import TextEditor from "@/modules/common/components/global/rich-editor/text-editor";
import { Plus } from "lucide-react";
import { Trash } from "lucide-react";
import { Field, FieldError, FieldLabel } from "@ui/field";
import TopicSelectList from "@/modules/cohort/components/topic-select-list";
import SubTopicSelectList from "@/modules/cohort/components/subtopic-select-list";
import { CreateSchema } from "./schema";


export default function Curriculum({
  form
}: {
    form: any;
}) {

  const items = useFieldArray({
    control: form.control,
    name: "curriculum.items",
  });

  return (
    <div className="space-y-5">
        <h2 className="text-sm text-muted-foreground">Curriculum</h2>
        <div className="space-y-5">
        {items.fields.map((field, index) => (
          <Item
            key={field.id}
            form={form}
            field={field}
            index={index}
            items={items}
          />
        ))}

        <Button
          type="button"
          onClick={() =>
            items.append({
              title: "",
              objectives: [],
              sessions: [],
              position: items.fields.length + 1,
            })
          }
          size={"sm"}
          variant={"outline"}
        >
          <Plus className="size-4" />
          Add Module
        </Button>
      </div>
    </div>
  );
}

type ItemProps = {
  form: UseFormReturn<CreateSchema>;
  field: any;
  index: number;
  items: any;
};

const Item = ({ form, index, items }: ItemProps) => {
  const curriculumObjectives = useFieldArray({
    control: form.control,
    name: `curriculum.items.${index}.objectives`,
  });

  const sessions = useFieldArray({
    control: form.control,
    name: `curriculum.items.${index}.sessions`,
  });

  return (
    <div className="bg-gray-50 border p-5 rounded-xl">
      <div className="mb-5 pb-3 border-b flex items-center justify-between">
        <h2 className="text-xl font-semibold">Module #{index + 1}</h2>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => items.remove(index)}
          className="text-destructive hover:text-destructive/80"
        >
          <Trash className="size-4" />
          Remove Module
        </Button>
      </div>

      <div>
        <Controller
          control={form.control}
          name={`curriculum.items.${index}.title`}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Input
                placeholder="Module Title"
                {...field}
                value={field.value || ""}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
      <div className="space-y-2 grid grid-cols-2 mt-5 gap-5">
        <div>
          <h2>Overview</h2>
          <Controller
            control={form.control}
            name={`curriculum.items.${index}.overview`}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <TextEditor placeholder="Overview" formField={field} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
        <div>
          <h2 className="mb-2">Objectives</h2>
          <div className="space-y-2">
            {curriculumObjectives.fields.map(
              (objectiveField, objectiveIndex) => (
                <div key={objectiveField.id}>
                  <Controller
                    control={form.control}
                    name={`curriculum.items.${index}.objectives.${objectiveIndex}.description`}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <div className="flex items-center gap-2">
                          <Input
                            placeholder="Objective"
                            {...field}
                            value={field.value || ""}
                          />
                          <Button
                            variant="ghost"
                            className="text-destructive hover:text-destructive/80"
                            type="button"
                            size="icon"
                            onClick={() =>
                              curriculumObjectives.remove(objectiveIndex)
                            }
                          >
                            <Trash className="size-4" />
                          </Button>
                        </div>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>
              )
            )}
          </div>

          <Button
            className="mt-5"
            type="button"
            size={"sm"}
            variant={"outline"}
            onClick={() =>
              curriculumObjectives.append({
                description: "",
                position: curriculumObjectives.fields.length + 1,
              })
            }
          >
            <Plus className="size-4" />
            Add Objective
          </Button>
        </div>
      </div>

      <hr className="mt-5" />

      <div className="mt-5 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Sessions</h2>

          <Button
            type="button"
            onClick={() =>
              sessions.append({
                title: "",
                objectives: [],
                position: sessions.fields.length + 1,
                topic_id: null,
                sub_topic_id: null,
              })
            }
            size={"sm"}
            variant={"outline"}
          >
            <Plus className="size-4" /> New Session
          </Button>
        </div>

        {sessions.fields.map((sessionField, sessionIndex) => (
          <Session
            key={sessionField.id}
            form={form}
            field={sessionField}
            itemIndex={index}
            sessionIndex={sessionIndex}
            sessionItems={sessions}
          />
        ))}

        {sessions.fields.length === 0 && (
          <div className="text-sm text-gray-500 text-center border-2 border-dashed rounded-lg p-5">
            No sessions added yet.
          </div>
        )}
      </div>
    </div>
  );
};

type SessionProps = {
  form: UseFormReturn<CreateSchema>;
  field: any;
  itemIndex: number;
  sessionIndex: number;
  sessionItems: any;
};

const Session = ({
  form,
  itemIndex,
  sessionIndex,
  sessionItems,
}: SessionProps) => {
  const sessionObjectives = useFieldArray({
    control: form.control,
    name: `curriculum.items.${itemIndex}.sessions.${sessionIndex}.objectives`,
  });

  return (
    <div className="bg-white shadow-md border p-5 rounded-xl">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Session #{sessionIndex + 1}</h3>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => sessionItems.remove(sessionIndex)}
          className="text-destructive hover:text-destructive/80"
        >
          {" "}
          <Trash className="size-4" />
          Remove Session
        </Button>
      </div>

      <div className="space-y-4">
        <Controller
          control={form.control}
          name={`curriculum.items.${itemIndex}.sessions.${sessionIndex}.title`}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Input
                placeholder="Session Title"
                {...field}
                value={field.value || ""}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Topic</FieldLabel>
            <Controller
              control={form.control}
              name={`curriculum.items.${itemIndex}.sessions.${sessionIndex}.topic_id`}
              render={({ field, fieldState }) => (
                <>
                  <TopicSelectList
                    onChange={(value) => {
                      field.onChange(value);
                      // Clear subtopic when topic changes
                      form.setValue(
                        `curriculum.items.${itemIndex}.sessions.${sessionIndex}.sub_topic_id`,
                        null
                      );
                    }}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </>
              )}
            />
          </Field>

          <Field>
            <FieldLabel>SubTopic</FieldLabel>
            <Controller
              control={form.control}
              name={`curriculum.items.${itemIndex}.sessions.${sessionIndex}.sub_topic_id`}
              render={({ field, fieldState }) => {
                const topicId = form.watch(
                  `curriculum.items.${itemIndex}.sessions.${sessionIndex}.topic_id`
                );
                return (
                  <>
                    <SubTopicSelectList
                      onChange={field.onChange}
                      topicId={topicId}
                      disabled={!topicId}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </>
                );
              }}
            />
          </Field>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-10">
        <div>
          <h4 className="border-b my-5 pb-3">Session Overview</h4>
          <Controller
            control={form.control}
            name={`curriculum.items.${itemIndex}.sessions.${sessionIndex}.overview`}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <TextEditor placeholder="Overview" formField={field} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
        <div className="space-y-2">
          <h4 className="border-b my-5 pb-3">Session Objectives</h4>
          {sessionObjectives.fields.map((objectiveField, objectiveIndex) => (
            <div key={objectiveField.id}>
              <Controller
                control={form.control}
                name={`curriculum.items.${itemIndex}.sessions.${sessionIndex}.objectives.${objectiveIndex}.description`}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Objective"
                        {...field}
                        value={field.value || ""}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => sessionObjectives.remove(objectiveIndex)}
                        className="text-destructive hover:text-destructive/80"
                        type="button"
                      >
                        <Trash className="size-4" />
                      </Button>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          ))}

          <Button
            type="button"
            onClick={() =>
              sessionObjectives.append({
                description: "",
                position: sessionObjectives.fields.length + 1,
              })
            }
            size={"sm"}
            variant={"outline"}
            className="mt-3"
          >
            <Plus className="size-4" />
            Add Objective
          </Button>
        </div>
      </div>
    </div>
  );
};
