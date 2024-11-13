"use server";

import { IUpdateUser } from "@/interfaces/user-data.interface";
import { auth, updateSession } from "../../../../auth";

export default async function updateUserSession(updatedUserData: IUpdateUser) {
  const session = await auth();

  await updateSession({
    ...session,
    user: { ...session?.user, ...updatedUserData },
  });
}
