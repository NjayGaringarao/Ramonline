// GlobalState.ts
import { useState, useEffect } from "react";
import { Models } from "react-native-appwrite";
import { useNetworkState } from "expo-network";
import {
  getFCMToken,
  getUserNotificationList,
  requestNotificationPermissions,
  setupPushTarget,
} from "@/services/notificationServices";
import {
  getCurrentUser,
  getUserActivity,
  getUserInfo,
} from "@/services/userServices";
import { getUserLineList } from "@/services/lineServices";
import { getUserPostList } from "@/services/postServices";
import { UserType, PostType, LineType, NotificationType } from "@/types/models";
import handleNotification from "./NotificationHandler";

export const useGlobalState = () => {
  const { isInternetReachable } = useNetworkState();
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null
  );
  const [userInfo, setUserInfo] = useState<UserType.Info>({
    id: "",
    username: "",
    name: ["", "", ""],
    avatar_url: "",
    role: ["", "", "", ""],
    created_at: new Date(0),
  });
  const [userActivity, setUserActivity] = useState<UserType.Activity>({
    id: "",
    viewed_notification_id: [],
  });
  const [userPost, setUserPost] = useState<PostType.Info[]>([]);
  const [userLine, setUserLine] = useState<LineType.Info[]>([]);
  const [userNotification, setUserNotification] = useState<
    NotificationType.Info[]
  >([]);
  const [isRefreshFeeds, setIsRefreshFeeds] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fcmToken, setFcmToken] = useState<string>();

  useEffect(() => {
    const initialize = async () => {
      await requestNotificationPermissions();

      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          const fcm = await getFCMToken(setFcmToken);
          if (fcm) await setupPushTarget(currentUser, fcm);

          handleNotification(async () => {
            setUserNotification(await getUserNotificationList(currentUser.$id));
            setUserActivity(await getUserActivity(currentUser.$id));
          });

          const [info, activity, lines, posts, notification] =
            await Promise.all([
              getUserInfo(currentUser.$id),
              getUserActivity(currentUser.$id),
              getUserLineList(currentUser.$id),
              getUserPostList(currentUser.$id),
              getUserNotificationList(currentUser.$id),
            ]);

          setUserInfo(info);
          setUserActivity(activity);
          setUserLine(lines);
          setUserPost(posts);
          setUserNotification(notification);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  return {
    user,
    setUser,
    userInfo,
    setUserInfo,
    userActivity,
    setUserActivity,
    userPost,
    setUserPost,
    userLine,
    setUserLine,
    userNotification,
    setUserNotification,
    isRefreshFeeds,
    setIsRefreshFeeds,
    isLoading,
    isInternetReachable,
    fcmToken,
  };
};
