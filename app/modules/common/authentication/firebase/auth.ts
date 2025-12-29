// "use server";
import admin from "firebase-admin";
import { cert } from "firebase-admin/app";

export const adminAuth = () => {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: cert(process.env.FIREBASE_ADMIN_CREDENTIALS!),
    });
  }

  return admin.auth();
};
