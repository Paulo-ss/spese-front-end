import { JWT, encode, getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { IAuthResult, IUser } from "./interfaces/user-data.interface";
import { fetchResource } from "./services/fetchService";

const SECRET = process.env.NEXTAUTH_SECRET!;
const SESSION_SECURE = process.env.AUTH_URL?.startsWith("https://");
const SESSION_COOKIE_NAME = SESSION_SECURE
  ? "__Secure-authjs.session-token"
  : "authjs.session-token";

const refreshAccessToken = async (token: JWT) => {
  try {
    const loggedUser = token as unknown as IUser;

    const { data, error } = await fetchResource<IAuthResult>({
      url: "/authorization/refresh-token",
      config: {
        options: {
          method: "POST",
          body: JSON.stringify({ refreshToken: loggedUser.refreshToken }),
        },
      },
    });

    if (error) {
      const errorMessage = Array.isArray(error.errorMessage)
        ? error.errorMessage[0]
        : error.errorMessage;

      throw new Error(errorMessage);
    }

    return {
      ...token,
      accessToken: data!.accessToken,
      expiresIn: 600 * 1000 + Date.now(),
      refreshToken: data!.refreshToken,
    };
  } catch (error) {
    if (error && error instanceof Error) {
      console.error("Error refreshing access token", error);

      return { ...token, error: error.message };
    }

    return { ...token, error: "Error refreshing access token" };
  }
};

const signOut = async (request: NextRequest, errorMessage: string) => {
  const response = NextResponse.redirect(
    new URL(`/auth/sign-in?error=${errorMessage}`, request.url)
  );

  request.cookies.getAll().forEach((cookie) => {
    if (cookie.name.includes("authjs")) {
      response.cookies.delete(cookie.name);
    }
  });

  return response;
};

const shouldUpdateToken = (token: JWT) => {
  return Date.now() > token.expiresIn;
};

export async function middleware(request: NextRequest) {
  const isOnProtectedRoute = !request.nextUrl.pathname.startsWith("/auth");
  const token = await getToken({
    req: request,
    salt: SESSION_COOKIE_NAME,
    secret: SECRET,
    secureCookie: SESSION_SECURE,
  });

  if (isOnProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  if (!isOnProtectedRoute && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (token && isOnProtectedRoute) {
    if (shouldUpdateToken(token)) {
      try {
        const newToken = await refreshAccessToken(token);

        if (Object.keys(newToken).includes("error")) {
          return await signOut(
            request,
            "Erro ao atualizar sua sessão. Faça o login novamente."
          );
        }

        const newSessionToken = await encode({
          salt: SESSION_COOKIE_NAME,
          secret: SECRET,
          token: {
            ...token,
            ...newToken,
          },
          maxAge: 60 * 60 * 24,
        });

        request.cookies.set(SESSION_COOKIE_NAME, newSessionToken);

        const response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });

        response.cookies.set(SESSION_COOKIE_NAME, newSessionToken, {
          httpOnly: true,
          sameSite: "lax",
          maxAge: 60 * 60 * 24,
          secure: SESSION_SECURE,
          expires: 60 * 60 * 24,
        });

        return response;
      } catch (error) {
        console.log("ERROR TOKEN: -------------", error);

        return await signOut(
          request,
          "Erro ao atualizar sua sessão. Faça o login novamente."
        );
      }
    }

    const loggedUser = token as unknown as IUser;
    if (
      request.nextUrl.pathname === "/account-setup" &&
      loggedUser.accountSetup
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (
      request.nextUrl.pathname !== "/account-setup" &&
      !loggedUser.accountSetup
    ) {
      return NextResponse.redirect(new URL("/account-setup", request.url));
    }
  }
}

export const config = {
  matcher: [
    "/",
    "/api/refresh-token",
    "/auth/:path*",
    "/expenses",
    "/account-setup",
  ],
};
