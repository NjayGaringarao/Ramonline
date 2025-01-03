// context/GlobalProvider.tsx
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
import { getCurrentUser, getUserInfo } from "@/services/userServices";
import { setupPushTarget } from "@/services/notificationServices";
import { ExtendedUserType } from "@/constants/types";
import { Models } from "react-native-appwrite";
import { useNetworkState } from "expo-network";

type GlobalContextProps = {
  children: ReactNode;
};

export interface GlobalContextInterface {
  user: Models.User<Models.Preferences> | null;
  setUser: Dispatch<
    React.SetStateAction<Models.User<Models.Preferences> | null>
  >;
  isLoading: boolean;
  setUserInfo: Dispatch<React.SetStateAction<ExtendedUserType>>;
  userInfo: ExtendedUserType;
  fcmToken: string;
  setFcmToken: Dispatch<React.SetStateAction<string>>;
  setIsRefreshUserInfo: Dispatch<React.SetStateAction<boolean>>;
  isRefreshUserInfo: boolean;
  setIsRefreshFeeds: Dispatch<React.SetStateAction<boolean>>;
  isRefreshFeeds: boolean;
  isOnline: boolean;
}

const noUser: ExtendedUserType = {
  id: "",
  email: "",
  username: "",
  avatar_url: "",
  joined_at: "",
  posts: [],
  subscriptions: [],
  lines: [],
  viewed_notification_ids: [],
  role: "",
};

const defaultValue: GlobalContextInterface = {
  user: null,
  setUser: (user: Models.User<Models.Preferences> | null) => {},
  isLoading: true,
  setUserInfo: (userInfo: ExtendedUserType) => {},
  userInfo: noUser,
  fcmToken: "",
  setFcmToken: (fcmToken: string) => {},
  setIsRefreshUserInfo: (isRefreshUserInfo: boolean) => {},
  isRefreshUserInfo: false,
  setIsRefreshFeeds: (isRefreshFeeds: boolean) => {},
  isRefreshFeeds: false,
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
  const [userInfo, setUserInfo] = useState<ExtendedUserType>(noUser);
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
              const userInfo = await getUserInfo(res.$id, true);
              setUserInfo(userInfo);
              await setupPushTarget(token, res, userInfo.subscriptions);
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
      if (user) setUserInfo(await getUserInfo(user.$id, true));
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
        isLoading,
        setUser,
        user,
        setUserInfo,
        userInfo,
        setFcmToken,
        fcmToken,
        setIsRefreshUserInfo,
        isRefreshUserInfo,
        setIsRefreshFeeds,
        isRefreshFeeds,
        isOnline,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
