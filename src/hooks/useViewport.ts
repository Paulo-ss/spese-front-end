"use client";

import { theme } from "@/lib/theme/theme";
import { useState, useEffect } from "react";

const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;

  return {
    width,
    height,
  };
};

const useViewport = () => {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );
  const [isMobile, setIsMobile] = useState(
    getWindowDimensions().width <=
      Number(theme.screens.md.replaceAll(/\D/g, ""))
  );

  useEffect(() => {
    function handleResize() {
      const windowDimensions = getWindowDimensions();

      setWindowDimensions(windowDimensions);
      setIsMobile(
        windowDimensions.width <= Number(theme.screens.md.replaceAll(/\D/g, ""))
      );
    }

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { windowDimensions, isMobile };
};

export default useViewport;
