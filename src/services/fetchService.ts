import { IFetchResponse } from "@/interfaces/fetch-response.interface";
import { Session } from "next-auth";
import { auth } from "../../auth";
import { getSession } from "next-auth/react";
import { IAPIError } from "@/interfaces/api-error.interface";

interface IFetchOptions {
  url: string;
  config: {
    options?: RequestInit;
    isRefreshingToken?: boolean;
    ignoreBaseUrl?: boolean;
  };
}

export const fetchResource = async <T>({
  url,
  config,
}: IFetchOptions): Promise<IFetchResponse<T>> => {
  const isOnServer = typeof window === "undefined";
  let session: Session | null = null;

  if (isOnServer) {
    session = await auth();
  } else {
    session = await getSession();
  }

  const requestOptions: RequestInit = {
    ...config?.options,
    headers: {
      Authorization: `Bearer ${session?.user.accessToken}`,
      "Content-Type": "application/json",
      ...config?.options?.headers,
    },
  };

  let response = await fetch(
    `${config.ignoreBaseUrl ? "" : process.env.NEXT_PUBLIC_API_BASE_URL}${url}`,
    requestOptions
  );

  if (response.status === 403 && !config?.isRefreshingToken) {
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/refresh-token`, {
      method: "POST",
    });

    return await fetchResource<T>({
      url,
      config: { ...config, isRefreshingToken: true },
    });
  }

  if (!response.ok) {
    const error = (await response.json()) as IAPIError;

    return { error, response };
  }

  const data = await response.json();

  return { data: data as T, response };
};
