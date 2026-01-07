"use server";

import { loginAction } from "@/modules/common/authentication/firebase/action";

export async function loginFormAction(idToken: string) {
  try {
    await loginAction(idToken);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
