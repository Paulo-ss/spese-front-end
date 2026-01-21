"use client";

import IconButton from "@/components/ui/button/IconButton";
import Card from "@/components/ui/card/Card";
import ErrorDisplay from "@/components/ui/errorDisplay/ErrorDisplay";
import { IAPIError } from "@/interfaces/api-error.interface";
import { IBankAccount } from "@/interfaces/bank-account.interface";
import {
  IconBuildingBank,
  IconChevronRight,
  IconClipboardOff,
  IconPlus,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { FC, Fragment } from "react";
import BankAccountItem from "./BankAccountItem";
import { usePathname } from "next/navigation";
import { useRouter } from "next-nprogress-bar";

import { Locale } from "@/types/locale.type";

interface IProps {
  bankAccounts?: IBankAccount[];
  error?: IAPIError;
  locale: Locale;
}

const BankAccounts: FC<IProps> = ({ bankAccounts, error, locale }) => {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Card
      title="bankAccount.yourBankAccounts"
      icon={<IconBuildingBank />}
      action={
        <div className="flex items-center gap-2">
          <IconButton
            type="button"
            color="primary"
            icon={<IconPlus />}
            onClick={() => router.push("/bank-accounts/create")}
          />

          {!pathname.includes("bank") && (
            <IconButton
              type="button"
              color="secondary"
              variant="outlined"
              icon={<IconChevronRight />}
              onClick={() => router.push("/bank-accounts")}
            />
          )}
        </div>
      }
    >
      {error ? (
        <ErrorDisplay errorMessage={error.errorMessage} />
      ) : (
        <Fragment>
          {bankAccounts && bankAccounts.length === 0 ? (
            <div className="flex flex-col justify-center items-center">
              <IconClipboardOff width={40} height={40} />

              <p className="text-sm text-center mt-2 text-zinc-600 dark:text-zinc-50">
                {t("allClear")}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {bankAccounts?.map((bankAccount) => (
                <BankAccountItem
                  key={bankAccount.id}
                  bankAccount={bankAccount}
                  locale={locale}
                />
              ))}
            </div>
          )}
        </Fragment>
      )}
    </Card>
  );
};

export default BankAccounts;
