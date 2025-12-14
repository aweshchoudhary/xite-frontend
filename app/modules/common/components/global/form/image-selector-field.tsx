import { UseFormReturn } from "react-hook-form";
import { Label } from "../../ui/label";
import ImageSelector from "../image-selector";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { generatePreviewUrl } from "@/modules/common/lib/img-preview-url-generator";
import { cn, getImageUrl } from "@/modules/common/lib/utils";

type Props = {
  form: UseFormReturn<any>;
  field: any;
  imageUrlFieldName: string;
  imageFileFieldName: string;
  className?: string;
  imageClassName?: string;
};

export default function ImageSelectorField({
  form,
  field,
  imageUrlFieldName,
  imageFileFieldName,
  imageClassName,
  className,
}: Props) {
  return (
    <Label
      htmlFor={imageFileFieldName}
      className="cursor-pointer hover:opacity-70 group gap-0"
    >
      <ImageSelector
        fieldName={imageFileFieldName}
        setSelectedImage={(image) => {
          field.onChange(image);
        }}
      />
      <div
        className={cn(
          "size-12 bg-accent rounded-full flex items-center justify-center",
          className
        )}
      >
        {form.watch(imageFileFieldName) ? (
          <Image
            src={generatePreviewUrl(form.watch(imageFileFieldName)!) ?? ""}
            alt="Benefit Icon"
            width={200}
            height={200}
            className={cn("rounded-full", imageClassName)}
          />
        ) : form.getValues(imageUrlFieldName) ? (
          <Image
            src={getImageUrl(form.getValues(imageUrlFieldName) || "")}
            alt="Benefit Icon"
            width={200}
            height={200}
            className={cn(
              "rounded-full object-contain size-full",
              imageClassName
            )}
          />
        ) : (
          <ImageIcon
            className="size-7 text-muted-foreground group-hover:scale-110 transition-all"
            strokeWidth={1}
          />
        )}
      </div>
    </Label>
  );
}
