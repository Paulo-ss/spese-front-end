"use server";

import { cookies } from "next/headers";

export async function getLanguage() {
  const cookieStore = cookies();

  const cookie = cookieStore.get("current-lang");
  if (cookie) {
    const theme = cookie.value;

    return theme;
  }

  return "pt";
}
