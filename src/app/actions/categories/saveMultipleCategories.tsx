"use server";

import { fetchResource } from "@/services/fetchService";
import { IGenericMessageResponse } from "@/interfaces/generic-message.interface";
import { revalidateTag } from "next/cache";

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

  revalidateTag("your-categories");

  return { data, error };
}
