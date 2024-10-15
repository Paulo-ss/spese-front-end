import { IMenuItem } from "@/interfaces/menu-items.interface";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";

interface IProps {
  item: IMenuItem;
  level?: number;
}

const MenuItem: FC<IProps> = ({ item }) => {
  const pathname = usePathname();
  const isCurrentPath = pathname === item.path;

  if (item.subHeader) {
    return (
      <li className="text-zinc-700 font-bold dark:text-zinc-500 mt-4 mb-2">
        {item.title}
      </li>
    );
  }

  if (item.onClick) {
    return (
      <li
        className="flex items-center w-full p-3 hover:bg-primary dark:hover:bg-primary-dark rounded-md transition-colors cursor-pointer"
        onClick={item.onClick}
      >
        {item.icon && <span className="mr-2">{item.icon}</span>}

        <p className="text-sm">{item.title}</p>
      </li>
    );
  }

  return (
    <li>
      <Link
        href={item.path!}
        className={`flex items-center w-full p-3 mb-1 hover:bg-primary dark:hover:bg-primary-dark rounded-md transition-colors ${
          isCurrentPath && "bg-primary dark:bg-primary-dark"
        }`}
      >
        {item.icon && <span className="mr-2">{item.icon}</span>}

        <p className="text-sm">{item.title}</p>
      </Link>
    </li>
  );
};

export default MenuItem;
