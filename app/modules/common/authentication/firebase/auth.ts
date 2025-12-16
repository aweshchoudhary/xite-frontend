// "use server";
import admin from "firebase-admin";
import { cert } from "firebase-admin/app";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: cert(process.env.FIREBASE_ADMIN_CREDENTIALS!),
  });
}

export const adminAuth = admin.auth();
