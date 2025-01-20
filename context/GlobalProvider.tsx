import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  getFCMToken,
  getUserNotificationList,
  requestNotificationPermissions,
  setupPushTarget,
} from "@/services/notificationServices";
import { Models } from "react-native-appwrite";
import { useNetworkState } from "expo-network";
import { getCurrentUser, getUserInfo } from "@/services/userServices";
import { getUserLineList } from "@/services/lineServices";
import { getUserPostList } from "@/services/postServices";
import { UserType, PostType, LineType, NotificationType } from "@/types/models";
import handleNotification from "./NotificationHandler";
import { GlobalContextInterface, RefreshUserRecordType } from "./context";
import { defaultValue, emptyUserInfo } from "./values";

export const GlobalContext =
  createContext<GlobalContextInterface>(defaultValue);

export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const { isInternetReachable } = useNetworkState();
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null
  );
  const [userInfo, setUserInfo] = useState<UserType.Info>(emptyUserInfo);
  const [userPost, setUserPost] = useState<PostType.Info[]>([]);
  const [userLine, setUserLine] = useState<LineType.Info[]>([]);
  const [userNotification, setUserNotification] = useState<
    NotificationType.Info[]
  >([]);
  const [isRefreshLineFeed, setIsRefreshLineFeed] = useState(false);
  const [isRefreshPostFeed, setIsRefreshPostFeed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fcmToken, setFcmToken] = useState<string>();

  const initializeGlobalState = async () => {
    await requestNotificationPermissions();

    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        const fcm = await getFCMToken(setFcmToken);
        if (fcm) await setupPushTarget(currentUser, fcm);
        handleNotification(async () => {
          setUserNotification(await getUserNotificationList(currentUser.$id));
        });
        const [info, lines, posts, notifications] = await Promise.all([
          getUserInfo(currentUser.$id),
          getUserLineList(currentUser.$id),
          getUserPostList(currentUser.$id),
          getUserNotificationList(currentUser.$id),
        ]);

        setUserInfo(info);
        setUserLine(lines);
        setUserPost(posts);
        setUserNotification(notifications);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Initialization error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initializeGlobalState();
  }, []);

  const refreshUserRecord = async ({
    info,
    line,
    post,
    notification,
  }: RefreshUserRecordType) => {
    if (!user?.$id) return;

    const updates = [];

    if (info) updates.push(getUserInfo(user.$id).then(setUserInfo));
    if (line) updates.push(getUserLineList(user.$id).then(setUserLine));
    if (post) updates.push(getUserPostList(user.$id).then(setUserPost));
    if (notification) {
      updates.push(getUserNotificationList(user.$id).then(setUserNotification));
    }

    await Promise.all(updates);
  };

  const resetGlobalState = () => {
    setUser(null);
    setUserInfo(emptyUserInfo);
    setUserPost([]);
    setUserLine([]);
    setUserNotification([]);
    setIsRefreshLineFeed(false);
    setIsRefreshPostFeed(false);
    setIsLoading(false);
    setFcmToken(undefined);
  };

  return (
    <GlobalContext.Provider
      value={{
        setUser,
        setUserInfo,
        setUserPost,
        setUserLine,
        setUserNotification,
        refreshUserRecord,
        setIsRefreshLineFeed,
        setIsRefreshPostFeed,
        resetGlobalState,
        initializeGlobalState,
        user,
        userInfo,
        userPost,
        userLine,
        userNotification,
        fcmToken,
        isRefreshLineFeed,
        isRefreshPostFeed,
        isLoading,
        isInternetReachable,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
