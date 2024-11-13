"use server";

import { fetchResource } from "@/services/fetchService";
import { IGenericMessageResponse } from "@/interfaces/generic-message.interface";

export default async function saveMultipleCategories(
  categories: { name: string }[]
) {
  const { data, error } = await fetchResource<IGenericMessageResponse>({
    url: "/category/create-multiple",
    config: {
      options: {
        method: "POST",
        body: JSON.stringify(categories),
      },
    },
  });

  return { data, error };
}
