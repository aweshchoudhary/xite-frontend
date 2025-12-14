"use server";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";

export type GetOneOutput = PrimaryDB.EnterpriseGetPayload<{
  include: {
    programs: {
      include: {
        enterprise: true;
        academic_partner: true;
        cohorts: true;
      };
    };
  };
}>;
export type GetAllOutput = GetOneOutput[];

export async function getAll(): Promise<GetAllOutput> {
  try {
    const data = await primaryDB.enterprise.findMany({
      include: {
        programs: {
          include: {
            enterprise: true,
            academic_partner: true,
            cohorts: true,
          },
        },
      },
    });

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getOne({
  id,
}: {
  id: string;
}): Promise<GetOneOutput | null> {
  try {
    const data = await primaryDB.enterprise.findUnique({
      where: { id },
      include: {
        programs: {
          include: {
            enterprise: true,
            academic_partner: true,
            cohorts: true,
          },
        },
      },
    });

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
