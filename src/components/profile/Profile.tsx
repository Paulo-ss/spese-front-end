"use client";

import { IAPIError } from "@/interfaces/api-error.interface";
import { IUser } from "@/interfaces/user-data.interface";
import { FC, useState } from "react";
import ErrorDisplay from "../ui/errorDisplay/ErrorDisplay";
import { useTranslations } from "next-intl";
import Card from "../ui/card/Card";
import { IconLogout, IconUser } from "@tabler/icons-react";
import signOut from "@/app/actions/auth/signOut";
import IconButton from "../ui/button/IconButton";

interface IProps {
  user?: IUser;
  error?: IAPIError;
}

const Profile: FC<IProps> = ({ user, error }) => {
  const [isLoading, setIsLoading] = useState(false);

  const t = useTranslations();

  if (error) {
    return (
      <ErrorDisplay
        errorMessage={error?.errorMessage ?? t("utils.somethingWentWrong")}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-row items-center gap-3">
        <span className="w-24 h-24 flex justify-center items-center bg-primary dark:bg-primary-dark text-zinc-50 rounded-full font-bold text-lg">
          {user?.name.charAt(0).toUpperCase()}
        </span>

        <p className="font-bold text-xl">
          {t("utils.hi")}, {user?.name}
        </p>
      </div>

      <Card
        title="profile.yourInfo"
        icon={<IconUser />}
        action={
          <IconButton
            type="button"
            color="error"
            onClick={async () => {
              setIsLoading(true);

              await signOut();

              setIsLoading(false);
            }}
            icon={<IconLogout />}
            isLoading={isLoading}
            disabled={isLoading}
          />
        }
      >
        <div className="flex flex-col gap-4">
          <p className="">
            {t("utils.name")}: {user?.username}
          </p>

          <p className="">e-mail: {user?.email}</p>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
