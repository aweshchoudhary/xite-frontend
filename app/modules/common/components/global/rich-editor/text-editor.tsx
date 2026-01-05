"use client";
import { SimpleEditor } from "../../tiptap/tiptap-templates/simple/simple-editor";

interface TextEditorProps {
  placeholder?: string;
  formField?: {
    value?: string | null;
    onChange?: (value: string | null) => void;
  };
}

export default function TextEditor({ formField }: TextEditorProps) {
  return (
    <SimpleEditor
      defaultValue={(formField?.value as string) || ""}
      onChange={(content) => formField?.onChange?.(content)}
      isDisabled={false}
    />
  );
}
