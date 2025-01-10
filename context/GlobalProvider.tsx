import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  Dispatch,
  ReactNode,
} from "react";
import {
  requestNotificationPermissions,
  getFCMToken,
  setupNotificationHandlers,
} from "@/services/notificationServices";
import {
  getCurrentUser,
  getUserActivity,
  getUserInfo,
} from "@/services/userServices";
import { setupPushTarget } from "@/services/notificationServices";
import { UserType } from "@/types/models";
import { Models } from "react-native-appwrite";
import { useNetworkState } from "expo-network";

type GlobalContextProps = {
  children: ReactNode;
};

export interface GlobalContextInterface {
  setUser: Dispatch<
    React.SetStateAction<Models.User<Models.Preferences> | null>
  >;
  setUserInfo: Dispatch<React.SetStateAction<UserType.Info>>;
  setUserActivity: Dispatch<React.SetStateAction<UserType.Activity>>;
  setFcmToken: Dispatch<React.SetStateAction<string>>;
  setIsRefreshUserInfo: Dispatch<React.SetStateAction<boolean>>;
  setIsRefreshFeeds: Dispatch<React.SetStateAction<boolean>>;
  user: Models.User<Models.Preferences> | null;
  userInfo: UserType.Info;
  userActivity: UserType.Activity;
  fcmToken: string;
  isRefreshUserInfo: boolean;
  isRefreshFeeds: boolean;
  isLoading: boolean;
  isOnline: boolean;
}

const noUser: UserType.Info = {
  id: "",
  username: "",
  avatar_url: "",
  created_at: new Date(),
  role: [],
  name: [],
};

const noUserActivity: UserType.Activity = {
  id: "",
  viewed_notification_id: [],
};

const defaultValue: GlobalContextInterface = {
  setUser: (e: Models.User<Models.Preferences> | null) => {},
  setUserInfo: (e: UserType.Info) => {},
  setUserActivity: (e: UserType.Activity) => {},
  setFcmToken: (fcmToken: string) => {},
  setIsRefreshUserInfo: (isRefreshUserInfo: boolean) => {},
  setIsRefreshFeeds: (isRefreshFeeds: boolean) => {},
  user: null,
  userInfo: noUser,
  userActivity: noUserActivity,
  fcmToken: "",
  isRefreshUserInfo: false,
  isRefreshFeeds: false,
  isLoading: true,
  isOnline: true,
} as GlobalContextInterface;

export const GlobalContext =
  createContext<GlobalContextInterface>(defaultValue);

export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }: GlobalContextProps) => {
  const { isInternetReachable } = useNetworkState();
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserType.Info>(noUser);
  const [userActivity, setUserActivity] =
    useState<UserType.Activity>(noUserActivity);
  const [fcmToken, setFcmToken] = useState<string>("");
  const [isRefreshUserInfo, setIsRefreshUserInfo] = useState(false);
  const [isRefreshFeeds, setIsRefreshFeeds] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      await requestNotificationPermissions();
      setupNotificationHandlers();

      getCurrentUser()
        .then(async (res) => {
          if (res) {
            setUser(res);
            const token = await getFCMToken(setFcmToken);
            if (token) {
              setUserInfo(await getUserInfo(res.$id));
              setUserActivity(await getUserActivity(res.$id));
              await setupPushTarget(token, res);
            }
          } else {
            setUser(null);
            setUserInfo(noUser);
          }
        })
        .catch((error) => console.log(error))
        .finally(() => setIsLoading(false));
    };

    initialize();
  }, []);

  useEffect(() => {
    const refresh = async () => {
      if (user) setUserInfo(await getUserInfo(user.$id));
    };
    if (isRefreshUserInfo) {
      refresh();
      setIsRefreshUserInfo(false);
    }
  }, [isRefreshUserInfo]);

  useEffect(() => {
    setIsOnline(!!isInternetReachable);
  }, [isInternetReachable]);

  return (
    <GlobalContext.Provider
      value={{
        setUser,
        setUserInfo,
        setUserActivity,
        setFcmToken,
        setIsRefreshUserInfo,
        setIsRefreshFeeds,
        user,
        userInfo,
        userActivity,
        fcmToken,
        isLoading,
        isRefreshUserInfo,
        isRefreshFeeds,
        isOnline,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
