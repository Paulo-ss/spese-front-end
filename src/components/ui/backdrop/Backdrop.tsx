import { FC, MouseEvent, ReactNode } from "react";

interface IProps {
  isOpened: boolean;
  handleClose: () => void;
  children: ReactNode;
}

const Backdrop: FC<IProps> = ({ isOpened, handleClose, children }) => {
  const onClick = (e: MouseEvent<HTMLElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div
      className={`${!isOpened && "hidden"} ${
        isOpened ? "z-50" : "-z-10"
      } fixed top-0 left-0 bg-transparent w-screen h-screen cursor-default `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Backdrop;
