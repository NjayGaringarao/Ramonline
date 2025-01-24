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
import { useNetInfo } from "@react-native-community/netinfo";
import { getCurrentUser, getUserInfo } from "@/services/userServices";
import { getUserLineList } from "@/services/lineServices";
import { getUserPostList } from "@/services/postServices";
import { UserType, PostType, LineType, NotificationType } from "@/types/models";
import handleNotification from "./NotificationHandler";
import { GlobalContextInterface, RefreshUserRecordType } from "./context";
import { defaultValue, emptyUserInfo } from "./values";
import Toast from "react-native-root-toast";
import { router } from "expo-router";

export const GlobalContext =
  createContext<GlobalContextInterface>(defaultValue);

export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const { isInternetReachable } = useNetInfo();
  const [isInternetConnection, setIsInternetConnection] =
    useState<boolean>(false);
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
    try {
      setIsLoading(true);

      await requestNotificationPermissions();

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

        if (currentUser.emailVerification) {
          router.replace("/home");
        } else {
          router.replace("/(auth)/verification");
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initializeGlobalState();
  }, []);

  useEffect(() => {
    const promptInternetStatus = async () => {
      if (isInternetReachable === null) return;
      if (isInternetReachable) {
        setIsInternetConnection(true);
      } else {
        Toast.show("No internet connection", {
          duration: Toast.durations.LONG,
        });
        setIsInternetConnection(false);
      }
    };

    promptInternetStatus();
  }, [isInternetReachable]);

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
        isInternetConnection,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
