import { IUser } from "@/interfaces/user-data.interface";
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: IUser;
    accessToken: string;
    refreshToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    expiresIn: number;
  }
}
