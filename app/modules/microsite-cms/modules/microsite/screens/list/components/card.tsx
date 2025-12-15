import { Badge } from "@/modules/common/components/ui/badge";
import {
  Card as CardComponent,
  CardContent,
  CardTitle,
} from "@/modules/common/components/ui/card";
import { IMicrosite } from "@/modules/common/services/db/types/interfaces";
import { CalendarIcon } from "lucide-react";
import Link from "next/link";
import { DateTime } from "luxon";

type CardProps = {
  microsite: IMicrosite;
};

export default function Card({ microsite }: CardProps) {
  const updatedAt =
    microsite.updatedAt ||
    microsite.createdAt ||
    microsite.publishedAt ||
    new Date().toISOString();

  const updatedAtIso =
    typeof updatedAt === "string"
      ? updatedAt
      : updatedAt?.toISOString() || new Date().toISOString();

  const statusLabel =
    microsite.status === "published" ? "Published" : "Draft";

  return (
    <Link href={`/microsites/${microsite._id}`}>
      <CardComponent>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle>{microsite.title || "Untitled microsite"}</CardTitle>
            <Badge variant="secondary">{statusLabel}</Badge>
          </div>

          <p className="text-sm text-muted-foreground">
            {microsite.pages?.length
              ? `${microsite.pages.length} page${
                  microsite.pages.length > 1 ? "s" : ""
                }`
              : "No pages yet"}
          </p>

          <div className="text-muted-foreground text-xs flex items-center gap-2">
            <CalendarIcon className="size-4" />
            <span>
              Last modified:{" "}
              {DateTime.fromISO(updatedAtIso).toFormat("dd MMM yyyy")}
            </span>
          </div>
        </CardContent>
      </CardComponent>
    </Link>
  );
}

