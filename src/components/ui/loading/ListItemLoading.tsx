"use client";

import { FC, Fragment } from "react";

interface IProps {
  items: number;
}

const ListItemLoading: FC<IProps> = ({ items }) => {
  return (
    <Fragment>
      {Array.from(Array(items).keys()).map((item) => (
        <div key={item} className="animate-pulse p-2 flex items-center gap-3">
          <span className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-600" />

          <div className="flex flex-col gap-2">
            <span className="h-2 w-20 bg-zinc-100 dark:bg-zinc-600" />

            <span className="h-2 w-40 bg-zinc-100 dark:bg-zinc-600" />
          </div>
        </div>
      ))}
    </Fragment>
  );
};

export default ListItemLoading;
