import { getLanguage } from "@/app/actions/cookies/getLanguague";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  const locale = await getLanguage();

  const common = await import(`../../public/locale/${locale}/common.json`);
  const auth = await import(`../../public/locale/${locale}/auth.json`);
  const category = await import(`../../public/locale/${locale}/category.json`);
  const expenses = await import(`../../public/locale/${locale}/expenses.json`);
  const incomes = await import(`../../public/locale/${locale}/incomes.json`);
  const cashFlow = await import(`../../public/locale/${locale}/cashFlow.json`);
  const subscriptions = await import(
    `../../public/locale/${locale}/subscriptions.json`
  );
  const analytics = await import(
    `../../public/locale/${locale}/analytics.json`
  );
  const creditCard = await import(
    `../../public/locale/${locale}/creditCard.json`
  );
  const notifications = await import(
    `../../public/locale/${locale}/notifications.json`
  );
  const bankAccount = await import(
    `../../public/locale/${locale}/bankAccount.json`
  );
  const accountSetup = await import(
    `../../public/locale/${locale}/accountSetup.json`
  );

  return {
    locale,
    messages: {
      ...auth,
      ...common,
      ...accountSetup,
      ...notifications,
      ...bankAccount,
      ...creditCard,
      ...category,
      ...analytics,
      ...expenses,
      ...incomes,
      ...subscriptions,
      ...cashFlow,
    },
  };
});
