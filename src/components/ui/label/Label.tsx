"use client";

import { FC } from "react";

interface IProps {
  name: string;
  label: string;
}

const Label: FC<IProps> = ({ name, label }) => {
  return (
    <label className="mb-2 text-black dark:text-zinc-50" htmlFor={name}>
      {label}
    </label>
  );
};

export default Label;
