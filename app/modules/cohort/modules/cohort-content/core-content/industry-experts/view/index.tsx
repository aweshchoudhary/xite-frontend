"use client";

import { GraduationCap, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import Link from "next/link";
import MicrositeAdditionalFieldsView from "../../../common/components/microsite-additional-fields-view";
import type { GetCohortForDetailPage } from "@/modules/cohort/components/forms/read/get-one-for-detail-page-action";
import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/table";
import { Button } from "@ui/button";
import { getImageUrl } from "@/modules/common/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";

export type Props = {
  data: GetCohortForDetailPage["industry_experts_section"] | null;
};

type SortField = "name" | "title" | "academic_partner";
type SortDirection = "asc" | "desc";

function SortIcon({
  field,
  currentField,
  direction,
}: {
  field: SortField;
  currentField: SortField;
  direction: SortDirection;
}) {
  if (currentField !== field) {
    return <ArrowUpDown className="size-4" />;
  }
  return direction === "asc" ? (
    <ArrowUp className="size-4" />
  ) : (
    <ArrowDown className="size-4" />
  );
}

export default function View({ data }: Props) {
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedItems = useMemo(() => {
    if (!data?.items) return [];

    const items = [...data.items];
    
    return items.sort((a, b) => {
      let compareValue = 0;

      switch (sortField) {
        case "name":
          compareValue = a.faculty.name.localeCompare(b.faculty.name);
          break;
        case "title":
          const aTitle = a.faculty.title || "";
          const bTitle = b.faculty.title || "";
          compareValue = aTitle.localeCompare(bTitle);
          break;
        case "academic_partner":
          const aPartner = a.faculty.academic_partner?.name || "";
          const bPartner = b.faculty.academic_partner?.name || "";
          compareValue = aPartner.localeCompare(bPartner);
          break;
      }

      return sortDirection === "asc" ? compareValue : -compareValue;
    });
  }, [data?.items, sortField, sortDirection]);

  return (
    <div className="">
      <div className="mb-5">
        <h3 className="text-2xl font-semibold text-foreground">
          {data?.title || "Expert"}
        </h3>
      </div>

      {data?.items && data.items.length > 0 ? (
        <div className="rounded-lg border">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("name")}
                    className="h-8 px-2 flex items-center gap-1"
                  >
                    Name
                    <SortIcon
                      field="name"
                      currentField={sortField}
                      direction={sortDirection}
                    />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("academic_partner")}
                    className="h-8 px-2 flex items-center gap-1"
                  >
                    Academic Partner
                    <SortIcon
                      field="academic_partner"
                      currentField={sortField}
                      direction={sortDirection}
                    />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedItems.map(({ faculty: item }) => (
                <TableRow key={item.id} className="group">
                  <TableCell>
                    <Link
                      href={`/faculty/${item.id}`}
                      className="flex items-center gap-2 hover:underline"
                    >
                      <Avatar className="size-9 border">
                        {item.profile_image ? (
                          <AvatarImage
                            src={getImageUrl(item.profile_image)}
                            alt={item.name}
                          />
                        ) : null}
                        <AvatarFallback className="uppercase">
                          <GraduationCap className="size-5 text-muted-foreground opacity-50" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="font-semibold">{item.name}</span>
                        <p className="truncate w-40 text-muted-foreground text-sm">
                          {item.title}
                        </p>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    {item.academic_partner ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="size-9">
                          {item.academic_partner.logo_url ? (
                            <AvatarImage
                              src={getImageUrl(item.academic_partner.logo_url)}
                              alt={item.academic_partner.name}
                            />
                          ) : null}
                          <AvatarFallback className="uppercase text-xs">
                            {item.academic_partner.name.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{item.academic_partner.name}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg border-2 border-dashed">
          <GraduationCap className="size-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No expert added yet</p>
          <p className="text-sm">
            Use the &quot;Manage Expert&quot; button to add expert members
          </p>
        </div>
      )}
      <br />
      <MicrositeAdditionalFieldsView
        top_desc={data?.top_description || ""}
        bottom_desc={data?.bottom_description || ""}
      />
    </div>
  );
}
