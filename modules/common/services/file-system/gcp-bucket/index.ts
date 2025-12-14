// "use server";

// import { Storage } from "@google-cloud/storage";
// import fs from "fs";

// // You can also use process.env for keyPath
// const storage = new Storage({});

// const bucketName = "program-management-app";
// const bucket = storage.bucket(bucketName);

// export async function uploadToGCS(file: File, directory: string) {
//   // temprorily store file in the uploads/ folder
//   const tempFilePath = `uploads/${file.name}`;
//   const tempFile = fs.createWriteStream(tempFilePath);
//   const writer = file.stream().pipeTo(tempFile);

//   await bucket.upload(tempFilePath, {
//     destination: `${directory}/${file.name}`,
//     public: true,
//   });

//   return `https://storage.googleapis.com/${bucketName}/${directory}/${file.name}`;
// }
