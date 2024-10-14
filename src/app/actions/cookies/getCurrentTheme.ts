"use server";

import { Theme } from "@/enums/theme.enum";
import { cookies } from "next/headers";

export async function getCurrentTheme() {
  const cookieStore = cookies();

  const cookie = cookieStore.get("current-theme");
  if (cookie) {
    const theme = cookie.value as Theme;

    return theme;
  }

  return Theme.LIGHT;
}
