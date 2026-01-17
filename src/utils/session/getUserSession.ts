import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { auth } from "../../../auth";

export const getUserSession = async () => {
  const isOnServer = typeof window === "undefined";
  let session: Session | null = null;

  if (isOnServer) {
    session = await auth();
  } else {
    session = await getSession();
  }

  return session;
};
