"use client";
import { Badge } from "@/modules/common/components/ui/badge";
import {
  Card as CardComponent,
  CardContent,
  CardTitle,
} from "@/modules/common/components/ui/card";
import { ITemplate } from "@/modules/common/services/db/types/interfaces";
import { CalendarIcon, Copy, Dot } from "lucide-react";
import Link from "next/link";
import { DateTime } from "luxon";
import { Button } from "@/modules/common/components/ui/button";
import { duplicateTemplateAction } from "../actions/duplicate";
import { toast } from "sonner";

type CardProps = {
  template: ITemplate;
};

export default function Card({ template }: CardProps) {
  return (
    <CardComponent>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Link href={`/templates/${template._id}`}>
            <CardTitle>{template.name}</CardTitle>
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{template.status}</Badge>
            {template._id && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  toast.promise(duplicateTemplateAction(template._id!), {
                    loading: "Duplicating template...",
                    success: "Template duplicated successfully",
                    error: "Failed to duplicate template",
                  })
                }
              >
                <Copy />
              </Button>
            )}
          </div>
        </div>
        <p>{template.description}</p>

        {template?.updatedAt && (
          <div className="text-muted-foreground text-xs flex items-center gap-2">
            <CalendarIcon className="size-4" />
            <span>
              Last modified:{" "}
              {DateTime.fromISO(template.updatedAt).toFormat("dd MMM yyyy")}
            </span>
          </div>
        )}
      </CardContent>
    </CardComponent>
  );
}
