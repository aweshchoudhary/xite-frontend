import { NextResponse } from "next/server";
import { getCohortByDomain } from "./action";

export async function GET(
  request: Request,
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

  // get the domain from the search query params
  const url = new URL(request.url);
  const domain = url.searchParams.get("domain");

  if (!domain) {
    return NextResponse.json({ error: "Domain is required" }, { status: 400 });
  }

  const cohort = await getCohortByDomain(domain);

  if (!cohort) {
    return NextResponse.json({ error: "Cohort not found" }, { status: 404 });
  }

  return NextResponse.json({ data: cohort }, { status: 200 });
}
