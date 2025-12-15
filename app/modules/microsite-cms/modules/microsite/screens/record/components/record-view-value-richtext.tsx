"use client";

interface RecordViewValueRichtextProps {
  value: string;
}
export default function RecordViewValueRichtext({
  value,
}: RecordViewValueRichtextProps) {
  return (
    <div className="p-5 bg-muted rounded-md border">
      <div
        className="prose dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: value || "" }}
      ></div>
    </div>
  );
}
