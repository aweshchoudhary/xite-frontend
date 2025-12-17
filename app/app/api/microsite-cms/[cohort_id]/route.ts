import { getMicrositeByCohortId } from "@/modules/microsite-cms/modules/common/services/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ cohort_key: string }> }
) {
  const apikey =
    request.headers.get("Authorization") ||
    request.headers.get("authorization");

  if (!apikey) {
    return NextResponse.json({ error: "Api key is required" }, { status: 401 });
  }

  if (apikey.split(" ")[1] !== process.env.MICROSITE_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { cohort_key } = await params;
  const microsite = await getMicrositeByCohortId({ cohortId: cohort_key });
  if (!microsite) {
    return NextResponse.json({ error: "Microsite not found" }, { status: 404 });
  }
  return NextResponse.json({ data: microsite });
}
