import { getCohort } from "@/modules/cohort/server/cohort/read";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ cohortId: string }> }
) {
  const authHeader =
    request.headers.get("Authorization") ||
    request.headers.get("authorization");

  const apikey = authHeader?.includes("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  if (!apikey) {
    return NextResponse.json({ error: "Api key is required" }, { status: 401 });
  }

  if (apikey !== process.env.XITE_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { cohortId } = await params;

  const cohort = await getCohort({ id: cohortId, accessCheck: false });

  if (!cohort) {
    return NextResponse.json({ error: "Cohort not found" }, { status: 404 });
  }

  return NextResponse.json({ data: cohort }, { status: 200 });
}
