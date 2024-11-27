"use server";

import { fetchResource } from "@/services/fetchService";
import { revalidateTag } from "next/cache";
import { ICategory } from "@/interfaces/category.interface";

export default async function editCategory(
  categoryId: number,
  category: { name: string }
) {
  const { data, error } = await fetchResource<ICategory>({
    url: `/category/${categoryId}`,
    config: {
      options: {
        method: "PUT",
        body: JSON.stringify(category),
      },
    },
  });

  revalidateTag("your-categories");

  return { data, error };
}
