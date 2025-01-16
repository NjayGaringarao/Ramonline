import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  Dispatch,
  ReactNode,
} from "react";
import {
  getFCMToken,
  getUserNotificationList,
  requestNotificationPermissions,
  setupNotificationHandlers,
  setupPushTarget,
} from "@/services/notificationServices";
import {
  getCurrentUser,
  getUserActivity,
  getUserInfo,
} from "@/services/userServices";
import { getUserLineList } from "@/services/lineServices";
import { getUserPostList } from "@/services/postServices";
import { Models } from "react-native-appwrite";
import { useNetworkState } from "expo-network";
import { UserType, PostType, LineType, NotificationType } from "@/types/models";

interface RefreshUserRecordType {
  info?: boolean;
  activity?: boolean;
  line?: boolean;
  post?: boolean;
  notification?: boolean;
}

type GlobalContextProps = {
  children: ReactNode;
};

export interface GlobalContextInterface {
  setUser: Dispatch<
    React.SetStateAction<Models.User<Models.Preferences> | null>
  >;
  setUserInfo: Dispatch<React.SetStateAction<UserType.Info>>;
  setUserActivity: Dispatch<React.SetStateAction<UserType.Activity>>;
  setUserPost: Dispatch<React.SetStateAction<PostType.Info[]>>;
  setUserLine: Dispatch<React.SetStateAction<LineType.Info[]>>;
  setUserNotification: Dispatch<React.SetStateAction<NotificationType.Info[]>>;
  refreshUserRecord: (update: RefreshUserRecordType) => void;
  setIsRefreshFeeds: Dispatch<React.SetStateAction<boolean>>;
  user: Models.User<Models.Preferences> | null;
  userInfo: UserType.Info;
  userActivity: UserType.Activity;
  userPost: PostType.Info[];
  userLine: LineType.Info[];
  userNotification: NotificationType.Info[];
  fcmToken?: string;
  isRefreshFeeds: boolean;
  isLoading: boolean;
  isOnline: boolean;
}

const emptyUserInfo: UserType.Info = {
  id: "",
  username: "",
  name: ["", "", ""], // Ensuring default structure for name
  avatar_url: "",
  role: ["", "", "", ""], // Ensuring default structure for role
  created_at: new Date(0),
};

const emptyUserActivity: UserType.Activity = {
  id: "",
  viewed_notification_id: [],
};

const defaultValue: GlobalContextInterface = {
  setUser: () => {},
  setUserInfo: () => {},
  setUserActivity: () => {},
  setUserPost: () => {},
  setUserLine: () => {},
  setUserNotification: () => {},
  refreshUserRecord: () => {},
  setIsRefreshFeeds: () => {},
  user: null,
  userInfo: emptyUserInfo,
  userActivity: emptyUserActivity,
  userPost: [],
  userLine: [],
  userNotification: [],
  fcmToken: undefined,
  isRefreshFeeds: false,
  isLoading: false,
  isOnline: true,
};

export const GlobalContext =
  createContext<GlobalContextInterface>(defaultValue);
export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }: GlobalContextProps) => {
  const { isInternetReachable } = useNetworkState();
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null
  );
  const [userInfo, setUserInfo] = useState<UserType.Info>(emptyUserInfo);
  const [userActivity, setUserActivity] =
    useState<UserType.Activity>(emptyUserActivity);
  const [userPost, setUserPost] = useState<PostType.Info[]>([]);
  const [userLine, setUserLine] = useState<LineType.Info[]>([]);
  const [userNotification, setUserNotification] = useState<
    NotificationType.Info[]
  >([]);
  const [isRefreshFeeds, setIsRefreshFeeds] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [fcmToken, setFcmToken] = useState<string>();

  useEffect(() => {
    const initialize = async () => {
      await requestNotificationPermissions();
      setupNotificationHandlers();

      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          const fcm = await getFCMToken(setFcmToken);
          if (fcm) await setupPushTarget(currentUser, fcm);

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

  const refreshUserRecord = async ({
    info,
    activity,
    line,
    post,
    notification,
  }: RefreshUserRecordType) => {
    if (!user?.$id) return;

    const updates = [];

    if (info) updates.push(getUserInfo(user.$id).then(setUserInfo));
    if (activity) updates.push(getUserActivity(user.$id).then(setUserActivity));
    if (line) updates.push(getUserLineList(user.$id).then(setUserLine));
    if (post) updates.push(getUserPostList(user.$id).then(setUserPost));
    if (notification)
      updates.push(getUserNotificationList(user.$id).then(setUserNotification));
    await Promise.all(updates);
  };

  useEffect(() => {
    setIsOnline(!!isInternetReachable);
  }, [isInternetReachable]);

  return (
    <GlobalContext.Provider
      value={{
        setUser,
        setUserInfo,
        setUserActivity,
        setUserPost,
        setUserLine,
        setUserNotification,
        refreshUserRecord,
        setIsRefreshFeeds,
        user,
        userInfo,
        userActivity,
        userPost,
        userLine,
        userNotification,
        fcmToken,
        isLoading,
        isRefreshFeeds,
        isOnline,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
