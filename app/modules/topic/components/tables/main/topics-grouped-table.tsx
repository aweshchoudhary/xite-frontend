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
import {
  ChevronRight,
  ChevronDown,
  Plus,
  X,
  Trash2,
  Pencil,
  Check,
} from "lucide-react";
import Link from "next/link";
import { MODULE_PATH } from "@/modules/topic/contants";
import type { GetOne } from "../../forms/read/action";
import { cn } from "@/modules/common/lib/utils";
import { Input } from "@ui/input";
import { createAction as createTopicAction } from "../../forms/create/action";
import { createAction as createSubTopicAction } from "../../forms/subtopic/create/action";
import { updateAction as updateTopicAction } from "../../forms/update/action";
import { updateAction as updateSubTopicAction } from "../../forms/subtopic/update/action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import DeleteModal from "../../forms/delete/modal";
import SubTopicDeleteModal from "../../forms/subtopic/delete/modal";
import { Badge } from "@ui/badge";

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
  const [editingTopicId, setEditingTopicId] = React.useState<string | null>(
    null
  );
  const [editingSubTopicId, setEditingSubTopicId] = React.useState<
    string | null
  >(null);
  const [editTopicTitle, setEditTopicTitle] = React.useState("");
  const [editSubTopicTitle, setEditSubTopicTitle] = React.useState("");
  const [editSubTopicTaostId, setEditSubTopicTaostId] = React.useState("");
  const [editSubTopicKeywords, setEditSubTopicKeywords] = React.useState<
    string[]
  >([]);
  const [newKeyword, setNewKeyword] = React.useState("");

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

  const handleStartEditTopic = (topic: GetOne) => {
    setEditingTopicId(topic.id);
    setEditTopicTitle(topic.title);
  };

  const handleCancelEditTopic = () => {
    setEditingTopicId(null);
    setEditTopicTitle("");
  };

  const handleSaveTopic = async (topicId: string) => {
    if (!editTopicTitle.trim()) {
      toast.error("Title is required");
      return;
    }

    const result = await updateTopicAction(
      {
        id: topicId,
        title: editTopicTitle.trim(),
        description: null,
      },
      topicId
    );

    if (result.data) {
      toast.success("Topic updated successfully");
      setEditingTopicId(null);
      setEditTopicTitle("");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to update topic");
    }
  };

  const handleStartEditSubTopic = (subTopic: GetOne["sub_topics"][0]) => {
    setEditingSubTopicId(subTopic.id);
    setEditSubTopicTitle(subTopic.title);
    setEditSubTopicTaostId(subTopic.taost_id);
    setEditSubTopicKeywords([...(subTopic.keywords || [])]);
    setNewKeyword("");
  };

  const handleCancelEditSubTopic = () => {
    setEditingSubTopicId(null);
    setEditSubTopicTitle("");
    setEditSubTopicTaostId("");
    setEditSubTopicKeywords([]);
    setNewKeyword("");
  };

  const handleSaveSubTopic = async (subTopicId: string, topicId: string) => {
    if (!editSubTopicTitle.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!editSubTopicTaostId.trim()) {
      toast.error("Taost ID is required");
      return;
    }

    const result = await updateSubTopicAction(
      {
        id: subTopicId,
        title: editSubTopicTitle.trim(),
        description: null,
        taost_id: editSubTopicTaostId.trim(),
        topic_id: topicId,
        keywords: editSubTopicKeywords,
      },
      subTopicId
    );

    if (result.data) {
      toast.success("SubTopic updated successfully");
      setEditingSubTopicId(null);
      setEditSubTopicTitle("");
      setEditSubTopicTaostId("");
      setEditSubTopicKeywords([]);
      setNewKeyword("");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to update subtopic");
    }
  };

  const handleAddKeyword = () => {
    const trimmedKeyword = newKeyword.trim();
    if (trimmedKeyword) {
      setEditSubTopicKeywords((prev) => {
        // Check if keyword already exists (case-insensitive)
        const exists = prev.some(
          (k) => k.toLowerCase() === trimmedKeyword.toLowerCase()
        );
        if (!exists) {
          return [...prev, trimmedKeyword];
        } else {
          toast.error("Keyword already exists");
          return prev;
        }
      });
      setNewKeyword("");
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setEditSubTopicKeywords((prev) => prev.filter((k) => k !== keyword));
  };

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Keywords</TableHead>
            <TableHead>Taost ID</TableHead>
            <TableHead className="text-right">Sub Topics</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No topics found.
              </TableCell>
            </TableRow>
          ) : (
            data
              .sort((a, b) => a.title.localeCompare(b.title))
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
                        {editingTopicId === topic.id ? (
                          <div className="flex items-center gap-2">
                            <Input
                              value={editTopicTitle}
                              onChange={(e) =>
                                setEditTopicTitle(e.target.value)
                              }
                              className="max-w-xs"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleSaveTopic(topic.id);
                                } else if (e.key === "Escape") {
                                  handleCancelEditTopic();
                                }
                              }}
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleSaveTopic(topic.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={handleCancelEditTopic}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Link
                              href={`${MODULE_PATH}/${topic.id}`}
                              className="font-medium hover:underline"
                            >
                              {topic.title}
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleStartEditTopic(topic)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">—</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">—</span>
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
                      topic.sub_topics
                        .sort((a, b) => a.title.localeCompare(b.title))
                        .map((subTopic) => (
                          <TableRow
                            key={subTopic.id}
                            className="bg-white hover:bg-gray-50"
                          >
                            <TableCell className="w-12">
                              <div className="flex items-center justify-center"></div>
                            </TableCell>
                            <TableCell>
                              {editingSubTopicId === subTopic.id ? (
                                <div className="flex items-center gap-2 pl-6">
                                  <Input
                                    value={editSubTopicTitle}
                                    onChange={(e) =>
                                      setEditSubTopicTitle(e.target.value)
                                    }
                                    className="max-w-xs"
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        handleSaveSubTopic(
                                          subTopic.id,
                                          topic.id
                                        );
                                      } else if (e.key === "Escape") {
                                        handleCancelEditSubTopic();
                                      }
                                    }}
                                  />
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 pl-6">
                                  <Link
                                    href={`${MODULE_PATH}/${topic.id}/subtopics/${subTopic.id}/edit`}
                                    className="hover:underline text-sm"
                                  >
                                    {subTopic.title}
                                  </Link>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() =>
                                      handleStartEditSubTopic(subTopic)
                                    }
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              {editingSubTopicId === subTopic.id ? (
                                <div className="pl-6 space-y-2">
                                  <div className="flex flex-wrap gap-1">
                                    {editSubTopicKeywords.map((keyword) => (
                                      <Badge
                                        key={keyword}
                                        variant="secondary"
                                        className="text-xs gap-1"
                                      >
                                        {keyword}
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleRemoveKeyword(keyword)
                                          }
                                          className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                                        >
                                          <X className="h-3 w-3" />
                                        </button>
                                      </Badge>
                                    ))}
                                  </div>
                                  <div className="flex gap-1">
                                    <Input
                                      key={`keyword-input-${subTopic.id}`}
                                      placeholder="Add keyword"
                                      value={newKeyword}
                                      onChange={(e) =>
                                        setNewKeyword(e.target.value)
                                      }
                                      className="max-w-xs h-7 text-xs"
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          e.preventDefault();
                                          handleAddKeyword();
                                        }
                                      }}
                                      autoFocus={false}
                                    />
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={handleAddKeyword}
                                      className="h-7"
                                      type="button"
                                    >
                                      <Plus className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex flex-wrap gap-1 pl-6">
                                  {subTopic.keywords &&
                                  subTopic.keywords.length > 0 ? (
                                    subTopic.keywords.map((keyword) => (
                                      <Badge
                                        key={keyword}
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {keyword}
                                      </Badge>
                                    ))
                                  ) : (
                                    <span className="text-xs text-muted-foreground">
                                      —
                                    </span>
                                  )}
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              {editingSubTopicId === subTopic.id ? (
                                <div className="pl-6">
                                  <Input
                                    value={editSubTopicTaostId}
                                    onChange={(e) =>
                                      setEditSubTopicTaostId(e.target.value)
                                    }
                                    className="max-w-xs"
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        handleSaveSubTopic(
                                          subTopic.id,
                                          topic.id
                                        );
                                      } else if (e.key === "Escape") {
                                        handleCancelEditSubTopic();
                                      }
                                    }}
                                  />
                                </div>
                              ) : (
                                <div className="pl-6">
                                  <span className="text-sm text-muted-foreground">
                                    {subTopic.taost_id || "—"}
                                  </span>
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              {editingSubTopicId === subTopic.id ? (
                                <div className="flex items-center justify-end gap-1">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() =>
                                      handleSaveSubTopic(subTopic.id, topic.id)
                                    }
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={handleCancelEditSubTopic}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-destructive hover:text-destructive"
                                    onClick={() =>
                                      setDeleteSubTopicId(subTopic.id)
                                    }
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-destructive hover:text-destructive"
                                  onClick={() =>
                                    setDeleteSubTopicId(subTopic.id)
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}

                    {/* Create SubTopic Row */}
                    {expanded && creatingSubTopic === topic.id && (
                      <TableRow className="bg-blue-50">
                        <TableCell className="w-12">
                          <div className="flex items-center justify-center"></div>
                        </TableCell>
                        <TableCell colSpan={4}>
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
                        <TableCell colSpan={4}>
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
              <TableCell colSpan={4}>
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
              <TableCell colSpan={4}>
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
