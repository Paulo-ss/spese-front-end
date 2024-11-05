"use client";

import { FC, Fragment, ReactNode } from "react";
import "@/lib/translation/i18n";

interface IProps {
  children: ReactNode;
}

const TranslationProvider: FC<IProps> = ({ children }) => {
  return <Fragment>{children}</Fragment>;
};

export default TranslationProvider;
