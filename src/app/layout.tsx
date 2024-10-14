import { Toaster } from "@/components/ui/toaster";
import { getCurrentTheme } from "@/app/actions/cookies/getCurrentTheme";
import { Montserrat } from "next/font/google";

import "./globals.css";

const montserrat = Montserrat({
  weight: ["300", "400", "700"],
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
      <body className={`h-full ${theme} ${montserrat.className}`}>
        {children}

        <Toaster />
      </body>
    </html>
  );
}
