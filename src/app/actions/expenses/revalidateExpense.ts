"use server";

import { revalidateTag } from "next/cache";

export default async function revalidateExpense() {
  revalidateTag("expense-details");
}
