"use server";
import { PrimaryDB, primaryDB } from "@/modules/common/database";
import { MODULE_NAME } from "../contants";

export type GetOne = PrimaryDB.AcademicPartnerGetPayload<{
  include: {
    programs: {
      include: {
        enterprise: true;
        academic_partner: true;
        cohorts: true;
      };
    };
    faculties: true;
  };
}>;

export type GetOneOutput = {
  data?: GetOne | null;
  error?: string;
};

export type GetOneInput = {
  id: string;
};

export type GetAllOutput = {
  data?: GetOne[];
  error?: string;
};

export async function getAll(): Promise<GetAllOutput> {
  try {
    const data = await primaryDB.academicPartner.findMany({
      include: {
        programs: {
          include: {
            enterprise: true,
            academic_partner: true,
            cohorts: true,
          },
        },
        faculties: true,
      },
    });
    return { data };
  } catch (error) {
    console.error(error);
    return {
      error: `Failed to get all ${MODULE_NAME}`,
    };
  }
}

export async function getOne({ id }: { id: string }): Promise<GetOneOutput> {
  try {
    const data = await primaryDB.academicPartner.findUnique({
      where: { id },
      include: {
        programs: {
          include: {
            enterprise: true,
            academic_partner: true,
            cohorts: true,
          },
        },
        faculties: true,
      },
    });

    return { data };
  } catch (error) {
    console.error(error);
    return {
      error: `Failed to get one ${MODULE_NAME}`,
    };
  }
}
