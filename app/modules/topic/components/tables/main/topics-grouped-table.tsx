"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/table";
import { Button } from "@ui/button";
import { ChevronRight, ChevronDown, Plus, X, Trash2 } from "lucide-react";
import Link from "next/link";
import { MODULE_PATH } from "@/modules/topic/contants";
import type { GetOne } from "../../forms/read/action";
import { cn } from "@/modules/common/lib/utils";
import { Input } from "@ui/input";
import { createAction as createTopicAction } from "../../forms/create/action";
import { createAction as createSubTopicAction } from "../../forms/subtopic/create/action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import DeleteModal from "../../forms/delete/modal";
import SubTopicDeleteModal from "../../forms/subtopic/delete/modal";

interface TopicsGroupedTableProps {
  data: GetOne[];
}

export default function TopicsGroupedTable({ data }: TopicsGroupedTableProps) {
  const router = useRouter();
  const [expandedTopics, setExpandedTopics] = React.useState<Set<string>>(
    new Set()
  );
  const [creatingTopic, setCreatingTopic] = React.useState(false);
  const [creatingSubTopic, setCreatingSubTopic] = React.useState<string | null>(
    null
  );
  const [newTopicTitle, setNewTopicTitle] = React.useState("");
  const [newSubTopicTitle, setNewSubTopicTitle] = React.useState("");
  const [newSubTopicTaostId, setNewSubTopicTaostId] = React.useState("");
  const [deleteTopicId, setDeleteTopicId] = React.useState<string | null>(null);
  const [deleteSubTopicId, setDeleteSubTopicId] = React.useState<string | null>(
    null
  );

  const toggleTopic = (topicId: string) => {
    setExpandedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(topicId)) {
        next.delete(topicId);
      } else {
        next.add(topicId);
      }
      return next;
    });
  };

  const isExpanded = (topicId: string) => expandedTopics.has(topicId);

  const handleCreateTopic = async () => {
    if (!newTopicTitle.trim()) {
      toast.error("Title is required");
      return;
    }

    const result = await createTopicAction({
      title: newTopicTitle.trim(),
      description: null,
    });

    if (result.data) {
      toast.success("Topic created successfully");
      setNewTopicTitle("");
      setCreatingTopic(false);
      router.refresh();
    } else {
      toast.error(result.error || "Failed to create topic");
    }
  };

  const handleCreateSubTopic = async (topicId: string) => {
    if (!newSubTopicTitle.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!newSubTopicTaostId.trim()) {
      toast.error("Taost ID is required");
      return;
    }

    const result = await createSubTopicAction({
      title: newSubTopicTitle.trim(),
      description: null,
      taost_id: newSubTopicTaostId.trim(),
      topic_id: topicId,
      keywords: [],
    });

    if (result.data) {
      toast.success("SubTopic created successfully");
      setNewSubTopicTitle("");
      setNewSubTopicTaostId("");
      setCreatingSubTopic(null);
      router.refresh();
    } else {
      toast.error(result.error || "Failed to create subtopic");
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="text-right">Sub Topics</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center">
                No topics found.
              </TableCell>
            </TableRow>
          ) : (
            data
              .sort(
                (a, b) =>
                  new Date(b.updated_at).getTime() -
                  new Date(a.updated_at).getTime()
              )
              .reverse()
              .map((topic) => {
                const hasSubTopics = topic.sub_topics.length > 0;
                const expanded = isExpanded(topic.id);

                return (
                  <React.Fragment key={topic.id}>
                    {/* Topic Row (Parent) */}
                    <TableRow
                      className={cn(
                        "bg-gray-50 hover:bg-gray-100",
                        expanded && "bg-gray-100"
                      )}
                    >
                      <TableCell className="w-12">
                        {hasSubTopics ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => toggleTopic(topic.id)}
                          >
                            {expanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        ) : (
                          <div className="w-6" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`${MODULE_PATH}/${topic.id}`}
                          className="font-medium hover:underline"
                        >
                          {topic.title}
                        </Link>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-sm text-muted-foreground">
                            {topic.sub_topics.length}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-destructive hover:text-destructive"
                            onClick={() => setDeleteTopicId(topic.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* SubTopic Rows (Children) */}
                    {expanded &&
                      topic.sub_topics.map((subTopic) => (
                        <TableRow
                          key={subTopic.id}
                          className="bg-white hover:bg-gray-50"
                        >
                          <TableCell className="w-12">
                            <div className="flex items-center justify-center"></div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 pl-6">
                              <Link
                                href={`${MODULE_PATH}/${topic.id}/subtopics/${subTopic.id}/edit`}
                                className="hover:underline text-sm"
                              >
                                {subTopic.title}
                              </Link>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-destructive hover:text-destructive"
                              onClick={() => setDeleteSubTopicId(subTopic.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}

                    {/* Create SubTopic Row */}
                    {expanded && creatingSubTopic === topic.id && (
                      <TableRow className="bg-blue-50">
                        <TableCell className="w-12">
                          <div className="flex items-center justify-center"></div>
                        </TableCell>
                        <TableCell colSpan={2}>
                          <div className="flex items-center gap-2 pl-6">
                            <Input
                              placeholder="SubTopic Title"
                              value={newSubTopicTitle}
                              onChange={(e) =>
                                setNewSubTopicTitle(e.target.value)
                              }
                              className="max-w-xs"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleCreateSubTopic(topic.id);
                                }
                              }}
                            />
                            <Input
                              placeholder="Taost ID"
                              value={newSubTopicTaostId}
                              onChange={(e) =>
                                setNewSubTopicTaostId(e.target.value)
                              }
                              className="max-w-xs"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleCreateSubTopic(topic.id);
                                }
                              }}
                            />
                            <Button
                              size="sm"
                              onClick={() => handleCreateSubTopic(topic.id)}
                            >
                              Create
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setCreatingSubTopic(null);
                                setNewSubTopicTitle("");
                                setNewSubTopicTaostId("");
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}

                    {/* Add SubTopic Button Row */}
                    {expanded && creatingSubTopic !== topic.id && (
                      <TableRow className="bg-white hover:bg-gray-50">
                        <TableCell className="w-12">
                          <div className="flex items-center justify-center"></div>
                        </TableCell>
                        <TableCell colSpan={2}>
                          <div className="pl-6">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setCreatingSubTopic(topic.id);
                                setExpandedTopics((prev) => {
                                  const next = new Set(prev);
                                  next.add(topic.id);
                                  return next;
                                });
                              }}
                              className="text-muted-foreground"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add SubTopic
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })
          )}

          {/* Create Topic Row */}
          {creatingTopic ? (
            <TableRow className="bg-blue-50">
              <TableCell className="w-12"></TableCell>
              <TableCell colSpan={2}>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Topic Title"
                    value={newTopicTitle}
                    onChange={(e) => setNewTopicTitle(e.target.value)}
                    className="max-w-xs"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleCreateTopic();
                      }
                    }}
                  />
                  <Button size="sm" onClick={handleCreateTopic}>
                    Create
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setCreatingTopic(false);
                      setNewTopicTitle("");
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            <TableRow className="bg-gray-50 hover:bg-gray-100">
              <TableCell className="w-12"></TableCell>
              <TableCell colSpan={2}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCreatingTopic(true)}
                  className="text-muted-foreground"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Topic
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Delete Topic Modal */}
      {deleteTopicId && (
        <DeleteModal
          recordId={deleteTopicId}
          noTrigger
          isOpen={!!deleteTopicId}
          setIsOpen={(open) => {
            if (!open) setDeleteTopicId(null);
          }}
          onSuccess={() => {
            setDeleteTopicId(null);
            router.refresh();
          }}
          onCancel={() => setDeleteTopicId(null)}
        />
      )}

      {/* Delete SubTopic Modal */}
      {deleteSubTopicId && (
        <SubTopicDeleteModal
          recordId={deleteSubTopicId}
          noTrigger
          isOpen={!!deleteSubTopicId}
          setIsOpen={(open) => {
            if (!open) setDeleteSubTopicId(null);
          }}
          onSuccess={() => {
            setDeleteSubTopicId(null);
            router.refresh();
          }}
          onCancel={() => setDeleteSubTopicId(null)}
        />
      )}
    </div>
  );
}
