"use client";

import { IAPIError } from "@/interfaces/api-error.interface";
import { IconClipboardOff, IconContract, IconPlus } from "@tabler/icons-react";
import { FC, Fragment, useState } from "react";
import Card from "../ui/card/Card";
import IconButton from "../ui/button/IconButton";
import { useRouter } from "next-nprogress-bar";
import ErrorDisplay from "../ui/errorDisplay/ErrorDisplay";
import { useTranslations } from "next-intl";
import CardLoading from "../ui/loading/CardLoading";
import ListItemLoading from "../ui/loading/ListItemLoading";
import SubscriptionItem from "./SubscriptionItem";
import { ISubscription } from "@/interfaces/subscription.interface";
import SubscriptionsFilters from "./SubscriptionsFilters";
import { fetchResource } from "@/services/fetchService";

interface IProps {
  initialSubscriptions?: ISubscription[];
  error?: IAPIError;
  locale: string;
}

const Subscriptions: FC<IProps> = ({ initialSubscriptions, error, locale }) => {
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
  const [errorMessage, setErrorMessage] = useState(
    error ? error.errorMessage : undefined
  );
  const [isLoading, setIsLoading] = useState(false);

  const updateLoading = (isLoading: boolean) => {
    setIsLoading(isLoading);
  };

  const router = useRouter();
  const t = useTranslations();

  const fetchSubscriptions = async () => {
    try {
      updateLoading(true);

      const { data: subscriptions, error } = await fetchResource<
        ISubscription[]
      >({
        url: "/credit-card/subscription/all/user",
      });

      if (error) {
        throw new Error(
          Array.isArray(error.errorMessage)
            ? error.errorMessage[0]
            : error.errorMessage
        );
      }

      setSubscriptions(subscriptions);
    } catch (error) {
      if (error && error instanceof Error) {
        setErrorMessage(error.message ?? t("utils.somethingWentWrong"));
      }
    } finally {
      updateLoading(false);
    }
  };

  if (isLoading) {
    return (
      <CardLoading>
        <ListItemLoading items={6} />
      </CardLoading>
    );
  }

  return (
    <Card
      title="subscriptions.yourSubscriptions"
      icon={<IconContract />}
      action={
        <div className="flex items-center gap-2">
          <SubscriptionsFilters
            isLoading={isLoading}
            updateLoading={updateLoading}
            updateErrorMessage={(errorMessage) => setErrorMessage(errorMessage)}
            updateSubscriptions={(subscriptions) =>
              setSubscriptions(subscriptions)
            }
          />

          <IconButton
            type="button"
            color="primary"
            icon={<IconPlus />}
            onClick={() => router.push("/subscriptions/create")}
          />
        </div>
      }
    >
      {errorMessage ? (
        <ErrorDisplay errorMessage={errorMessage} />
      ) : (
        <Fragment>
          {subscriptions && subscriptions.length === 0 ? (
            <div className="flex flex-col justify-center items-center">
              <IconClipboardOff width={40} height={40} />

              <p className="text-sm text-center mt-2 text-zinc-600 dark:text-zinc-50">
                {t("allClear")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1">
              {subscriptions?.map((subscription) => (
                <SubscriptionItem
                  key={subscription.id}
                  subscription={subscription}
                  locale={locale}
                  fetchSubscriptions={fetchSubscriptions}
                />
              ))}
            </div>
          )}
        </Fragment>
      )}
    </Card>
  );
};

export default Subscriptions;
