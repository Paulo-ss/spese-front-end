import React, { Fragment, MouseEvent, useCallback, useState } from "react";
import HeaderItem from "../headerItem/HeaderItem";
import Dropdown from "@/components/ui/dropdown/Dropdown";
import { IconBell, IconCheckbox } from "@tabler/icons-react";
import { INotification } from "@/interfaces/notifications.interface";
import { fetchResource } from "@/services/fetchService";
import Loader from "@/components/ui/loader/Loader";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/pt-br";
import { theme } from "@/lib/theme/theme";

dayjs.extend(relativeTime);
dayjs.locale("pt-br");

const Notifications = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [notificationsFetched, setNotificationsFetched] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
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

      setIsLoading(false);
      return;
    }

    setNotifications(data!);
    setIsLoading(false);
    setNotificationsFetched(true);
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

  return (
    <div className="relative">
      <HeaderItem onClick={openDropdown}>
        <IconBell />
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
              <p className="text-center">{errorMessage}</p>
            ) : (
              <Fragment>
                {notifications.length === 0 ? (
                  <div></div>
                ) : (
                  <Fragment>
                    {notifications.map((notification) => {
                      return (
                        <div
                          className={`flex items-center p-2 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors`}
                        >
                          <Link
                            key={notification.id}
                            href={`/${notification.type}/${notification.referenceId}`}
                            className={`w-full flex items-center gap-3`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
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
                            <div className="flex justify-center items-center rounded-full cursor-pointer p-2 hover:bg-zinc-100 dark:hover:bg-zinc-950 transition-colors">
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
