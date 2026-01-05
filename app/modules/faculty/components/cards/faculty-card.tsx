import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
import { GetOneOutput } from "../../server/read";
import Link from "next/link";
import { getImageUrl } from "@/modules/common/lib/utils";

export default function FacultyCard({ faculty }: { faculty: GetOneOutput }) {
  return (
    <Link
      href={`/faculty/${faculty.id}`}
      className="px-3 py-3 border rounded-md block hover:bg-accent"
    >
      <div className="flex items-center gap-2">
        <Avatar className="size-10">
          {faculty.profile_image && (
            <AvatarImage
              src={getImageUrl(faculty.profile_image)}
              alt={faculty.name}
            />
          )}
          <AvatarFallback className="uppercase">
            {faculty.name.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium text-sm">{faculty.name}</h3>
          <p className="text-sm text-muted-foreground">{faculty.title}</p>
        </div>
      </div>
    </Link>
  );
}
