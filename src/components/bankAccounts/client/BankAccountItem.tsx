"use client";

import { IBankAccount } from "@/interfaces/bank-account.interface";
import { IconChevronRight } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

interface IProps {
  bankAccount: IBankAccount;
  locale: string;
}

const BankAccountItem: FC<IProps> = ({ bankAccount, locale }) => {
  const t = useTranslations();

  return (
    <Link key={bankAccount.id} href={`/bank-accounts/${bankAccount.id}`}>
      <div className="p-2 flex items-center gap-3 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-950 transition-colors">
        <div className="flex items-center">
          <div className="w-10 h-10">
            <Image
              src={`/images/logos/${bankAccount.bank}.png`}
              width={512}
              height={512}
              alt={`${bankAccount.bank} logo`}
              className="overflow-hidden rounded-full"
            />
          </div>
        </div>

        <div className="grow flex items-end gap-2">
          <p className="text-base font-bold">{bankAccount.bank}</p>
        </div>

        <div className="flex flex-col items-end">
          <p className="text-base">{t("bankAccount.currentBalance")}</p>

          <p className="text-base md:text-lg font-bold">
            {Number(bankAccount.currentBalance).toLocaleString(locale, {
              style: "currency",
              currency: locale === "pt" ? "BRL" : "USD",
            })}
          </p>
        </div>

        <IconChevronRight />
      </div>
    </Link>
  );
};

export default BankAccountItem;
