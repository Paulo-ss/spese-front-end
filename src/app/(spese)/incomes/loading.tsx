"use client";

import CardLoading from "@/components/ui/loading/CardLoading";
import ListItemLoading from "@/components/ui/loading/ListItemLoading";

export default function Loading() {
  return (
    <div className="w-full h-full flex flex-col justify-center bg-primary-bg dark:bg-zinc-900">
      <div className="animate-pulse p-2 flex items-center gap-3 mb-4">
        <span className="h-3 w-52 bg-zinc-100 dark:bg-zinc-600" />
      </div>

      <CardLoading>
        <ListItemLoading items={6} />
      </CardLoading>
    </div>
  );
}
