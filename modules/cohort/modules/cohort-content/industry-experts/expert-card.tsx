import { getImageUrl } from "@/modules/common/lib/utils";
import { GraduationCap } from "lucide-react";
import Image from "next/image";

export default function ExpertCard({
  profile_image,
  name,
  description,
}: {
  profile_image: string;
  name: string;
  description: string;
}) {
  return (
    <div className="bg-background border relative border-border rounded-md p-3">
      <div className="w-full bg-gradient-to-br from-muted to-muted/50 aspect-square rounded-md overflow-hidden mb-2">
        {profile_image ? (
          <Image
            src={getImageUrl(profile_image)}
            alt={name}
            width={150}
            height={150}
            className="object-cover size-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <GraduationCap className="size-12 text-muted-foreground opacity-50" />
          </div>
        )}
      </div>
      <div className="space-y-1">
        <h4 className="font-semibold text-foreground line-clamp-2">{name}</h4>
        <div
          className="prose prose-sm text-muted-foreground line-clamp-2"
          dangerouslySetInnerHTML={{
            __html: description ?? "No description available",
          }}
        />
      </div>
    </div>
  );
}
