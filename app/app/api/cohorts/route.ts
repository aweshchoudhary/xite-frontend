import { NextResponse } from "next/server";
import { getCohortsAction } from "./action";

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

  const data = await getCohortsAction();
  return NextResponse.json({ data }, { status: 200 });
}
