import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { loginAction } from "@/modules/common/authentication/firebase/action";
import { auth } from "../../../firebase/client";

export async function loginFormAction() {
  try {
    const provider = new GoogleAuthProvider();

    const result = await signInWithPopup(auth, provider);
    const idToken = await result.user.getIdToken();

    await loginAction(idToken);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
