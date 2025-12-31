"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { GetOne } from "@/modules/topic/server/read";
import { cn } from "@/modules/common/lib/utils";
import { Button } from "@ui/button";
import { useEffect, useState } from "react";
import { getSubTopicListAction } from "./action";

type SubTopic = GetOne["sub_topics"][0];

export default function SubTopicSelectList({
  onChange,
  defaultValue,
  topicId,
  disabled,
  excludeSubtopics,
}: {
  onChange: (value: string) => void;
  defaultValue?: string | null;
  topicId?: string | null;
  disabled?: boolean;
  excludeSubtopics?: string[];
}) {
  const [subTopicList, setSubTopicList] = useState<SubTopic[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchSubTopicList = async () => {
      if (topicId) {
        const subtopics = await getSubTopicListAction(topicId);
        setSubTopicList(subtopics);
      } else {
        setSubTopicList([]);
      }
    };
    fetchSubTopicList();
  }, [topicId]);

  // Filter out excluded subtopics, but keep the current field's own selection
  const availableSubtopics = subTopicList.filter(
    (subtopic) =>
      !excludeSubtopics?.includes(subtopic.id) ||
      subtopic.id === defaultValue
  );

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled || !topicId}
          >
            {defaultValue ? (
              <>
                {subTopicList.map(
                  (subtopic) =>
                    subtopic.id === defaultValue && (
                      <div
                        key={defaultValue}
                        className="flex items-center gap-2 truncate"
                      >
                        {subtopic.title}
                      </div>
                    )
                )}
              </>
            ) : (
              "Select SubTopic"
            )}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search subtopic..." className="h-full w-full" />
            <CommandList>
              <CommandEmpty>No subtopic found.</CommandEmpty>
              <CommandGroup>
                {availableSubtopics.map((subtopic) => (
                  <CommandItem
                    key={subtopic.id}
                    value={subtopic.id}
                    keywords={[subtopic.title ?? ""]}
                    onSelect={(currentValue) => {
                      setOpen(false);
                      onChange(currentValue);
                    }}
                  >
                    <div className="flex items-center gap-2">{subtopic.title}</div>
                    <Check
                      className={cn(
                        "ml-auto",
                        defaultValue === subtopic.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

























