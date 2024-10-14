export interface IResetPassword {
  email: string;
}

export interface IResetToken {
  resetToken: string;
}

export interface INewPassword {
  password: string;
  passwordConfirmation: string;
}
