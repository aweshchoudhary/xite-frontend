import { buttonVariants } from "@/modules/common/components/ui/button";
import { cn } from "@/modules/common/lib/utils";
import { ArrowRight, Settings } from "lucide-react";
import Link from "next/link";
import { getAllByStatus } from "@/modules/cohort/server/cohort/read";
import { getAll as getAllProgramsByStatus } from "@/modules/program/server/read";
import ViewCohortCard from "@/modules/cohort/components/cards/view-card";
import { Separator } from "@/modules/common/components/ui/separator";
import ViewCard from "@/modules/program/components/view/view-card";

// Force dynamic rendering since we use auth
export const dynamic = "force-dynamic";

export default async function Home() {
  return (
    <div className="spacing space-y-5">
      <section>
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <div>
                <Link href="/dashboard" className="text-muted-foreground">
                  Dashboard
                </Link>
              </div>
            </div>
            <div>
              <Link
                href="/settings"
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                <Settings />
                Settings
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 lg:gap-10 xl:gap-16">
            <div>
              <AllPrograms />
            </div>
            <div>
              <AllCohorts />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const AllPrograms = async () => {
  const programs = await getAllProgramsByStatus({});
  if (!programs.data || programs.data.length === 0)
    return (
      <div>
        <h1 className="text-lg mb-5">All Programs</h1>
        <div className="border-2 border-spacing-3 border-dashed bg-background px-5 py-8">
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No programs found</p>
          </div>
        </div>
      </div>
    );

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-lg">All Programs</h1>
        <Link
          href="/programs"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          View All <ArrowRight className="size-4" strokeWidth={1.5} />
        </Link>
      </div>

      <Separator className="my-3" />

      <div className="space-y-3">
        {programs.data?.slice(0, 4).map((program) => (
          <ViewCard key={program.id} program={program} />
        ))}
      </div>
    </div>
  );
};

const AllCohorts = async () => {
  const cohorts = await getAllByStatus("ALL");

  if (!cohorts || cohorts.length === 0)
    return (
      <div>
        <h1 className="text-lg mb-5">All Cohorts</h1>
        <div className="border-2 border-spacing-3 border-dashed bg-background px-5 py-8">
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No cohorts found</p>
          </div>
        </div>
      </div>
    );
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-lg">All Cohorts</h1>
        <Link
          href="/cohorts"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          View All <ArrowRight className="size-4" strokeWidth={1.5} />
        </Link>
      </div>

      <Separator className="my-3" />

      <div className="space-y-3">
        {cohorts.slice(0, 4).map((cohort) => (
          <ViewCohortCard key={cohort.id} cohort={cohort} />
        ))}
      </div>
    </div>
  );
};
