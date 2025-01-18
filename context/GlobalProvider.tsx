import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  Dispatch,
  ReactNode,
} from "react";
import { Models } from "react-native-appwrite";
import { useNetworkState } from "expo-network";
import {
  getFCMToken,
  getUserNotificationList,
  requestNotificationPermissions,
  setupPushTarget,
} from "@/services/notificationServices";
import { getCurrentUser, getUserInfo } from "@/services/userServices";
import { getUserLineList } from "@/services/lineServices";
import { getUserPostList } from "@/services/postServices";
import { UserType, PostType, LineType, NotificationType } from "@/types/models";
import handleNotification from "./NotificationHandler";

interface RefreshUserRecordType {
  info?: boolean;
  line?: boolean;
  post?: boolean;
  notification?: boolean;
}

interface GlobalContextInterface {
  setUser: Dispatch<
    React.SetStateAction<Models.User<Models.Preferences> | null>
  >;
  setUserInfo: Dispatch<React.SetStateAction<UserType.Info>>;
  setUserPost: Dispatch<React.SetStateAction<PostType.Info[]>>;
  setUserLine: Dispatch<React.SetStateAction<LineType.Info[]>>;
  setUserNotification: Dispatch<React.SetStateAction<NotificationType.Info[]>>;
  refreshUserRecord: (update: RefreshUserRecordType) => void;
  setIsRefreshFeeds: Dispatch<React.SetStateAction<boolean>>;
  resetGlobalState: () => void;
  initializeGlobalState: () => Promise<void>;
  user: Models.User<Models.Preferences> | null;
  userInfo: UserType.Info;
  userPost: PostType.Info[];
  userLine: LineType.Info[];
  userNotification: NotificationType.Info[];
  fcmToken?: string;
  isRefreshFeeds: boolean;
  isLoading: boolean;
  isInternetReachable: boolean | undefined;
}

const emptyUserInfo: UserType.Info = {
  id: "",
  username: "",
  name: ["", "", ""],
  avatar_url: "",
  role: ["", "", "", ""],
  created_at: new Date(0),
};

const defaultValue: GlobalContextInterface = {
  setUser: () => {},
  setUserInfo: () => {},
  setUserPost: () => {},
  setUserLine: () => {},
  setUserNotification: () => {},
  refreshUserRecord: () => {},
  setIsRefreshFeeds: () => {},
  resetGlobalState: () => {},
  initializeGlobalState: async () => {},
  user: null,
  userInfo: emptyUserInfo,
  userPost: [],
  userLine: [],
  userNotification: [],
  fcmToken: undefined,
  isRefreshFeeds: false,
  isLoading: false,
  isInternetReachable: undefined,
};

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
  const [isRefreshFeeds, setIsRefreshFeeds] = useState(false);
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
    setIsRefreshFeeds(false);
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
        setIsRefreshFeeds,
        resetGlobalState,
        initializeGlobalState,
        user,
        userInfo,
        userPost,
        userLine,
        userNotification,
        fcmToken,
        isRefreshFeeds,
        isLoading,
        isInternetReachable,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
