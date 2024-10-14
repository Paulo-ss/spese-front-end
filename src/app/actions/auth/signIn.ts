"use server";

import { ISignIn } from "@/interfaces/sign-in.interface";
import { signIn as signInAuth } from "@/../auth";
import { AuthError } from "next-auth";
import { IAPIError } from "@/interfaces/api-error.interface";

export default async function signIn(data: ISignIn) {
  try {
    await signInAuth("credentials", {
      login: data.emailOrUsername,
      password: data.password,
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
