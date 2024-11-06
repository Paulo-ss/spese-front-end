"use client";

import { useTranslations } from "next-intl";
import { Fragment } from "react";

type Props = {
  description?: string;
  children: JSX.Element | JSX.Element[];
  title?: string;
};

const PageContainer = ({ title, description, children }: Props) => {
  const t = useTranslations();

  return (
    <Fragment>
      <title>{`${t(title!)} - spese`}</title>

      <meta name="description" content={description} />

      {children}
    </Fragment>
  );
};

export default PageContainer;
