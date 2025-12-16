"use client";
import { ITemplateElement } from "@microsite-cms/common/services/db/types/interfaces";
import { Input } from "@ui/input";
import Image from "next/image";
import { Label } from "@ui/label";
import { Button } from "@ui/button";
import { useRef, useState } from "react";
import { Upload } from "lucide-react";

interface ImageElementProps {
  index: number;
  //  eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: any;
  element: ITemplateElement;
}
export default function ImageElement({
  index,
  element,
  field,
}: ImageElementProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState<string | undefined>(
    typeof field.value === "string" && field.value?.startsWith("http")
      ? field.value.replace("http://localhost:3000", "")
      : undefined
  );

  console.log(imageUrl);

  return (
    <div className="space-y-5">
      {imageUrl ? (
        <Label
          className="block p-3 bg-muted rounded-lg border w-fit"
          htmlFor={`${field.name}-${index}-${element.key}`}
        >
          <div className="relative w-30 aspect-square h-full object-cover">
            <Image
              src={imageUrl}
              alt={element.title}
              fill
              className="object-cover size-full"
            />
          </div>
        </Label>
      ) : null}
      <Button type="button" onClick={() => inputRef.current?.click()}>
        <Upload className="size-4" /> Image
      </Button>
      <Input
        id={`${field.name}-${index}-${element.key}`}
        type="file"
        ref={inputRef}
        aria-invalid={field.invalid}
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          field.onChange(e.target.files?.[0]);
          const file = e.target.files?.[0];
          if (file) {
            setImageUrl(URL.createObjectURL(file));
          }
        }}
      />
    </div>
  );
}
