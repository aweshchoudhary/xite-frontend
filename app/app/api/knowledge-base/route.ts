import { getCohort } from "@/modules/cohort/server/cohort/read";
import { main as processKBDocuments } from "@/modules/cohort/server/service/kb-document";
import { updateCommonApiKb } from "@/modules/cohort/server/service/update-applications-kb/common-api";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const authHeader =
      request.headers.get("Authorization") ||
      request.headers.get("authorization");

    const apikey = authHeader?.includes("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    if (!apikey) {
      return NextResponse.json(
        { error: "Api key is required" },
        { status: 401 }
      );
    }

    if (apikey !== process.env.XITE_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { cohortId } = await request.json();
    const cohort = await getCohort({ id: cohortId, accessCheck: false });

    await processKBDocuments({ cohort });

    await updateCommonApiKb({ cohort });

    return new Response("KB documents processed", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
