"use client";

import type { GetCohortForDetailPage as GetCohort } from "@/modules/cohort/components/forms/read/get-one-for-detail-page-action";
import { Badge } from "@/modules/common/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/table";
import { Button } from "@ui/button";
import { FileText, Image as ImageIcon, Upload, CheckCircle2, XCircle } from "lucide-react";
import Image from "next/image";
import { getImageUrl } from "@/modules/common/lib/utils";
import BannerUpdate from "./banner-image/upload";
import UniversityBannerUpdate from "./university-banner-image/upload";
import BrochureUpdate from "./brochure/upload";
import UniversityLogoUpdate from "./university-logo/upload";
import { useCheckUserOwnsCohort } from "@/modules/cohort/auth/access";

type Props = {
  data: GetCohort;
};

type MediaItem = {
  id: string;
  name: string;
  type: "image" | "file";
  url: string | null;
  uploadComponent: React.ReactNode;
};

export default function CohortContentMedia({ data }: Props) {
  const isUserHasCohortAccess = useCheckUserOwnsCohort(data.id);
  
  const isCompleted =
    data.media_section?.banner_image_url &&
    data.media_section?.university_banner_url &&
    data.media_section?.brochure_url &&
    data.media_section?.university_logo_url;

  if (!data || !data.media_section) return null;

  const mediaItems: MediaItem[] = [
    {
      id: "banner",
      name: "Banner Image",
      type: "image",
      url: data.media_section.banner_image_url,
      uploadComponent: <BannerUpdate cohortId={data.id} fieldName="banner-upload" />,
    },
    {
      id: "university-banner",
      name: "University Banner Image",
      type: "image",
      url: data.media_section.university_banner_url,
      uploadComponent: <UniversityBannerUpdate cohortId={data.id} fieldName="university-banner-upload" />,
    },
    {
      id: "university-logo",
      name: "University Logo",
      type: "image",
      url: data.media_section.university_logo_url,
      uploadComponent: <UniversityLogoUpdate cohortId={data.id} fieldName="university-logo-upload" />,
    },
    {
      id: "brochure",
      name: "Brochure",
      type: "file",
      url: data.media_section.brochure_url,
      uploadComponent: <BrochureUpdate cohortId={data.id} fieldName="brochure-upload" />,
    },
  ];

  return (
    <div className="space-y-6">
      <Badge variant={isCompleted ? "success" : "destructive"}>
        {isCompleted ? "Completed" : "Incomplete"}
      </Badge>
      
      <div >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Media Type</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead>Preview</TableHead>
              <TableHead className="w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mediaItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {item.type === "file" ? (
                      <FileText className="size-5 text-muted-foreground" />
                    ) : (
                      <ImageIcon className="size-5 text-muted-foreground" />
                    )}
                    <span className="font-semibold">{item.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {item.url ? (
                    <Badge variant="success" className="gap-1">
                      <CheckCircle2 className="size-3" />
                      Uploaded
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="gap-1">
                      <XCircle className="size-3" />
                      Missing
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {item.url ? (
                    item.type === "image" ? (
                      <div className="w-32 h-20 relative rounded-md overflow-hidden">
                        <Image
                          src={getImageUrl(item.url)}
                          alt={item.name}
                          width={128}
                          height={80}
                          className="object-contain size-full"
                        />
                      </div>
                    ) : (
                      <a
                        href={getImageUrl(item.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        <FileText className="size-4" />
                        View Document
                      </a>
                    )
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      No file uploaded
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {isUserHasCohortAccess && data.status !== "ACTIVE" ? (
                    <div className="flex items-center gap-2">
                      <label htmlFor={`${item.id}-upload`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 cursor-pointer"
                          asChild
                        >
                          <span>
                            <Upload className="size-4" />
                            {item.url ? "Change" : "Upload"}
                          </span>
                        </Button>
                      </label>
                      <div className="hidden">{item.uploadComponent}</div>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
