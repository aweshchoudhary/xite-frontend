"use server";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import jsonData from "./import.json";

export async function main() {
  try {
    console.log("Starting topic import...");
    for (const topic of jsonData) {
      let isExists = await primaryDB.topic.findFirst({
        where: {
          title: topic.Topic,
        },
      });

      if (!isExists) {
        isExists = await primaryDB.topic.create({
          data: {
            title: topic.Topic,
          },
        });
      }

      await primaryDB.subTopic.create({
        data: {
          title: topic.SubTopic,
          taost_id: topic.TOAST_ID,
          topic_id: isExists?.id,
          keywords: topic.Keywords.split(",").map((keyword) => keyword.trim()),
        },
      });
    }
  } catch (error) {
    throw error;
  }
}
