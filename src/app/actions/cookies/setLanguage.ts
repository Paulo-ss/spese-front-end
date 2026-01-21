"use server";

import { Locale } from "@/types/locale.type";
import { cookies } from "next/headers";

const SESSION_SECURE = process.env.AUTH_URL?.startsWith("https://");

export async function setLanguage(lang: Locale) {
  const cookieStore = cookies();

  cookieStore.set("current-lang", lang, {
    sameSite: "lax",
    secure: SESSION_SECURE,
  });
}
