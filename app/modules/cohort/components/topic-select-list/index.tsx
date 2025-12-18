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
import { getTopicListAction } from "./action";

export default function TopicSelectList({
  onChange,
  defaultValue,
}: {
  onChange: (value: string) => void;
  defaultValue?: string | null;
}) {
  const [topicList, setTopicList] = useState<GetOne[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchTopicList = async () => {
      const topics = await getTopicListAction();
      setTopicList(topics);
    };
    fetchTopicList();
  }, []);

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {defaultValue ? (
              <>
                {topicList.map(
                  (topic) =>
                    topic.id === defaultValue && (
                      <div
                        key={defaultValue}
                        className="flex items-center gap-2 truncate"
                      >
                        {topic.title}
                      </div>
                    )
                )}
              </>
            ) : (
              "Select Topic"
            )}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search topic..." className="h-full w-full" />
            <CommandList>
              <CommandEmpty>No topic found.</CommandEmpty>
              <CommandGroup>
                {topicList.map((topic) => (
                  <CommandItem
                    key={topic.id}
                    value={topic.id}
                    keywords={[topic.title ?? ""]}
                    onSelect={(currentValue) => {
                      setOpen(false);
                      onChange(currentValue);
                    }}
                  >
                    <div className="flex items-center gap-2">{topic.title}</div>
                    <Check
                      className={cn(
                        "ml-auto",
                        defaultValue === topic.id ? "opacity-100" : "opacity-0"
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




