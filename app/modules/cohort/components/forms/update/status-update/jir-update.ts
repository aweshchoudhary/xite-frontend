import { primaryDB } from "@/modules/common/database/prisma/connection";
import { Queue, Worker } from "bullmq";

export const queue = new Queue("jir-update");

export const worker = new Worker("jir-update", async (job) => {
  try {
    const { cohortId } = job.data;
    console.log("Jira update started");
    await main(cohortId);
    console.log("Jira update completed");
  } catch (error) {
    console.error(error);
    throw error;
  }
});

export async function main(cohortId: string) {
  try {
    const cohort = await primaryDB.cohort.findUnique({
      where: {
        id: cohortId,
      },

      include: {
        program: true,
        design_curriculum_section: {
          include: {
            items: {
              include: {
                objectives: true,
                sessions: {
                  include: {
                    objectives: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!cohort) {
      throw new Error("Cohort not found");
    }

    const auth = Buffer.from(
      `${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`
    ).toString("base64");

    const response = await fetch(
      `${process.env.JIRA_BASE_URL}/rest/api/3/issue`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            project: { key: "PDM" },
            summary: `Test: ${cohort.program.short_name} - Cohort ${cohort.cohort_num}`,
            issuetype: { name: "Epic" },
          },
        }),
      }
    );

    return { response };
  } catch (error) {
    throw error;
  }
}
