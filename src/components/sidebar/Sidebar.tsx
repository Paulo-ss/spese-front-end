"use client";

import { setCurrentTheme } from "@/app/actions/cookies/setCurrentTheme";
import { SidebarContext } from "@/contexts/SidebarContext";
import { Theme } from "@/enums/theme.enum";
import { IMenuItem } from "@/interfaces/menu-items.interface";
import {
  IconBuildingBank,
  IconCash,
  IconCashRegister,
  IconCategory,
  IconCoins,
  IconContract,
  IconCreditCard,
  IconMoonStars,
  IconPoint,
  IconReport,
  IconSunFilled,
  IconX,
} from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next-nprogress-bar";
import { FC, useContext, useMemo } from "react";
import MenuItem from "./MenuItem/MenuItem";
import { MenuCollapse } from "./MenuCollapse/MenuCollapse";

export const menuItems: IMenuItem[] = [
  {
    title: "menuItems.main",
    subHeader: true,
  },
  {
    title: "menuItems.cashFlow",
    icon: <IconCashRegister />,
    path: "/cash-flow",
  },
  {
    title: "menuItems.expenses",
    icon: <IconCoins />,
    path: "/expenses",
  },
  {
    title: "menuItems.incomes.DEFAULT",
    icon: <IconCash />,
    children: [
      { title: "menuItems.incomes.wage", path: "/wage", icon: <IconPoint /> },
      {
        title: "menuItems.incomes.entries",
        path: "/incomes",
        icon: <IconPoint />,
      },
    ],
  },
  {
    title: "menuItems.bankAccounts",
    icon: <IconBuildingBank />,
    path: "/bank-accounts",
  },
  {
    title: "menuItems.creditCards",
    icon: <IconCreditCard />,
    path: "/credit-cards",
  },
  {
    title: "menuItems.subscriptions",
    icon: <IconContract />,
    path: "/subscriptions",
  },
  {
    title: "menuItems.yourCategories",
    icon: <IconCategory />,
    path: "/categories",
  },
  {
    title: "menuItems.analytics",
    subHeader: true,
  },
  {
    title: "menuItems.reports.DEFAULT",
    icon: <IconReport />,
    children: [
      {
        title: "menuItems.reports.charts",
        path: "/reports/charts",
        icon: <IconPoint />,
      },
      {
        title: "menuItems.reports.export",
        path: "/reports/download",
        icon: <IconPoint />,
      },
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

  const bottomMenuItems: IMenuItem[] = useMemo(
    () => [
      {
        title: currentTheme === Theme.DARK ? "theme.dark" : "theme.light",
        icon:
          currentTheme === Theme.DARK ? <IconMoonStars /> : <IconSunFilled />,
        onClick: () => {
          setCurrentTheme(
            currentTheme === Theme.DARK ? Theme.LIGHT : Theme.DARK
          );
        },
      },
    ],
    [currentTheme]
  );

  return (
    <div
      className={`flex flex-col justify-between fixed top-0 left-0 z-20 h-full w-full lg:w-[220px] lg:z-0 px-4 pt-1 pb-4 bg-white dark:bg-zinc-950 dark:text-zinc-50 ${
        isSidebarMobile && "-translate-x-full"
      } ${isSidebarOpened && "translate-x-0"} transition-transform`}
    >
      <div className="grow-0 flex justify-between items-center">
        <div
          className="max-w-44 mb-4 p-6 sm:p-4 cursor-pointer"
          onClick={() => {
            router.push("/");

            if (isSidebarMobile) {
              toggleSidebar();
            }
          }}
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
