"use client";

import CardLoading from "@/components/ui/loading/CardLoading";
import ListItemLoading from "@/components/ui/loading/ListItemLoading";

export default function Loading() {
  return (
    <div className="w-full h-full flex justify-center bg-primary-bg dark:bg-zinc-900">
      <CardLoading>
        <ListItemLoading items={6} />
      </CardLoading>
    </div>
  );
}
