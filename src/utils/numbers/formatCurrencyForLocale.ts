import { Locale } from "@/types/locale.type";

const currencyByLocaleMap = {
  pt: "BRL",
  en: "USD",
};

export const formatCurrencyForLocale = ({
  number,
  locale,
}: {
  number: number;
  locale: Locale;
}): string => {
  return number.toLocaleString(locale, {
    style: "currency",
    currency: currencyByLocaleMap[locale],
  });
};
