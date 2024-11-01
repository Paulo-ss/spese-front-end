"use client";

import { SidebarContext } from "@/contexts/SidebarContext";
import { IconMenu } from "@tabler/icons-react";
import { Session } from "next-auth";
import { FC, useContext } from "react";
import HeaderItem from "./headerItem/HeaderItem";
import Notifications from "./notifications/Notifications";
import Profile from "./profile/Profile";

interface IProps {
  session: Session | null;
}

const Header: FC<IProps> = ({ session }) => {
  const { toggleSidebar, isSidebarMobile } = useContext(SidebarContext);

  return (
    <div className="min-h-[80px] dark:bg-zinc-800 flex justify-between items-center px-4 sm:px-6 py-4">
      <ul>
        {isSidebarMobile && (
          <HeaderItem onClick={() => toggleSidebar()}>
            <IconMenu className="w-8 h-8" />
          </HeaderItem>
        )}
      </ul>

      <ul className="relative justify-self-end flex gap-3 items-center">
        <Notifications session={session} />

        <Profile session={session} />
      </ul>
    </div>
  );
};

export default Header;
