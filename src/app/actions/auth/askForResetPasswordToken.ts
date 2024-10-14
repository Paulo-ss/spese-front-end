"use server";

import { IGenericMessageResponse } from "@/interfaces/generic-message.interface";
import { IResetPassword } from "@/interfaces/reset-password.interface";
import { fetchResource } from "@/services/fetchService";

export default async function askForResetPasswordToken(data: IResetPassword) {
  const { data: responseData, error } =
    await fetchResource<IGenericMessageResponse>({
      url: "/authorization/reset-password-email",
      config: {
        options: { method: "POST", body: JSON.stringify({ ...data }) },
      },
    });

  return { responseData, error };
}
