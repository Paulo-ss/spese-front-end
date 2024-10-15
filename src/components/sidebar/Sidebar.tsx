"use client";

import { setCurrentTheme } from "@/app/actions/cookies/setCurrentTheme";
import { SidebarContext } from "@/contexts/SidebarContext";
import { Theme } from "@/enums/theme.enum";
import { IMenuItem } from "@/interfaces/menu-items.interface";
import {
  IconBuildingBank,
  IconCash,
  IconCategory,
  IconCoins,
  IconCreditCard,
  IconMoonStars,
  IconPoint,
  IconReport,
  IconSunFilled,
  IconX,
} from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FC, useContext } from "react";
import MenuItem from "./MenuItem/MenuItem";
import { MenuCollapse } from "./MenuCollapse/MenuCollapse";

export const menuItems: IMenuItem[] = [
  {
    title: "principais",
    subHeader: true,
  },
  {
    title: "despesas",
    icon: <IconCoins />,
    path: "/expenses",
  },
  {
    title: "rendas",
    icon: <IconCash />,
    children: [
      { title: "salario", path: "/wage", icon: <IconPoint /> },
      { title: "extras", path: "/incomes", icon: <IconPoint /> },
    ],
  },
  {
    title: "seus bancos",
    icon: <IconBuildingBank />,
    path: "/bank-accounts",
  },
  {
    title: "cartões de crédito",
    icon: <IconCreditCard />,
    path: "/credit-cards",
  },
  {
    title: "suas categorias",
    icon: <IconCategory />,
    path: "/categories",
  },
  {
    title: "analítico",
    subHeader: true,
  },
  {
    title: "relatórios",
    icon: <IconReport />,
    children: [
      { title: "gráficos", path: "/graphs", icon: <IconPoint /> },
      { title: "baixar", path: "/report/download", icon: <IconPoint /> },
    ],
  },
];

interface IProps {
  currentTheme: Theme;
}

const Sidebar: FC<IProps> = ({ currentTheme }) => {
  const { isSidebarOpened, isSidebarMobile, toggleSidebar } =
    useContext(SidebarContext);
  const router = useRouter();

  const bottomMenuItems: IMenuItem[] = [
    {
      title: currentTheme === Theme.DARK ? "escuro" : "claro",
      icon: currentTheme === Theme.DARK ? <IconMoonStars /> : <IconSunFilled />,
      onClick: () => {
        setCurrentTheme(currentTheme === Theme.DARK ? Theme.LIGHT : Theme.DARK);
      },
    },
  ];

  return (
    <div
      className={`flex flex-col justify-between fixed top-0 left-0 z-20 lg:z-0 lg:relative h-screen w-full lg:w-[220px] px-4 pt-1 pb-4 bg-white dark:bg-zinc-950 dark:text-zinc-50 overflow-hidden ${
        isSidebarMobile && "-translate-x-full"
      } ${isSidebarOpened && "translate-x-0"} transition-transform`}
    >
      <div className="grow-0 flex justify-between items-center">
        <div
          className="max-w-44 mb-4 p-6 sm:p-4 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <Image
            src="/images/logos/spese-logo-full.png"
            width={400}
            height={85}
            alt="Spese Logo - Full Version (with Wallet and Text)"
            priority
          />
        </div>

        {isSidebarMobile && (
          <div
            className="flex justify-center items-center p-2 rounded-full cursor-pointer hover:bg-primary dark:hover:bg-zinc-950 transition-colors"
            onClick={toggleSidebar}
          >
            <IconX />
          </div>
        )}
      </div>

      <ul className="grow overflow-y-auto">
        {menuItems.map((item, index) => {
          if (item.children) {
            return <MenuCollapse key={`${item.title}.${index}`} item={item} />;
          }

          return <MenuItem key={`${item.title}.${index}`} item={item} />;
        })}
      </ul>

      <ul className="grow-0 mt-4">
        {bottomMenuItems.map((item, index) => (
          <MenuItem key={`${item.title}.${index}`} item={item} />
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
