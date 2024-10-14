import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { fetchResource } from "@/services/fetchService";
import { IAuthResult, IUser } from "@/interfaces/user-data.interface";

export const {
  auth,
  handlers: { GET, POST },
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        login: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const emailOrUsernameOrCode = credentials.login as string;
        const isCode =
          !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(emailOrUsernameOrCode) &&
          !emailOrUsernameOrCode.includes(".");
        let idToken: string | null = null;

        if (isCode) {
          const { data: googleData, error } = await fetchResource<{
            id_token: string;
          }>({
            url: "https://oauth2.googleapis.com/token",
            config: {
              ignoreBaseUrl: true,
              options: {
                method: "POST",
                body: JSON.stringify({
                  client_id: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID,
                  client_secret:
                    process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_SECRET,
                  redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URL,
                  grant_type: "authorization_code",
                  code: emailOrUsernameOrCode,
                }),
              },
            },
          });

          if (error) {
            throw new Error(
              JSON.stringify({
                statusCode: 400,
                errorMessage:
                  "Erro ao logar com o Google. Tente novamente mais tarde.",
              })
            );
          }

          idToken = googleData?.id_token!;
        }

        const isExternalOAuth = !!idToken;

        let body = {};
        if (isExternalOAuth) {
          body = {
            idToken,
            provider: "google",
          };
        } else {
          body = {
            emailOrUsername: credentials.login,
            password: credentials.password,
          };
        }

        const { data, error } = await fetchResource<IAuthResult>({
          url: isExternalOAuth
            ? "/external-authorization/oauth2/sign-in"
            : "/authorization/sign-in",
          config: {
            options: {
              method: "POST",
              body: JSON.stringify(body),
            },
          },
        });

        if (error) {
          throw new Error(JSON.stringify(error));
        }

        const user: IUser = {
          id: data!.user.id,
          confirmed: data!.user.confirmed,
          email: data!.user.email,
          name: data!.user.name,
          username: data!.user.username,
          accessToken: data!.accessToken,
          refreshToken: data!.refreshToken,
          expiresIn: 600 * 1000 + Date.now(),
        };

        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
});
