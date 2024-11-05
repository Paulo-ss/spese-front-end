"use client";

import { Fragment } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  description?: string;
  children: JSX.Element | JSX.Element[];
  title?: string;
};

const PageContainer = ({ title, description, children }: Props) => {
  const { t } = useTranslation("common");

  return (
    <Fragment>
      <title>{`${t(title!, { ns: "common" })} - spese`}</title>

      <meta name="description" content={description} />

      {children}
    </Fragment>
  );
};

export default PageContainer;
