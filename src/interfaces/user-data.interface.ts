export interface IUser {
  id: number;
  name: string;
  username: string;
  email: string;
  confirmed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IAuthResult {
  user: IUser;
  accessToken: string;
  refreshToken: string;
}
