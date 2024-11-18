"use client";

const MonthSummaryLoading = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 w-full gap-4 rounded-md">
      <div className="col-span-1 flex items-center gap-2 animate-pulse p-3 rounded-md shadow-sm bg-white dark:bg-zinc-900">
        <div className="w-10 h-10 rounded-md bg-zinc-100 dark:bg-zinc-600"></div>

        <div className="flex flex-col gap-2">
          <div className="h-2 w-20 rounded bg-zinc-100 dark:bg-zinc-600"></div>
          <div className="h-2 w-32 rounded bg-zinc-100 dark:bg-zinc-600"></div>
        </div>
      </div>

      <div className="col-span-1 flex items-center gap-2 animate-pulse p-3 rounded-md shadow-sm bg-white dark:bg-zinc-900">
        <div className="w-10 h-10 rounded-md bg-zinc-100 dark:bg-zinc-600"></div>

        <div className="flex flex-col gap-2">
          <div className="h-2 w-20 rounded bg-zinc-100 dark:bg-zinc-600"></div>
          <div className="h-2 w-32 rounded bg-zinc-100 dark:bg-zinc-600"></div>
        </div>
      </div>

      <div className="col-span-1 flex items-center gap-2 animate-pulse p-3 rounded-md shadow-sm bg-white dark:bg-zinc-900">
        <div className="w-10 h-10 rounded-md bg-zinc-100 dark:bg-zinc-600"></div>

        <div className="flex flex-col gap-2">
          <div className="h-2 w-20 rounded bg-zinc-100 dark:bg-zinc-600"></div>
          <div className="h-2 w-32 rounded bg-zinc-100 dark:bg-zinc-600"></div>
        </div>
      </div>

      <div className="col-span-1 flex items-center gap-2 animate-pulse p-3 rounded-md shadow-sm bg-white dark:bg-zinc-900">
        <div className="w-10 h-10 rounded-md bg-zinc-100 dark:bg-zinc-600"></div>

        <div className="flex flex-col gap-2">
          <div className="h-2 w-20 rounded bg-zinc-100 dark:bg-zinc-600"></div>
          <div className="h-2 w-32 rounded bg-zinc-100 dark:bg-zinc-600"></div>
        </div>
      </div>
    </div>
  );
};

export default MonthSummaryLoading;
