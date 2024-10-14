import Loader from "@/components/ui/loader/Loader";

export default function Loading() {
  return (
    <div className="absolute top-0 left-0 w-screen h-screen flex justify-center items-center bg-white dark:bg-zinc-900">
      <Loader />
    </div>
  );
}
