import { Toaster } from "@/components/ui/toaster";
import { getCurrentTheme } from "@/app/actions/cookies/getCurrentTheme";
import { Afacad } from "next/font/google";

import "./globals.css";
import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import NProgressProvider from "@/components/nprogress/NProgressProvider";

const afacad = Afacad({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = await getCurrentTheme();
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className="h-full">
      <body className={`h-full ${theme} ${afacad.className}`}>
        <NProgressProvider>
          <NextIntlClientProvider messages={messages}>
            {children}

            <Toaster />
          </NextIntlClientProvider>
        </NProgressProvider>
      </body>
    </html>
  );
}
