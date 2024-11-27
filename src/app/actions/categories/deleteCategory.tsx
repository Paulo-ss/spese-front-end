"use server";

import { fetchResource } from "@/services/fetchService";
import { revalidateTag } from "next/cache";
import { ICategory } from "@/interfaces/category.interface";

export default async function deleteCategory(categoryId: number) {
  const { data, error } = await fetchResource<ICategory>({
    url: `/category/${categoryId}`,
    config: {
      options: {
        method: "DELETE",
      },
    },
  });

  revalidateTag("your-categories");

  return { data, error };
}
