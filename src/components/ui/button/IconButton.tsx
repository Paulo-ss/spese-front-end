import { FC, Fragment, MouseEvent, ReactNode } from "react";
import Loader from "../loader/Loader";

interface IProps {
  type: "submit" | "button";
  color: "primary" | "secondary" | "error" | "info" | "neutral";
  icon: ReactNode;
  variant?: "outlined";
  disabled?: boolean;
  isLoading?: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  fullWidth?: boolean;
}

const IconButton: FC<IProps> = ({
  type,
  color,
  icon,
  disabled,
  isLoading,
  onClick,
  variant,
  fullWidth,
}) => {
  const colorsScheme = {
    primary: {
      bg: "bg-emerald-200",
      darkBg: "dark:bg-emerald-800",
      hoverBg: "hover:bg-emerald-400",
      border: "border-emerald-400",
      focusBg: "focus:bg-emerald-400",
      darkHover: "dark:hover:bg-emerald-950",
    },
    secondary: {
      bg: "bg-violet-200",
      darkBg: "dark:bg-violet-800",
      hoverBg: "hover:bg-violet-400",
      border: "border-violet-400",
      focusBg: "focus:bg-violet-400",
      darkHover: "dark:hover:bg-violet-950",
    },
    error: {
      bg: "bg-red-200",
      darkBg: "dark:bg-red-800",
      hoverBg: "hover:bg-red-400",
      border: "border-red-400",
      focusBg: "focus:bg-red-400",
      darkHover: "dark:hover:bg-red-950",
    },
    info: {
      bg: "bg-sky-200",
      darkBg: "dark:bg-sky-800",
      hoverBg: "hover:bg-sky-400",
      border: "border-sky-400",
      focusBg: "focus:bg-sky-400",
      darkHover: "dark:hover:bg-sky-950",
    },
    neutral: {
      bg: "bg-zinc-100",
      darkBg: "dark:bg-zinc-800",
      hoverBg: "hover:bg-zinc-200",
      border: "border-zinc-400",
      focusBg: "focus:bg-zinc-400",
      darkHover: "dark:hover:bg-zinc-950",
    },
  };

  return (
    <button
      className={`p-2 rounded-md ${
        fullWidth ? "w-full" : "w-fit"
      } flex justify-center items-center outline-none border ${
        variant === "outlined"
          ? `${colorsScheme[color].border} `
          : `${colorsScheme[color].bg} border-transparent`
      } ${colorsScheme[color].hoverBg} ${
        colorsScheme[color].focusBg
      } transition-colors dark:text-zinc-50 ${
        variant ? "dark:bg-none" : colorsScheme[color].darkBg
      } ${colorsScheme[color].darkHover} ${
        disabled &&
        "cursor-not-allowed disabled:bg-zinc-50 disabled:text-zinc-500 disabled:dark:bg-zinc-700 disabled:dark:text-zinc-500 disabled:hover:bg-none"
      }`}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {isLoading ? (
        <Loader width="w-6" height="h-6" />
      ) : (
        <Fragment>{icon}</Fragment>
      )}
    </button>
  );
};

export default IconButton;
