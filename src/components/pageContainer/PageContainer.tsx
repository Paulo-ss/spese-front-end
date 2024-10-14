import { Fragment } from "react";

type Props = {
  description?: string;
  children: JSX.Element | JSX.Element[];
  title?: string;
};

const PageContainer = ({ title, description, children }: Props) => (
  <Fragment>
    <title>{title}</title>

    <meta name="description" content={description} />

    {children}
  </Fragment>
);

export default PageContainer;
