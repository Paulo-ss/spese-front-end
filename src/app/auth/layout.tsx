import Slogan from "@/components/auth/slogan/Slogan";
import Image from "next/image";
import { Fragment, ReactNode } from "react";

export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <Fragment>
      <div className="relative sm:absolute flex flex-col dark:bg-zinc-900">
        <div className="max-w-44 mb-4 p-6 sm:p-4">
          <Image
            src="/images/logos/spese-logo-full.png"
            width={400}
            height={85}
            alt="Spese Logo - Full Version (with Wallet and Text)"
            priority
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 w-full h-full">
        <div className="p-6 dark:bg-zinc-900">{children}</div>

        <Slogan />
      </div>
    </Fragment>
  );
}
