"use client";
import { ITemplateElement } from "@microsite-cms/common/services/db/types/interfaces";
import { Input } from "@ui/input";
import { Label } from "@ui/label";
import { Button } from "@ui/button";
import { useRef, useState } from "react";
import { Upload } from "lucide-react";

interface VideoElementProps {
  index: number;
  //  eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: any;
  element: ITemplateElement;
}
export default function VideoElement({
  index,
  element,
  field,
}: VideoElementProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [videoUrl, setVideoUrl] = useState<string | undefined>(
    typeof field.value === "string" && field.value?.startsWith("http")
      ? field.value.replace("http://localhost:3000", "")
      : undefined
  );

  console.log(videoUrl);

  return (
    <div className="space-y-5">
      {videoUrl ? (
        <Label
          className="block p-3 bg-muted rounded-lg border w-fit"
          htmlFor={`${field.name}-${index}-${element.key}`}
        >
          <div className="relative w-full aspect-video h-full">
            <video src={videoUrl} controls className="object-cover size-full" />
          </div>
        </Label>
      ) : null}
      <Button type="button" onClick={() => inputRef.current?.click()}>
        <Upload className="size-4" /> Video
      </Button>
      <Input
        id={`${field.name}-${index}-${element.key}`}
        type="file"
        ref={inputRef}
        aria-invalid={field.invalid}
        accept="video/*"
        className="sr-only"
        onChange={(e) => {
          field.onChange(e.target.files?.[0]);
          const file = e.target.files?.[0];
          if (file) {
            setVideoUrl(URL.createObjectURL(file));
          }
        }}
      />
    </div>
  );
}
