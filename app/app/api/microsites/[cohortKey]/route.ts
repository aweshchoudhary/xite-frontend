import { getCohort } from "@/modules/cohort/server/cohort/read";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ cohortKey: string }> }
) {
  try {
    const apikey =
      request.headers.get("Authorization") ||
      request.headers.get("authorization");

    if (!apikey) {
      return NextResponse.json(
        { error: "Api key is required" },
        { status: 401 }
      );
    }

    if (apikey.split(" ")[1] !== process.env.MICROSITE_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { cohortKey } = await params;

    if (!cohortKey) {
      return NextResponse.json(
        { error: "Cohort key is required" },
        { status: 400 }
      );
    }

    const data = await getCohort({ id: cohortKey, accessCheck: false });
    if (!data) {
      return NextResponse.json(
        { error: "Microsite not found", data: null },
        { status: 404 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get microsite", errorStack: error },
      { status: 500 }
    );
  }
}
