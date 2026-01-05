import { upload } from "../connection";

type customMetadata = Object;

type UploadFileProps = {
  file: File;
  bucketName?: string;
  customMetadata?: customMetadata;
  fileName?: string;
};

export async function uploadFile({
  file,
  bucketName,
  customMetadata,
  fileName,
}: UploadFileProps) {
  return upload({ file, bucketName, customMetadata, fileName });
}
