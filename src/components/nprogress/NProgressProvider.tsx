"use client";

import { FC, Fragment, ReactNode } from "react";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

interface IProps {
  children: ReactNode;
}

const NProgressProvider: FC<IProps> = ({ children }) => {
  return (
    <Fragment>
      {children}

      <ProgressBar
        height="2px"
        color="#3F836C"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </Fragment>
  );
};

export default NProgressProvider;
