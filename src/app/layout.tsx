import { Toaster } from "@/components/ui/toaster";
import { getCurrentTheme } from "@/app/actions/cookies/getCurrentTheme";
import { Afacad } from "next/font/google";
import "@/lib/translation/i18n";

import "./globals.css";

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

  return (
    <html lang="pt" className="h-full">
      <body className={`h-full ${theme} ${afacad.className}`}>
        {children}

        <Toaster />
      </body>
    </html>
  );
}
