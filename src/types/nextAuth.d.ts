import { IUser } from "@/interfaces/user-data.interface";

declare module "next-auth" {
  interface Session {
    user: IUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    expiresIn: number;
  }
}
