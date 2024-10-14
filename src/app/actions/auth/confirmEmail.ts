"use server";

import { IConfirmEmail } from "@/interfaces/confirm-email.interface";
import { IGenericMessageResponse } from "@/interfaces/generic-message.interface";
import { fetchResource } from "@/services/fetchService";

export default async function confirmEmailToken(data: IConfirmEmail) {
  const { data: responseData, error } =
    await fetchResource<IGenericMessageResponse>({
      url: "/authorization/confirm-email",
      config: {
        options: { method: "POST", body: JSON.stringify({ ...data }) },
      },
    });

  return { responseData, error };
}
