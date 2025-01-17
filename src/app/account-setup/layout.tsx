import Image from "next/image";
import { Fragment, ReactNode } from "react";

export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <Fragment>
      <div className="relative sm:absolute w-full flex flex-col dark:bg-zinc-800 z-20">
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

      <main className="absolute top-0 left-0 w-screen h-screen flex justify-center mt-16 dark:bg-zinc-800">
        {children}
      </main>
    </Fragment>
  );
}
