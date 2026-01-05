import { Badge } from "@ui/badge";
import { Card as CardComponent, CardContent, CardTitle } from "@ui/card";
import { IMicrosite } from "@microsite-cms/common/services/db/types/interfaces";
import { CalendarIcon } from "lucide-react";
import Link from "next/link";
import { DateTime } from "luxon";

type CardProps = {
  microsite: IMicrosite;
};

export default function Card({ microsite }: CardProps) {
  return (
    <Link href={`/microsites/${microsite._id}`}>
      <CardComponent>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle>{microsite.title || "Untitled microsite"}</CardTitle>
            <Badge variant="secondary">{microsite.status}</Badge>
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
              {DateTime.fromISO(microsite.updatedAt || "").toFormat(
                "dd MMM yyyy"
              )}
            </span>
          </div>
        </CardContent>
      </CardComponent>
    </Link>
  );
}
