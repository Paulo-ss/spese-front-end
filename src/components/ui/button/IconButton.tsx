import { FC, Fragment, MouseEvent, ReactNode } from "react";
import Loader from "../loader/Loader";

interface IProps {
  type: "submit" | "button";
  color: "primary" | "secondary" | "error" | "info" | "neutral";
  icon: ReactNode;
  variant?: "outlined" | "contained";
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
  variant = "contained",
  fullWidth,
}) => {
  const colorsScheme = {
    primary: {
      contained:
        "bg-emerald-200 border-transparent hover:bg-emerald-400 focus:bg-emerald-400 dark:bg-emerald-800 dark:hover:bg-emerald-950",
      outlined:
        "bg-transparent border-emerald-200 hover:bg-emerald-400 focus:bg-emerald-400 dark:border-emerald-950 dark:hover:bg-emerald-950",
    },
    secondary: {
      contained:
        "bg-violet-300 border-transparent hover:bg-violet-400 focus:bg-violet-400 dark:bg-violet-800 dark:hover:bg-violet-950",
      outlined:
        "bg-transparent border-violet-300 hover:bg-violet-400 focus:bg-violet-400 dark:border-violet-950 dark:hover:bg-violet-950",
    },
    error: {
      contained:
        "bg-red-200 border-transparent hover:bg-red-400 focus:bg-red-400 dark:bg-red-800 dark:hover:bg-red-950",
      outlined:
        "bg-transparent border-red-200 hover:bg-red-400 focus:bg-red-400 dark:border-red-950 dark:hover:bg-red-950",
    },
    info: {
      contained:
        "bg-sky-200 border-transparent hover:bg-sky-400 focus:bg-sky-400 dark:bg-sky-800 dark:hover:bg-sky-950",
      outlined:
        "bg-transparent border-sky-200 hover:bg-sky-400 focus:bg-sky-400 dark:border-sky-950 dark:hover:bg-sky-950",
    },
    neutral: {
      contained:
        "bg-zinc-100 border-transparent hover:bg-zinc-200 focus:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-900 dark:focus:bg-zinc-900",
      outlined:
        "bg-transparent border-zinc-100 hover:bg-zinc-300 focus:bg-zinc-300 dark:border-zinc-950 dark:hover:bg-zinc-950",
    },
  };

  return (
    <button
      className={`p-1 md:p-2 rounded-md flex justify-center items-center outline-none border transition-colors dark:text-zinc-50 ${
        colorsScheme[color][variant]
      } ${fullWidth ? "w-full" : "w-fit"} ${
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
