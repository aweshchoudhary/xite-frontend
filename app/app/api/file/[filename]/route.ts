import { NextResponse } from "next/server";
import path from "path";
import {
  storage,
  BUCKET_NAME,
} from "@/modules/common/services/file-system/connection";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  try {
    // TODO: Add a cache layer to the file system, so that we don't have to read the file from the file system every time

    if (filename === null || filename === undefined || filename === "") {
      return new NextResponse("File not found", { status: 404 });
    }

    const stream = storage
      .bucket(BUCKET_NAME)
      .file(filename)
      .createReadStream();

    const extension = path.extname(filename).toLowerCase();
    const mimeTypes: Record<string, string> = {
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".pdf": "application/pdf",
    };

    const contentType = mimeTypes[extension] || "application/octet-stream";

    return new NextResponse(stream as unknown as ReadableStream<Uint8Array>, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${filename}"`,
      },
    });
  } catch {
    return new NextResponse("File not found", { status: 404 });
  }
}
