import { PrimaryDB } from "@/modules/common/database/prisma/types";

type Props = {
  data?: PrimaryDB.CohortOverviewSectionGetPayload<object> | null;
};

export default function CohortContentDetailsOverviewView({ data }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold mb-2">
          {data?.title || "Program Overview"}
        </h3>
      </div>
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{
          __html:
            data?.description ||
            "Click on the Edit button to start adding Program Overview",
        }}
      />
    </div>
  );
}
