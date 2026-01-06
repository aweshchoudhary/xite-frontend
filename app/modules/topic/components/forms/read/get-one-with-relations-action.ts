"use server";

import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { checkPermission } from "@/modules/common/authentication/access-control/lib";
import { ERROR_MESSAGES } from "@/modules/common/constant";

export type GetOne = PrimaryDB.TopicGetPayload<{
  include: {
    sub_topics: true;
  };
}>;

export type GetOneOutput = {
  data?: GetOne | null;
  error?: string;
};

export async function getOneWithRelationsAction(
  id: string
): Promise<GetOneOutput> {
  try {
    const permission = await checkPermission("Topic", "read");

    if (!permission) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED_ACTION_ERR);
    }

    const topic = await primaryDB.topic.findUnique({
      where: { id },
      include: {
        sub_topics: true,
      },
    });

    return { data: topic };
  } catch (error) {
    console.error(error);
    return {
      error: `Failed to get topic`,
    };
  }
}

