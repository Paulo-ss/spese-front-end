"use server";

import { fetchResource } from "@/services/fetchService";
import { IGenericMessageResponse } from "@/interfaces/generic-message.interface";
import { ISignUp } from "@/interfaces/sign-up.interface";

export default async function signUp(data: ISignUp) {
  const { data: responseData, error } =
    await fetchResource<IGenericMessageResponse>({
      url: "/authorization/sign-up",
      config: {
        options: { method: "POST", body: JSON.stringify({ ...data }) },
      },
    });

  return { responseData, error };
}
