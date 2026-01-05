import { jsonToPlainText } from "json-to-plain-text";
import { GetCohort } from "../../cohort/read";

export async function updateCommonApiKb({ cohort }: { cohort: GetCohort }) {
  try {
    const textContent = jsonToPlainText(cohort, {
      doubleQuotesForKeys: true,
      doubleQuotesForValues: true,
      spacing: true,
    });

    await fetch(`${process.env.COMMON_API_BASE_URL}/api/common-api`, {
      method: "POST",
      body: JSON.stringify({
        cohort_key: cohort.cohort_key,
        text_prompt: textContent,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.COMMON_API_KEY!,
      },
    });
  } catch (error) {
    console.error("Failed to update common api kb", error);
  }
}
