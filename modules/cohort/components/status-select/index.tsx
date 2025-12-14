"use client";
import {
  Select,
  SelectContent,
  SelectValue,
  SelectTrigger,
  SelectItem,
} from "@/modules/common/components/ui/select";
import { WorkStatus } from "@/modules/common/database";
import { enumDisplay } from "@/modules/common/lib/enum-display";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function StatusSelect({
  defaultStatus = WorkStatus.ACTIVE,
}: {
  defaultStatus?: WorkStatus;
}) {
  const [value, setValue] = useState<WorkStatus>(defaultStatus);

  const router = useRouter();
  const location = usePathname();

  const handleChange = (value: WorkStatus) => {
    setValue(value);
    router.push(`${location}?status=${value}`);
  };

  return (
    <Select defaultValue={value} value={value} onValueChange={handleChange}>
      <SelectTrigger className="capitalize">
        <SelectValue placeholder="Select a status" />
      </SelectTrigger>
      <SelectContent>
        {Object.values(WorkStatus).map((status) => (
          <SelectItem key={status} value={status} className="capitalize">
            {enumDisplay(status)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
