export interface IUser {
  id: string;
  name: string;
  username: string;
  email: string;
  confirmed: boolean;
  accountSetup: boolean;
  expiresIn: number;
  accessToken: string;
  refreshToken: string;
  timezone: string;
}

export interface IUpdateUser {
  id?: string;
  name?: string;
  username?: string;
  email?: string;
  confirmed?: boolean;
  accountSetup?: boolean;
  expiresIn?: number;
  accessToken?: string;
  refreshToken?: string;
}

export interface IAuthResult {
  user: IUser;
  accessToken: string;
  refreshToken: string;
}
