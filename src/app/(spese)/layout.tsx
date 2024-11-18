import Header from "@/components/header/Header";
import Sidebar from "@/components/sidebar/Sidebar";
import { ReactNode } from "react";
import { auth } from "../../../auth";
import SidebarProvider from "@/contexts/SidebarContext";
import { getCurrentTheme } from "../actions/cookies/getCurrentTheme";

export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const session = await auth();
  const currentTheme = await getCurrentTheme();

  return (
    <main className="flex h-screen w-full dark:bg-zinc-900">
      <SidebarProvider>
        <Sidebar currentTheme={currentTheme} />

        <div className="flex grow flex-col z-10 h-ful bg-primary-bg dark:bg-zinc-800 dark:text-zinc-50">
          <Header session={session} />

          <div className="max-w-full">
            <div className="min-h-[calc(100vh-80px)] px-4 sm:px-6 py-4">
              {children}
            </div>
          </div>
        </div>
      </SidebarProvider>
    </main>
  );
}
