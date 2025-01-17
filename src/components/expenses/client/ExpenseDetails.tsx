"use client";

import ExpenseForm from "@/components/forms/expenses/ExpenseForm";
import { IAPIError } from "@/interfaces/api-error.interface";
import { IExpense } from "@/interfaces/expenses.interface";
import { useTranslations } from "next-intl";
import { useRouter } from "next-nprogress-bar";
import { FC, Fragment, useState } from "react";
import {
  IconBarbell,
  IconBeach,
  IconBurger,
  IconCar,
  IconCash,
  IconChevronLeft,
  IconContract,
  IconDeviceGamepad2,
  IconDog,
  IconEdit,
  IconForbid,
  IconHanger,
  IconHome,
  IconHospital,
  IconSchool,
  IconX,
} from "@tabler/icons-react";
import IconButton from "@/components/ui/button/IconButton";
import ErrorDisplay from "@/components/ui/errorDisplay/ErrorDisplay";
import { ExpenseStatus } from "@/enums/expenses.enum";
import Image from "next/image";
import CreditCard from "@/components/creditCards/CreditCard";
import Link from "next/link";
import { Fade } from "react-awesome-reveal";

interface IProps {
  expense?: IExpense;
  error?: IAPIError;
  locale: string;
}

const categories = {
  "NÃO INFORMADO": {
    icon: <IconForbid />,
  },
  SAÚDE: {
    icon: <IconHospital />,
  },
  LAZER: {
    icon: <IconBeach />,
  },
  ACADÊMICO: {
    icon: <IconSchool />,
  },
  DIVERSÃO: {
    icon: <IconDeviceGamepad2 />,
  },
  COMIDA: {
    icon: <IconBurger />,
  },
  CASA: {
    icon: <IconHome />,
  },
  ROUPAS: {
    icon: <IconHanger />,
  },
  PETS: {
    icon: <IconDog />,
  },
  UBER: {
    icon: <IconCar />,
  },
  INVESTIMENTO: {
    icon: <IconCash />,
  },
  ACADEMIA: {
    icon: <IconBarbell />,
  },
  ASSINATURA: {
    icon: <IconContract />,
  },
};

type CategoryKey = keyof typeof categories;

const ExpenseDetails: FC<IProps> = ({ expense, error, locale }) => {
  const [isEditing, setIsEditing] = useState(false);

  const router = useRouter();
  const t = useTranslations();

  const updateIsEditing = (isEditing: boolean) => setIsEditing(isEditing);

  return (
    <Fragment>
      <div className="w-full shadow-sm rounded-md bg-white dark:bg-zinc-900 dark:text-zinc-50">
        <div className="relative w-full p-2 md:p-4 rounded-md h-40 bg-zinc-50 dark:bg-zinc-950">
          {error || !expense ? (
            <ErrorDisplay
              errorMessage={
                error ? error.errorMessage : t("utils.somethingWentWrong")
              }
            />
          ) : (
            <Fragment>
              <div className="absolute top-4 left-2 md:left-4 flex items-center gap-2">
                <div
                  className={`flex justify-center items-center p-1 w-8 h-8 md:p-2 md:w-12 md:h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-zinc-200`}
                  style={{
                    backgroundColor: expense?.customCategory
                      ? expense.customCategory.color
                      : undefined,
                  }}
                >
                  {expense?.customCategory
                    ? expense.customCategory.name.charAt(0).toUpperCase()
                    : categories[expense?.category as CategoryKey].icon}
                </div>

                <p className="font-bold text-sm sm:text-base md:text-2xl">
                  {expense?.name}{" "}
                </p>
              </div>

              <div className="absolute top-4 right-2 md:right-4 flex items-center gap-1 md:gap-2">
                {isEditing ? (
                  <IconButton
                    type="button"
                    color="error"
                    icon={<IconX />}
                    onClick={() => updateIsEditing(false)}
                  />
                ) : (
                  <IconButton
                    type="button"
                    color="info"
                    icon={<IconEdit />}
                    onClick={() => updateIsEditing(true)}
                  />
                )}

                <IconButton
                  type="button"
                  color="secondary"
                  variant="outlined"
                  icon={<IconChevronLeft />}
                  onClick={() => router.push("/expenses")}
                />
              </div>

              <div className="absolute bottom-4 left-2 md:left-4 flex flex-col gap-1">
                <p className="font-bold text-base md:text-lg">
                  {Number(expense?.price).toLocaleString(locale, {
                    style: "currency",
                    currency: locale === "pt" ? "BRL" : "USD",
                  })}
                </p>
                <p className="italic text-sm">{expense?.expenseType}</p>
              </div>

              <div
                className={`absolute bottom-4 right-2 md:right-4 p-2 md:py-2 md:px-4 rounded-2xl font-bold ${
                  expense.status === ExpenseStatus.PENDING
                    ? "bg-amber-500 dark:bg-amber-700 text-zinc-50"
                    : "bg-emerald-400 dark:bg-emerald-600 text-zinc-50"
                } transition-colors`}
              >
                {expense.status === ExpenseStatus.PENDING
                  ? t("expenses.PENDING")
                  : t("expenses.PAID")}
              </div>
            </Fragment>
          )}
        </div>

        {!error && (
          <div className="p-2 md:p-4">
            {isEditing ? (
              <ExpenseForm
                expense={expense}
                error={error}
                locale={locale}
                updateIsEditing={(isEditing: boolean) =>
                  updateIsEditing(isEditing)
                }
              />
            ) : (
              <Fade duration={300} direction="up" triggerOnce cascade>
                <div className="grid grid-cols-2 gap-4 md:flex md:flex-row md:flex-wrap md:gap-8 p-4">
                  {expense!.creditCard && (
                    <Link
                      href={`/credit-cards/${expense!.creditCard.id}`}
                      className="col-span-2 flex flex-col gap-3 md:grow md:min-w-80"
                    >
                      <p className="text-base md:text-2xl font-bold">
                        {t("creditCard.DEFAULT")}
                      </p>

                      <div className="flex flex-row items-center gap-2">
                        <CreditCard creditCard={expense!.creditCard!} />
                      </div>
                    </Link>
                  )}

                  {expense!.bankAccount && (
                    <div className="col-span-1 flex flex-col gap-3 md:grow">
                      <p className="text-base md:text-2xl font-bold">
                        {t("creditCard.bank")}
                      </p>

                      <div className="flex flex-row items-center gap-2">
                        <Image
                          src={`/images/logos/${
                            expense!.bankAccount?.bank
                          }.png`}
                          width={512}
                          height={512}
                          alt={`${expense!.bankAccount?.bank} logo`}
                          className="w-6 h-6 rounded-full"
                        />

                        <p>{expense!.bankAccount.bank}</p>
                      </div>
                    </div>
                  )}

                  <div className="col-span-1 flex flex-col gap-3 md:grow">
                    <p className="text-base md:text-2xl font-bold">
                      {t("expenses.date")}
                    </p>

                    <p>{expense?.expenseDate}</p>
                  </div>

                  <div className="col-span-1 flex flex-col gap-3 md:grow">
                    <p className="text-base md:text-2xl font-bold">
                      {t("expenses.category")}
                    </p>

                    <p>
                      {expense!.customCategory
                        ? expense!.customCategory.name
                        : expense!.category}
                    </p>
                  </div>

                  {expense!.installmentNumber && (
                    <div className="col-span-1 flex flex-col gap-3 md:grow">
                      <p className="text-base md:text-2xl font-bold">
                        {t("expenses.installed")}
                      </p>

                      <p>
                        {expense!.installmentNumber} /{" "}
                        {expense!.totalInstallments}
                      </p>
                    </div>
                  )}
                </div>
              </Fade>
            )}
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default ExpenseDetails;
