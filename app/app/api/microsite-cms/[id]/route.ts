import {
  getMicrositeByCohortId,
  getMicrositeById,
} from "@/modules/microsite-cms/modules/common/services/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
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

  const { id } = await params;
  const microsite = await getMicrositeById(id);
  if (!microsite) {
    return NextResponse.json({ error: "Microsite not found" }, { status: 404 });
  }
  return NextResponse.json({ data: microsite });
}
