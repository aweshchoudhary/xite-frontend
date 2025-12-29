// "use server";
import admin from "firebase-admin";
import { cert } from "firebase-admin/app";

// adafsdfas
export const adminAuth = () => {
  if (!admin.apps.length) {
    console.log(
      "FIREBASE_ADMIN_CREDENTIALS",
      process.env.FIREBASE_ADMIN_CREDENTIALS
    );
    admin.initializeApp({
      credential: cert(process.env.FIREBASE_ADMIN_CREDENTIALS!),
    });
  }

  return admin.auth();
};
