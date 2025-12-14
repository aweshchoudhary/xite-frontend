import { PrimaryDB } from "@/modules/common/database";
import { Label } from "@/modules/common/components/ui/label";
import { Button } from "@/modules/common/components/ui/button";
type Props = {
  data?: PrimaryDB.CohortBrandingGetPayload<{
    include: {
      primary_color: true;
      secondary_color: true;
      background_color: true;
    };
  }> | null;
};

export default function CohortContentDetailsOverviewView({ data }: Props) {
  return (
    <div>
      <div className="grid xl:grid-cols-3 gap-6">
        <div>
          <Label className="mb-3 text-muted-foreground">Font</Label>
          <div>{data?.font_name || "N/A"}</div>
        </div>
        <div>
          <Label className="mb-3 text-muted-foreground">Border Radius</Label>
          <div>{data?.default_border_radius || 0}px</div>
        </div>
        <div className="col-span-full">
          <Label className="mb-3 text-muted-foreground">Colors</Label>
          <div className="flex flex-wrap gap-4">
            <div>
              <Button
                variant="outline"
                style={{
                  backgroundColor:
                    data?.background_color?.background_color ?? "",
                  color: data?.background_color?.text_color ?? "",
                }}
              >
                <span>Background Color</span>
              </Button>
            </div>
            <div>
              <Button
                variant="outline"
                style={{
                  backgroundColor: data?.primary_color?.background_color ?? "",
                  color: data?.primary_color?.text_color ?? "",
                }}
              >
                <span>Primary Color</span>
              </Button>
            </div>
            <div>
              <Button
                variant="outline"
                style={{
                  backgroundColor:
                    data?.secondary_color?.background_color ?? "",
                  color: data?.secondary_color?.text_color ?? "",
                }}
              >
                <span>Secondary Color</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
