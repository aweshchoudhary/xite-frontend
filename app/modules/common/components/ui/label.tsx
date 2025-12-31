"use client";

import * as React from "react";
import { Label as LabelPrimitive } from "radix-ui";

import { cn } from "@/modules/common/lib/utils";

function Label({
  className,
  isRequired,
  children,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> & {
  isRequired?: boolean;
}) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "gap-2 text-sm leading-none font-medium group-data-[disabled=true]:opacity-50 peer-disabled:opacity-50 flex items-center select-none group-data-[disabled=true]:pointer-events-none peer-disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      {children}
      {isRequired && (
        <span className="text-destructive ml-0.5" aria-label="required">
          *
        </span>
      )}
    </LabelPrimitive.Root>
  );
}

export { Label };
