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
    <main className="flex h-full w-full dark:bg-zinc-900">
      <SidebarProvider>
        <Sidebar currentTheme={currentTheme} />

        <div className="flex flex-col z-10 h-full w-full lg:max-w-[calc(100%-220px)] lg:ml-[220px] bg-primary-bg dark:bg-zinc-800 dark:text-zinc-50 transition-all overflow-auto">
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
