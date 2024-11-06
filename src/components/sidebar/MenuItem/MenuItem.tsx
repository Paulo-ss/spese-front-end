import { SidebarContext } from "@/contexts/SidebarContext";
import { IMenuItem } from "@/interfaces/menu-items.interface";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, useContext } from "react";

interface IProps {
  item: IMenuItem;
  level?: number;
}

const MenuItem: FC<IProps> = ({ item }) => {
  const { isSidebarMobile, toggleSidebar } = useContext(SidebarContext);
  const t = useTranslations();
  const pathname = usePathname();
  const isCurrentPath = pathname === item.path;

  if (item.subHeader) {
    return (
      <li className="text-zinc-700 font-bold dark:text-zinc-500 mt-4 mb-2">
        {t(item.title)}
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

        <p className="text-sm">{t(item.title)}</p>
      </li>
    );
  }

  return (
    <li
      onClick={() => {
        if (isSidebarMobile) {
          toggleSidebar();
        }
      }}
    >
      <Link
        href={item.path!}
        className={`flex items-center w-full p-3 mb-1 hover:bg-primary dark:hover:bg-primary-dark rounded-md transition-colors ${
          isCurrentPath && "bg-primary dark:bg-primary-dark"
        }`}
      >
        {item.icon && <span className="mr-2">{item.icon}</span>}

        <p className="text-sm">{t(item.title)}</p>
      </Link>
    </li>
  );
};

export default MenuItem;
