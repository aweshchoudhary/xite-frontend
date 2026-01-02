import { getAllByStatus } from "@/modules/cohort/server/cohort/read";
import { NextResponse } from "next/server";

const allowedOrigin = "http://localhost:3000";

export async function GET(request: Request) {
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

  const allActiveCohorts = await getAllByStatus("ACTIVE");
  return NextResponse.json(
    { data: allActiveCohorts },
    { status: 200, headers: { "Access-Control-Allow-Origin": allowedOrigin } }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": allowedOrigin,
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    },
  });
}
