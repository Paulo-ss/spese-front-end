"use server";

import { signOut as authSignOut } from "@/../auth";
import { redirect } from "next/navigation";

export default async function signOut() {
  try {
    await authSignOut();
  } catch (error) {
    console.log("SIGN OUT ERROR: " + error);
  } finally {
    redirect("/auth/sign-in");
  }
}
