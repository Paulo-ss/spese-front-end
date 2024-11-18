"use client";

import { useTranslations } from "next-intl";
import { FC, ReactNode } from "react";
import Divider from "../divider/Divider";

interface IProps {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
}

const Card: FC<IProps> = ({ title, children, icon, action }) => {
  const t = useTranslations();

  return (
    <div className="w-full p-4 shadow-sm rounded-md bg-white dark:bg-zinc-900 dark:text-zinc-50">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {icon && <span>{icon}</span>}

          <p className="text-lg font-bold">{t(title)}</p>
        </div>

        {action}
      </div>

      <Divider />

      <div>{children}</div>
    </div>
  );
};

export default Card;
