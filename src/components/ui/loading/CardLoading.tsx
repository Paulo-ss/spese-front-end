"use client";

import { FC, ReactNode } from "react";
import Divider from "../divider/Divider";

interface IProps {
  children: ReactNode;
}

const CardLoading: FC<IProps> = ({ children }) => {
  return (
    <div className="w-full p-4 shadow-sm rounded-md bg-white dark:bg-zinc-900 dark:text-zinc-50">
      <div className="animate-pulse flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-md bg-zinc-100 dark:bg-zinc-600" />

          <span className="h-3 w-40 rounded bg-zinc-100 dark:bg-zinc-600" />
        </div>

        <span className="w-10 h-10 rounded-md bg-zinc-100 dark:bg-zinc-600" />
      </div>

      <Divider />

      {children}
    </div>
  );
};

export default CardLoading;
