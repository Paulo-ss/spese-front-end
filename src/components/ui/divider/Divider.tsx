import React, { FC } from "react";

interface IProps {
  text?: string;
}

const Divider: FC<IProps> = ({ text }) => {
  if (text) {
    return (
      <span className="w-full flex justify-center items-center my-4">
        <span className="w-full h-[1px] bg-gray-100 dark:bg-zinc-500"></span>

        <p className="text-sm italic mx-4 dark:text-zinc-50">{text}</p>

        <span className="w-full h-[1px] bg-gray-100 dark:bg-zinc-500"></span>
      </span>
    );
  }

  return (
    <span className="w-full flex h-[1px] bg-gray-100 dark:bg-zinc-500 my-4" />
  );
};

export default Divider;
