import React, {
  FC,
  Fragment,
  MouseEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import HeaderItem from "../headerItem/HeaderItem";
import Dropdown from "@/components/ui/dropdown/Dropdown";
import {
  IconBell,
  IconCheckbox,
  IconClipboardOff,
  IconXboxX,
} from "@tabler/icons-react";
import { INotification } from "@/interfaces/notifications.interface";
import { fetchResource } from "@/services/fetchService";
import Loader from "@/components/ui/loader/Loader";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/pt-br";
import { theme } from "@/lib/theme/theme";
import { Session } from "next-auth";
import { ISSENotification } from "@/interfaces/sse-notification.interface";
import markNotificationAsRead from "@/app/actions/notifications/markNotificationAsRead";
import { toast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";

dayjs.extend(relativeTime);
dayjs.locale("pt-br");

interface IProps {
  session: Session | null;
}

const Notifications: FC<IProps> = ({ session }) => {
  const t = useTranslations();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [notificationsFetched, setNotificationsFetched] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true);

      const { data, error } = await fetchResource<INotification[]>({
        url: "/notifications/user",
        config: { options: { method: "GET" } },
      });

      if (error) {
        setErrorMessage(
          Array.isArray(error.errorMessage)
            ? error.errorMessage[0]
            : error.errorMessage
        );

        return;
      }

      setNotifications(data!);
      setNotificationsFetched(true);
    } catch (error) {
      console.log("FETCH NOTIFICATIONS: ", { error });
      setErrorMessage(
        "Ocorreu um erro inesperado ao buscar as notificações. Tente novamente mais tarde."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const openDropdown = async (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);

    if (!notificationsFetched) {
      await fetchNotifications();
    }
  };

  const closeDropdown = () => {
    setAnchorEl(null);
  };

  const markAsRead = async (id: number) => {
    setUnreadNotifications((state) => state - 1);
    const notificationReadIndex = notifications.findIndex((n) => n.id === id)!;

    const updatedNotifications = Array.from(notifications);
    updatedNotifications[notificationReadIndex].isRead = true;
    setNotifications(updatedNotifications);

    const { error } = await markNotificationAsRead(id);

    if (error) {
      toast({
        title: "erro",
        description: "não foi possível completar a ação.",
        action: <IconXboxX className="w-6 h-6" color={theme.colors.red[500]} />,
      });
      updatedNotifications[notificationReadIndex].isRead = false;
      setNotifications(updatedNotifications);
      setUnreadNotifications((state) => state + 1);

      return;
    }
  };

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/notifications/count`, {
      headers: { Authorization: `Bearer ${session?.user.accessToken}` },
    })
      .then((response) => {
        const stream = response.body;
        const reader = stream?.getReader();

        const readChunk = () => {
          reader
            ?.read()
            .then(({ value, done }) => {
              if (done) {
                console.log("Stream finished");
                return;
              }

              const chunkString = new TextDecoder().decode(value);

              const data = chunkString.match(/{(.*?)\}/g);

              if (data && data?.length > 0) {
                if (data[0].includes("notification")) {
                  data[0] += "}";
                }

                const { unreadCount, notification } = JSON.parse(
                  data[0]
                ) as ISSENotification;

                setUnreadNotifications((state) => {
                  if (state === 0) {
                    return unreadCount;
                  }

                  return state + unreadCount;
                });

                if (notification) {
                  setNotifications((state) => [notification, ...state]);
                }
              }

              readChunk();
            })
            .catch((error) => {
              console.log({ error });
            });
        };

        readChunk();
      })
      .catch((error) => {
        console.log({ error });
      });
  }, [session]);

  return (
    <div className="relative">
      <HeaderItem onClick={openDropdown}>
        <div className="relative">
          <IconBell />

          {unreadNotifications > 0 && (
            <span className="flex justify-center items-center absolute -top-1 -right-1 text-xs w-4 h-4 rounded-full bg-primary-mint dark:bg-primary-dark dark:text-zinc-50">
              {" "}
              {unreadNotifications > 9 ? "9+" : unreadNotifications}
            </span>
          )}
        </div>
      </HeaderItem>

      <Dropdown
        isOpened={Boolean(anchorEl)}
        anchorEl={anchorEl}
        closeDropdown={closeDropdown}
      >
        {isLoading ? (
          <div>
            <Loader width="w-6" height="h-6" />
          </div>
        ) : (
          <Fragment>
            {errorMessage ? (
              <div className="w-44 flex flex-col justify-center items-center">
                <IconXboxX width={40} height={40} />

                <p className="text-sm text-center mt-2 text-zinc-600 dark:text-zinc-50">
                  {errorMessage}
                </p>
              </div>
            ) : (
              <Fragment>
                {notifications.length === 0 ? (
                  <div className="w-44 flex flex-col justify-center items-center">
                    <IconClipboardOff width={40} height={40} />

                    <p className="text-sm text-center mt-2 text-zinc-600 dark:text-zinc-50">
                      {t("allClear")}
                    </p>
                  </div>
                ) : (
                  <Fragment>
                    {notifications.map((notification) => {
                      return (
                        <div
                          className={`flex items-center p-2 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors`}
                          key={notification.id}
                        >
                          <Link
                            href={`/${notification.type}/${notification.referenceId}`}
                            className={`w-full flex items-center gap-3`}
                          >
                            <span
                              className={`w-3 h-1.5 rounded-full ${
                                notification.isRead
                                  ? "bg-zinc-400 dark:bg-zinc-50"
                                  : "bg-sky-500"
                              }`}
                            ></span>

                            <div className="flex flex-col">
                              <h5 className="text-lg font-bold">
                                {notification.title}
                              </h5>

                              <p className="text-zinc-800 dark:text-zinc-50">
                                {notification.content}
                              </p>

                              <p className="text-zinc-400">
                                {dayjs(notification.createdAt).fromNow()}
                              </p>
                            </div>
                          </Link>

                          {!notification.isRead && (
                            <div
                              className="flex justify-center items-center rounded-full cursor-pointer p-2 hover:bg-zinc-100 dark:hover:bg-zinc-950 transition-colors"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <IconCheckbox
                                title="marcar como lida"
                                color={theme.colors.sky[500]}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </Fragment>
                )}
              </Fragment>
            )}
          </Fragment>
        )}
      </Dropdown>
    </div>
  );
};

export default Notifications;
