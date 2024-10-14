"use server";

import { IGenericMessageResponse } from "@/interfaces/generic-message.interface";
import {
  INewPassword,
  IResetToken,
} from "@/interfaces/reset-password.interface";
import { fetchResource } from "@/services/fetchService";

export default async function resetPassword(data: IResetToken & INewPassword) {
  const { data: responseData, error } =
    await fetchResource<IGenericMessageResponse>({
      url: "/authorization/reset-password",
      config: {
        options: { method: "POST", body: JSON.stringify({ ...data }) },
      },
    });

  return { responseData, error };
}
