"use server";

import { signIn as signInAuth } from "@/../auth";
import { IAPIError } from "@/interfaces/api-error.interface";
import { AuthError } from "next-auth";

export async function externalOAuth2SignIn(code: string) {
  try {
    await signInAuth("credentials", {
      login: code,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      const errorRaw = error.cause?.err?.message;
      if (errorRaw) {
        const signInError = JSON.parse(errorRaw) as IAPIError;

        return { errorMessage: signInError.errorMessage as string };
      }
    }
  }
}
