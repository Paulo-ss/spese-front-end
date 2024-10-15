import { Session } from "next-auth";
import { FC, MouseEvent, useState } from "react";
import HeaderItem from "../headerItem/HeaderItem";
import { IconLogout, IconUser } from "@tabler/icons-react";
import Dropdown from "@/components/ui/dropdown/Dropdown";
import Divider from "@/components/ui/divider/Divider";
import Button from "@/components/ui/button/Button";
import { useRouter } from "next/navigation";
import signOut from "@/app/actions/auth/signOut";

interface IProps {
  session: Session | null;
}

const Profile: FC<IProps> = ({ session }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const openDropdown = async (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const closeDropdown = () => {
    setAnchorEl(null);
  };

  return (
    <div className="relative">
      <HeaderItem onClick={openDropdown}>
        <div className="w-8 h-8 bg-primary-dark text-zinc-50 rounded-full flex justify-center items-center font-bold text-lg">
          {session?.user.name.charAt(0).toUpperCase()}
        </div>
      </HeaderItem>

      <Dropdown
        isOpened={Boolean(anchorEl)}
        anchorEl={anchorEl}
        closeDropdown={closeDropdown}
      >
        <div className="flex flex-col items-center">
          <h3>Olá, {session?.user.name}</h3>

          <Divider />

          <div className="flex flex-col gap-2 w-full">
            <Button
              type="button"
              variant="outlined"
              color="primary"
              onClick={() => router.push("/profile/me")}
              text="meu perfil"
              trailing={<IconUser />}
              small
              fullWidth
            />

            <Button
              type="button"
              color="error"
              onClick={async () => {
                setIsLoading(true);

                await signOut();

                setIsLoading(false);
              }}
              text="sair"
              trailing={<IconLogout />}
              isLoading={isLoading}
              disabled={isLoading}
              small
              fullWidth
            />
          </div>
        </div>
      </Dropdown>
    </div>
  );
};

export default Profile;
