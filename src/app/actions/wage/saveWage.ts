"use server";

import { IWage } from "@/interfaces/wage.interface";
import { fetchResource } from "@/services/fetchService";
import { auth, updateSession } from "../../../../auth";

export default async function saveWage(wage: string) {
  const session = await auth();
  const fixedWage = Number(wage).toFixed(2);

  const { data, error } = await fetchResource<IWage>({
    url: "/income/wage",
    config: {
      options: {
        method: "POST",
        body: JSON.stringify({ wage: Number(fixedWage) }),
      },
    },
  });

  // await updateSession({
  //   ...session,
  //   user: { ...session?.user, accountSetup: true },
  // });

  return { data, error };
}
