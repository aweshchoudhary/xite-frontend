"use client";
import { Copy } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";

export default function CopyText({
  children,
  value,
}: {
  children: React.ReactNode;
  value: string;
}) {
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard");
  };

  return (
    <button
      className="max-w-full w-fit gap-2! p-0! border-0! flex items-center"
      onClick={handleCopy}
    >
      <span className="truncate">{children}</span> <Copy className="size-3" />
    </button>
  );
}
