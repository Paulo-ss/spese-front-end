"use server";

import { IGenericMessageResponse } from "@/interfaces/generic-message.interface";
import { fetchResource } from "@/services/fetchService";

export default async function markNotificationAsRead(id: number) {
  const { data, error } = await fetchResource<IGenericMessageResponse>({
    url: `/notifications/${id}`,
    config: { options: { method: "PUT" } },
  });

  return { data, error };
}
