import { FC, Fragment, MouseEvent, ReactNode } from "react";
import Loader from "../loader/Loader";

interface IProps {
  type: "submit" | "button";
  text: string;
  color: "primary" | "secondary" | "error" | "info";
  leading?: ReactNode;
  trailing?: ReactNode;
  variant?: "outlined";
  disabled?: boolean;
  isLoading?: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

const Button: FC<IProps> = ({
  type,
  onClick,
  text,
  leading,
  trailing,
  color,
  variant,
  disabled,
  isLoading,
}) => {
  const colorsScheme = {
    primary: {
      hoverBg: "hover:bg-emerald-400",
      border: "border-emerald-400",
      focusBg: "focus:bg-emerald-400",
      darkHover: "dark:hover:bg-emerald-950",
    },
    secondary: {
      hoverBg: "hover:bg-violet-400",
      border: "border-violet-400",
      focusBg: "focus:bg-violet-400",
      darkHover: "dark:hover:bg-violet-950",
    },
    error: {
      hoverBg: "hover:bg-red-400",
      border: "border-red-400",
      focusBg: "focusBg:bg-red-400",
      darkHover: "dark:hover:bg-red-950",
    },
    info: {
      hoverBg: "hover:bg-sky-400",
      border: "border-sky-400",
      focusBg: "focusBg:bg-sky-400",
      darkHover: "dark:hover:bg-sky-950",
    },
  };

  return (
    <button
      className={`py-3 px-4 w-full sm:max-w-max rounded-md flex justify-between items-center outline-none ${
        variant === "outlined"
          ? `${colorsScheme[color].border} border`
          : "bg-gray-100"
      } ${colorsScheme[color].hoverBg} ${
        colorsScheme[color].focusBg
      } transition-colors dark:text-zinc-50 ${
        variant ? "dark:bg-none" : "dark:bg-zinc-950"
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
        <Fragment>
          {leading && <span className="mr-2">{leading}</span>}

          <Fragment>{text}</Fragment>

          {trailing && <span className="ml-2">{trailing}</span>}
        </Fragment>
      )}
    </button>
  );
};

export default Button;
