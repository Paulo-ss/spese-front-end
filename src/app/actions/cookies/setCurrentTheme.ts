"use server";

import { Theme } from "@/enums/theme.enum";
import { cookies } from "next/headers";

const SESSION_SECURE = process.env.AUTH_URL?.startsWith("https://");

export async function setCurrentTheme(theme: Theme) {
  const cookieStore = cookies();

  cookieStore.set("current-theme", theme, {
    sameSite: "lax",
    secure: SESSION_SECURE,
  });
}
