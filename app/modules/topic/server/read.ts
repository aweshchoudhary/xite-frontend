"use server";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { MODULE_NAME } from "../contants";

export type GetOne = PrimaryDB.TopicGetPayload<{
  include: {
    sub_topics: true;
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
    const data = await primaryDB.topic.findMany({
      include: {
        sub_topics: true,
      },
      orderBy: {
        created_at: "desc",
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
    const data = await primaryDB.topic.findUnique({
      where: { id },
      include: {
        sub_topics: true,
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


