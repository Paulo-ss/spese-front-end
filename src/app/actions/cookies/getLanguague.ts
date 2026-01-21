"use server";

import { Locale } from "@/types/locale.type";
import { cookies } from "next/headers";

export async function getLanguage(): Promise<Locale> {
  const cookieStore = cookies();

  const cookie = cookieStore.get("current-lang");
  if (cookie) {
    const language: Locale = cookie.value as Locale;

    return language;
  }

  return "pt";
}
