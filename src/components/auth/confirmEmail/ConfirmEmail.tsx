"use client";

import { IconCheckbox, IconXboxX } from "@tabler/icons-react";
import Link from "next/link";
import React, { FC, Fragment } from "react";
import { Fade } from "react-awesome-reveal";

interface IProps {
  error: string | string[] | undefined;
}

const ConfirmEmail: FC<IProps> = ({ error }) => {
  return (
    <div className="h-full flex flex-col justify-center items-center px-2 md:px-6">
      <Fragment>
        {error ? (
          <Fade direction="up" duration={500} cascade>
            <IconXboxX className="w-20 h-20" color="#db3030" />

            <h3 className="text-lg font-bold text-center mt-2 dark:text-zinc-50">
              erro ao confirmar a conta
            </h3>

            <p className="text-sm text-gray-700 dark:text-zinc-50 text-center mt-5 mb-5 w-96">
              {Array.isArray(error)
                ? error.map((e, index) => <span key={index}>{e}</span>)
                : error}
            </p>

            <Link href="/">
              <p className="text-sm underline italic text-blue-400 ml-1">
                página inicial
              </p>
            </Link>
          </Fade>
        ) : (
          <Fade direction="up" duration={500} cascade>
            <IconCheckbox className="w-20 h-20" color="#86EFAC" />

            <h3 className="text-lg font-bold text-center dark:text-zinc-50">
              conta confirmada
            </h3>

            <p className="text-sm text-gray-700 dark:text-zinc-50 text-center mt-5 mb-5 w-96">
              faça seu login e começa a controlar sua vida financeira agora
              mesmo
            </p>

            <Link href="/auth/sign-in">
              <p className="text-sm underline italic text-blue-400 ml-1">
                fazer login
              </p>
            </Link>
          </Fade>
        )}
      </Fragment>
    </div>
  );
};

export default ConfirmEmail;
