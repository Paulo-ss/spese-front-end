"use client";

import { useTranslation } from "react-i18next";

const Slogan = () => {
  const { t } = useTranslation("common");

  return (
    <div className="flex text-center bg-emerald-50 dark:bg-emerald-800 dark:text-white flex-col justify-center items-center h-full p-6">
      <h2 className="text-4xl font-bold mb-2">spese</h2>

      <p className="italic">{t("slogan")}</p>
    </div>
  );
};

export default Slogan;
