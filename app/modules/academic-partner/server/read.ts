"use server";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { MODULE_NAME } from "../contants";
import {
  getManyRecords,
  getRecord,
} from "@/modules/common/database/controllers/academic-partner/read";

export type GetOne = PrimaryDB.AcademicPartnerGetPayload<{
  include: {
    programs: {
      include: {
        enterprise: true;
        academic_partner: true;
        cohorts: true;
        tags: true;
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
    const data = await getManyRecords({
      include: {
        programs: {
          include: {
            enterprise: true,
            academic_partner: true,
            cohorts: true,
            tags: true,
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
    const data = await getRecord({
      recordId: id,
      include: {
        programs: {
          include: {
            enterprise: true,
            academic_partner: true,
            cohorts: true,
            tags: true,
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
