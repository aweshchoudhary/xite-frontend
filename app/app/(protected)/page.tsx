import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { getAllByStatus } from "@/modules/cohort/components/forms/read/action";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import ViewCohortCard from "@/modules/cohort/components/cards/view-card";
import { Separator } from "@ui/separator";
import ViewCard from "@/modules/program/components/view/view-card";
import { generateSEOMetadata } from "@/modules/common/lib/seo";
import RecentActivity from "@/modules/dashboard/components/recent-activity";
import { Suspense } from "react";

// Force dynamic rendering since we use auth
export const dynamic = "force-dynamic";

export const metadata = generateSEOMetadata({
  title: "Dashboard",
  description:
    "View and manage your programs and cohorts from the XITE Platform dashboard",
});

export default async function Home() {
  return (
    <div className="spacing space-y-5">
      <section>
        <div className="space-y-5">
            <h2 className="text-2xl font-semibold text-primary pb-5">
                <Link href="/dashboard">
                  Dashboard
                </Link>
            </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 xl:gap-8">
            <div>
              <AllPrograms />
            </div>
            <div>
              <AllCohorts />
            </div>
            <div>
              <Suspense
                fallback={
                  <div className="space-y-3">
                    <h2 className="text-lg font-semibold mb-3">Recent Activity</h2>
                    <div className="border-2 border-spacing-3 border-dashed bg-background px-5 py-8">
                      <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground text-sm">Loading activity...</p>
                      </div>
                    </div>
                  </div>
                }
              >
                <RecentActivity />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const AllPrograms = async () => {
  const programs = await primaryDB.program.findMany({
    select: {
      id: true,
      name: true,
      status: true,
      type: true,
      updated_at: true,
      academic_partner: {
        select: {
          name: true,
          logo_url: true,
        },
      },
      _count: {
        select: { cohorts: true },
      },
    },
  });
  if (!programs || programs.length === 0)
    return (
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-lg">Programs</h1>
          <Link
            href="/programs"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            View All <ArrowRight className="size-4" strokeWidth={1.5} />
          </Link>
        </div>
        <Separator className="my-3" />
        <div className="border-2 border-spacing-3 border-dashed bg-background px-5 py-8 rounded-lg">
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <p className="text-sm font-medium text-muted-foreground">
              No Programs Found
            </p>
            <p className="text-xs text-muted-foreground/70">
              Create your first program to get started
            </p>
          </div>
        </div>
      </div>
    );

  // Sort programs by updated_at (most recently updated first)
  const sortedPrograms = [...programs].sort((a, b) => {
    const dateA = a.updated_at?.getTime() || 0;
    const dateB = b.updated_at?.getTime() || 0;
    return dateB - dateA; // Descending order
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-lg">Programs</h1>
        <Link
          href="/programs"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          View All <ArrowRight className="size-4" strokeWidth={1.5} />
        </Link>
      </div>


      <div className="space-y-3">
        {sortedPrograms.slice(0, 4).map((program) => (
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
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg">Cohorts</h1>
          <Link
            href="/cohorts"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            View All <ArrowRight className="size-4" strokeWidth={1.5} />
          </Link>
        </div>
        <div className="border-2 border-spacing-3 border-dashed bg-background px-5 py-8 rounded-lg">
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <p className="text-sm font-medium text-muted-foreground">
              No Cohorts Found
            </p>
            <p className="text-xs text-muted-foreground/70">
              Create your first cohort to get started
            </p>
          </div>
        </div>
      </div>
    );

  // Sort cohorts by start_date (earliest first)
  const sortedCohorts = [...cohorts].sort((a, b) => {
    const dateA = a.updated_at?.getTime() || 0;
    const dateB = b.updated_at?.getTime() || 0;
    return dateA - dateB; // Ascending order
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-lg">Cohorts</h1>
        <Link
          href="/cohorts"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          View All <ArrowRight className="size-4" strokeWidth={1.5} />
        </Link>
      </div>


      <div className="space-y-3">
        {sortedCohorts.slice(0, 4).map((cohort) => (
          <ViewCohortCard
            key={cohort.id}
            cohort={{
              end_date: cohort.end_date,
              id: cohort.id,
              media_section: cohort.media_section,
              name: cohort.name,
              program: cohort.program,
              start_date: cohort.start_date,
              status: cohort.status,
              updated_at: cohort.updated_at,
            }}
          />
        ))}
      </div>
    </div>
  );
};
