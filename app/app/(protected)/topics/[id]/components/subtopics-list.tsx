"use client";
import { GetOne } from "@/modules/topic/server/read";
import { Button } from "@ui/button";
import { Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";
import { MoreHorizontal } from "lucide-react";
import DeleteModal from "@/modules/topic/components/forms/subtopic/delete/modal";
import { Badge } from "@ui/badge";
import { useRouter } from "next/navigation";

type SubTopicsListProps = {
  topicId: string;
  subtopics: GetOne["sub_topics"];
};

export default function SubTopicsList({
  topicId,
  subtopics,
}: SubTopicsListProps) {
  const router = useRouter();

  if (subtopics.length === 0) {
    return (
      <div className="w-full rounded-lg flex items-center justify-center h-50 bg-background border-2 border-spacing-3 border-dashed">
        No sub topics found
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {subtopics.map((subtopic) => (
        <SubTopicCard
          key={subtopic.id}
          subtopic={subtopic}
          topicId={topicId}
          onDelete={() => router.refresh()}
        />
      ))}
    </div>
  );
}

function SubTopicCard({
  subtopic,
  topicId,
  onDelete,
}: {
  subtopic: GetOne["sub_topics"][0];
  topicId: string;
  onDelete: () => void;
}) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <>
      <div className="p-5 border rounded-lg bg-background">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-medium">{subtopic.title}</h3>
              {subtopic.taost_id && (
                <Badge variant="outline" className="text-xs">
                  {subtopic.taost_id}
                </Badge>
              )}
            </div>
            {subtopic.description && (
              <p className="text-sm text-muted-foreground mb-3">
                {subtopic.description}
              </p>
            )}
            {subtopic.keywords && subtopic.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {subtopic.keywords.map((keyword) => (
                  <Badge key={keyword} variant="secondary" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-fit">
              <div>
                <Link
                  href={`/topics/${topicId}/subtopics/${subtopic.id}/edit`}
                  className="flex items-center gap-2 capitalize w-full py-2 px-4 hover:bg-accent rounded-md"
                >
                  <Pencil className="size-4" strokeWidth={1.5} />
                  Edit
                </Link>
              </div>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="text-destructive flex items-center w-full gap-2 py-2 px-4 hover:bg-accent rounded-md cursor-pointer"
              >
                <Trash className="size-4 text-destructive" strokeWidth={1.5} />
                Delete
              </button>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <DeleteModal
        recordId={subtopic.id}
        noTrigger
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        onSuccess={onDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </>
  );
}

