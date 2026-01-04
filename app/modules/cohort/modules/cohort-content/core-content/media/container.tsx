"use client";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ui/accordion";
import { Badge } from "@ui/badge";
import Container from "./index";
import { GetCohort } from "@/modules/cohort/server/cohort/read";
import { useState } from "react";
import { Button } from "@ui/button";
import { Pencil } from "lucide-react";

type Props = {
  data?: GetCohort;
  activeTab?: string;
};

export default function Component({ data, activeTab }: Props) {
  const [isUpdating, setUpdating] = useState(false);
  const isCompleted =
    data?.media_section?.university_logo_url &&
    data?.media_section?.banner_image_url &&
    data?.media_section?.university_banner_url &&
    data?.media_section?.brochure_url;

  if (!data) return null;
  return (
    <AccordionItem value="media" className="group">
      <AccordionTrigger>
        <div className="flex items-center justify-between w-full flex-1">
          <h2 className="font-semibold">Media - Images and Brochure</h2>
          <div className="flex items-center gap-2">
            {!isUpdating && activeTab === "media" ? (
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  setUpdating(true);
                }}
                size={"sm"}
                variant="secondary"
                className="group-[data-[state=closed]]:hidden"
              >
                <Pencil className="size-3.5" />
                Edit
              </Button>
            ) : null}
            <Badge variant={isCompleted ? "success" : "destructive"}>
              {isCompleted ? "Completed" : "Incomplete"}
            </Badge>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="p-0">
        <Container data={data} />
      </AccordionContent>
    </AccordionItem>
  );
}
