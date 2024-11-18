"use client";

import { theme } from "@/lib/theme/theme";
import { IconAlertOctagon } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { FC } from "react";

interface IProps {
  errorMessage: string | string[];
}

const ErrorDisplay: FC<IProps> = ({ errorMessage }) => {
  const t = useTranslations();

  return (
    <div className="w-full p-4 flex items-center gap-4 rounded-md bg-red-100">
      <div className="flex justify-center items-center w-12 h-12">
        <IconAlertOctagon
          width={48}
          height={48}
          color={theme.colors.red[700]}
        />
      </div>

      <div className="grow">
        <h2 className="text-2xl font-bold text-red-700">{t("utils.error")}</h2>

        <p className="text-base text-red-700">{errorMessage}</p>
      </div>
    </div>
  );
};

export default ErrorDisplay;
