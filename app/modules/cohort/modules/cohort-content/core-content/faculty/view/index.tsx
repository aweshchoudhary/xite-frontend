import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { GraduationCap } from "lucide-react";
import FacultyCard from "../faculty-card";
import Link from "next/link";
import MicrositeAdditionalFieldsView from "../../../common/components/microsite-additional-fields-view";

export type Props = {
  data: PrimaryDB.CohortFacultySectionGetPayload<{
    include: {
      items: {
        include: {
          faculty: {
            include: {
              academic_partner: true;
              faculty_subject_areas: {
                include: {
                  subject_area: true;
                };
              };
            };
          };
        };
      };
    };
  }>;
};

export default function View({ data }: Props) {
  return (
    <div className="">
      <div className="mb-5">
        <h3 className="text-2xl font-semibold text-foreground">
          {data?.title || "Faculty"}
        </h3>
      </div>

      {data?.items && data.items.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-6">
          {data.items
            .sort((a, b) => a.position - b.position)
            .map(({ faculty: item }) => (
              <Link key={item.id} href={`/faculty/${item.id}`}>
                <FacultyCard
                  profile_image={item.profile_image || ""}
                  name={item.name}
                  description={item.description || ""}
                />
              </Link>
            ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg border-2 border-dashed">
          <GraduationCap className="size-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No faculty added yet</p>
          <p className="text-sm">
            Use the &quot;Manage Faculty&quot; button to add faculty members
          </p>
        </div>
      )}
    </div>
  );
}
