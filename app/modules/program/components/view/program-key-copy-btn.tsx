"use client";
import { Copy } from "lucide-react";
import { toast } from "sonner";

export default function ProgramKeyCopyBtn({
  programKey,
}: {
  programKey: string;
}) {
  return (
    <div
      onClick={() => {
        navigator.clipboard.writeText(programKey);
        toast.success("Program key copied to clipboard");
      }}
      className="flex items-center gap-2 rounded-md mt-3 w-fit text-sm cursor-pointer"
    >
      <Copy className="size-4" />
      <p>{programKey}</p>
    </div>
  );
}
