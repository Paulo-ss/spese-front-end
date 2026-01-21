"use client";

import { MouseEvent, useState } from "react";
import HeaderItem from "../headerItem/HeaderItem";
import { IconWorld } from "@tabler/icons-react";
import Dropdown from "@/components/ui/dropdown/Dropdown";
import Image from "next/image";
import { setLanguage } from "@/app/actions/cookies/setLanguage";
import { Locale } from "@/types/locale.type";

const Languages = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const openDropdown = async (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const closeDropdown = () => {
    setAnchorEl(null);
  };

  const changeLanguage = async (lang: Locale) => {
    await setLanguage(lang);
  };

  return (
    <div className="relative">
      <HeaderItem onClick={openDropdown}>
        <IconWorld />
      </HeaderItem>

      <Dropdown
        isOpened={Boolean(anchorEl)}
        anchorEl={anchorEl}
        closeDropdown={closeDropdown}
      >
        <div className="flex flex-col gap-2 w-full min-w-32">
          <div
            className="p-2 flex rounded-md flex-row items-center gap-2 transition-colors duration-300 hover:bg-zinc-100 dark:hover:bg-zinc-950 dark:text-zinc-50 cursor-pointer"
            onClick={() => changeLanguage("pt")}
          >
            <div className="w-6 h-6">
              <Image
                src="/images/flags/brazil.png"
                width={512}
                height={512}
                alt="brazillian flag"
              />
            </div>

            <p>português</p>
          </div>

          <div
            className="p-2 flex rounded-md flex-row items-center gap-2 transition-colors duration-300 hover:bg-zinc-100 dark:hover:bg-zinc-950 dark:text-zinc-50 cursor-pointer"
            onClick={() => changeLanguage("en")}
          >
            <div className="w-6 h-6 rounded-full">
              <Image
                src="/images/flags/united-states.png"
                width={360}
                height={348}
                alt="united states flag"
              />
            </div>

            <p>english</p>
          </div>
        </div>
      </Dropdown>
    </div>
  );
};

export default Languages;
