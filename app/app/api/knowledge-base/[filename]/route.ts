import { Storage } from "@google-cloud/storage";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    // get the file name from the url parmas like get-file/fileName
    const { filename } = await params;

    if (filename === null || filename === undefined || filename === "") {
      return new NextResponse("File not found", { status: 404 });
    }

    const storage = new Storage();
    const BUCKET_NAME = "xed-programs-kb-documents";

    const stream = storage
      .bucket(BUCKET_NAME)
      .file(filename)
      .createReadStream();

    return new Response(stream as unknown as ReadableStream<Uint8Array>);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
