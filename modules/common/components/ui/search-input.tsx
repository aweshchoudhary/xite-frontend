"use client";

import { Input } from "./input";
import { cn } from "../../lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";

type SearchInputProps = React.ComponentProps<typeof Input>;

export default function SearchInput(props: SearchInputProps) {
  return (
    <div className="w-fit">
      <div className="relative">
        <HugeiconsIcon
          icon={Search01Icon}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-muted-foreground"
        />
        <Input
          type="search"
          placeholder="Search anything..."
          {...props}
          className={cn(props.className, "pl-10!")}
        />
      </div>
    </div>
  );
}
