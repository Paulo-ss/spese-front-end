"use client";

import { theme } from "@/lib/theme/theme";
import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

export interface ISidebarContext {
  toggleSidebar: () => void;
  isSidebarOpened: boolean;
  isSidebarMobile: boolean;
}

export const SidebarContext = createContext({} as ISidebarContext);

const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [isSidebarOpened, setIsSidebarOpened] = useState(false);
  const [isSidebarMobile, setIsSidebarMobile] = useState(false);

  const parsePixelsToNumber = (pixelValue: string) =>
    Number(pixelValue.replace("px", ""));

  const handleWindowResize = useCallback(() => {
    if (
      window.innerWidth < parsePixelsToNumber(theme.screens.lg) &&
      !isSidebarMobile
    ) {
      setIsSidebarMobile(true);
    }

    if (
      window.innerWidth >= parsePixelsToNumber(theme.screens.lg) &&
      isSidebarMobile
    ) {
      if (isSidebarOpened) {
        setIsSidebarOpened(false);
      }

      setIsSidebarMobile(false);
    }
  }, [isSidebarMobile, isSidebarOpened]);

  const toggleSidebar = () => {
    setIsSidebarOpened((state) => !state);
  };

  useEffect(() => {
    handleWindowResize();
  }, [handleWindowResize]);

  useEffect(() => {
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [handleWindowResize]);

  return (
    <SidebarContext.Provider
      value={{ isSidebarOpened, isSidebarMobile, toggleSidebar }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export default SidebarProvider;
