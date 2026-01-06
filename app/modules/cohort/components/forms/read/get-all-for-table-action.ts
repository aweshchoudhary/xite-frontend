"use server";

import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { WorkStatus } from "@/modules/common/database/prisma/generated/prisma";

/**
 * Minimal cohort data for table view
 */
export type GetCohortForTable = PrimaryDB.CohortGetPayload<{
  select: {
    id: true;
    name: true;
    status: true;
    start_date: true;
    end_date: true;
    program_id: true;
    program: {
      select: {
        id: true;
        name: true;
        enterprise_id: true;
        enterprise: {
          select: {
            id: true;
            name: true;
          };
        };
      };
    };
  };
}>;

export type GetAllForTableOutput = {
  data?: GetCohortForTable[];
  error?: string;
};

export async function getAllForTableAction(): Promise<GetAllForTableOutput> {
  try {
    const cohorts = await primaryDB.cohort.findMany({
      select: {
        id: true,
        name: true,
        status: true,
        start_date: true,
        end_date: true,
        program_id: true,
        program: {
          select: {
            id: true,
            name: true,
            enterprise_id: true,
            enterprise: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return { data: cohorts };
  } catch (error) {
    console.error(error);
    return {
      error: `Failed to get all cohorts`,
    };
  }
}

export async function getAllByStatusForTableAction(
  status: WorkStatus | "ALL"
): Promise<GetAllForTableOutput> {
  try {
    const whereClause: PrimaryDB.CohortWhereInput =
      status === "ALL" ? {} : { status };

    const cohorts = await primaryDB.cohort.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        status: true,
        start_date: true,
        end_date: true,
        program_id: true,
        program: {
          select: {
            id: true,
            name: true,
            enterprise_id: true,
            enterprise: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return { data: cohorts };
  } catch (error) {
    console.error(error);
    return {
      error: `Failed to get cohorts by status`,
    };
  }
}
