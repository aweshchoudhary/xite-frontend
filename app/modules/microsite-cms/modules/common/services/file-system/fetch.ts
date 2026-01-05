import {
  storage,
  BUCKET_NAME,
} from "@/modules/common/services/file-system/connection";

// Fetch a file from GCP bucket and return its buffer
export async function fetchFile(fileName: string): Promise<Buffer> {
  try {
    const [fileBuffer] = await storage
      .bucket(BUCKET_NAME)
      .file(fileName)
      .download();

    return fileBuffer;
  } catch (error) {
    console.error("Error fetching file from GCP:", error);
    throw new Error(`Failed to fetch file: ${fileName}`);
  }
}
