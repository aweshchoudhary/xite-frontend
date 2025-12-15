import { File as GFile, Storage } from "@google-cloud/storage";
import { v4 as uuidv4 } from "uuid";
import path from "path";

const BUCKET_NAME =
  process.env.GOOGLE_STORAGE_BUCKET_NAME || "xed-pm-app-storage";

const storage = new Storage();

type UploadResponse = {
  filename: string;
  fileUrl: string;
};

type UploadProps = {
  file: File;
  bucketName?: string;
  fileName?: string;
  customMetadata?: object;
};

async function upload({
  file,
  bucketName,
  fileName,
  customMetadata,
}: UploadProps): Promise<UploadResponse> {
  try {
    const bucket = storage.bucket(bucketName || BUCKET_NAME);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name);
    const uniqueFileName = fileName || `${uuidv4()}${ext}`;

    const newFile = bucket.file(uniqueFileName);

    await newFile.save(buffer, {
      metadata: {
        contentType: file.type,
        ...customMetadata,
      },
      resumable: true,
    });

    return {
      filename: newFile.name,
      fileUrl: process.env.FILE_CDN_API_BASE_URL + "/" + newFile.name,
    };
  } catch (error) {
    throw error;
  }
}

type GetFileByNameProps = {
  bucketName?: string;
  fileName: string;
};

type GetFileByNameResponse = {
  file: GFile;
};

export async function getFileByName({
  bucketName,
  fileName,
}: GetFileByNameProps): Promise<GetFileByNameResponse> {
  const bucket = storage.bucket(bucketName || BUCKET_NAME);
  const file = bucket.file(fileName);
  return { file };
}

export { upload, storage, BUCKET_NAME };
