"use client";
import { ITemplateElement } from "@/modules/common/services/db/types/interfaces";
import { Input } from "@/modules/common/components/ui/input";
import { Label } from "@/modules/common/components/ui/label";
import { Button } from "@/modules/common/components/ui/button";
import { useRef, useState } from "react";
import { File, Upload } from "lucide-react";

interface FileElementProps {
  index: number;
  //  eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: any;
  element: ITemplateElement;
}
export default function FileElement({
  index,
  element,
  field,
}: FileElementProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileUrl, setFileUrl] = useState<string | undefined>(
    typeof field.value === "string" && field.value?.startsWith("http")
      ? field.value
      : undefined
  );

  console.log(fileUrl);

  return (
    <div className="space-y-5">
      {/* No preview for files direct download option */}
      {fileUrl ? (
        <Label
          className="block px-5 py-3 bg-muted rounded-lg border w-fit"
          htmlFor={`${field.name}-${index}-${element.key}`}
        >
          <a href={fileUrl} download>
            <Button variant="ghost">
              <File className="size-4" />
              Download
            </Button>
          </a>
        </Label>
      ) : null}
      <Button type="button" onClick={() => inputRef.current?.click()}>
        <Upload className="size-4" /> File
      </Button>
      <Input
        id={`${field.name}-${index}-${element.key}`}
        type="file"
        ref={inputRef}
        aria-invalid={field.invalid}
        accept="*"
        className="sr-only"
        onChange={(e) => {
          field.onChange(e.target.files?.[0]);
          const file = e.target.files?.[0];
          if (file) {
            setFileUrl(URL.createObjectURL(file));
          }
        }}
      />
    </div>
  );
}
