import { PrimaryDB } from "@/modules/common/database";
import MicrositeAdditionalFieldsView from "../../../common/components/microsite-additional-fields-view";

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

      <MicrositeAdditionalFieldsView
        top_desc={data?.top_description || ""}
        bottom_desc={data?.bottom_description || ""}
      />
    </div>
  );
}
