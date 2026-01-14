import { Queue, Worker } from "bullmq";

export const queue = new Queue("sales-api-update");

export const worker = new Worker("sales-api-update", async (job) => {
  try {
    const { cohortId } = job.data;
    await main(cohortId);
  } catch (error) {
    console.error(error);
    throw error;
  }
});

export async function main(cohortId: string) {
  try {
    console.log("Payment platform update started");
  } catch (error) {
    throw error;
  }
}
