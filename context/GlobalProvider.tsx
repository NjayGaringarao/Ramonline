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
  requestNotificationPermissions,
  setupNotificationHandlers,
} from "@/services/notificationServices";
import {
  getCurrentUser,
  getUserActivity,
  getUserInfo,
} from "@/services/userServices";
import { setupPushTarget } from "@/services/notificationServices";
import { Models } from "react-native-appwrite";
import { useNetworkState } from "expo-network";
import { UserRecordType } from "@/types/utils";
import { getUserLineList } from "@/services/lineServices";
import { getUserPostList } from "@/services/postServices";

interface IRefreshUserRecordType {
  info: boolean;
  activity: boolean;
  line: boolean;
  post: boolean;
}

type GlobalContextProps = {
  children: ReactNode;
};

export interface GlobalContextInterface {
  setUser: Dispatch<
    React.SetStateAction<Models.User<Models.Preferences> | null>
  >;
  setUserRecord: Dispatch<React.SetStateAction<UserRecordType>>;
  refreshUserRecord: (update: IRefreshUserRecordType) => void;
  setIsRefreshFeeds: Dispatch<React.SetStateAction<boolean>>;
  user: Models.User<Models.Preferences> | null;
  userRecord: UserRecordType;
  fcmToken?: string;
  isRefreshFeeds: boolean;
  isLoading: boolean;
  isOnline: boolean;
}

const emptyUserRecord: UserRecordType = {
  info: {
    id: "",
    username: "",
    name: [undefined, undefined, undefined],
    avatar_url: "",
    picture_id: undefined,
    role: [undefined, undefined, undefined, undefined],
    created_at: new Date(0),
  },
  activity: {
    id: "",
    viewed_notification_id: [],
  },
  line: {
    total: 0,
    line_info: [],
  },
  post: {
    total: 0,
    post_info: [],
  },
};

const defaultValue: GlobalContextInterface = {
  setUser: (param: Models.User<Models.Preferences> | null) => {},
  setUserRecord: (param: UserRecordType) => {},
  setIsRefreshFeeds: (param: boolean) => {},
  refreshUserRecord: ({
    info = false,
    activity = false,
    line = false,
    post = false,
  }) => {},
  user: null,
  userRecord: emptyUserRecord,
  fcmToken: undefined,
  isRefreshFeeds: false,
  isLoading: false,
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
  const [userRecord, setUserRecord] = useState(emptyUserRecord);
  const [isRefreshFeeds, setIsRefreshFeeds] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [fcmToken, setFcmToken] = useState<string>();
  useEffect(() => {
    const initialize = async () => {
      await requestNotificationPermissions();
      setupNotificationHandlers();

      getCurrentUser()
        .then(async (user) => {
          if (user) {
            setUser(user);
            const fcm = await getFCMToken(setFcmToken);
            if (fcm) await setupPushTarget(user, fcm);

            setUserRecord({
              info: await getUserInfo(user.$id),
              activity: await getUserActivity(user.$id),
              line: await getUserLineList(user.$id),
              post: await getUserPostList(user.$id),
            });
          } else {
            setUser(null);
          }
        })
        .catch((error) => console.log(error))
        .finally(() => setIsLoading(false));
    };

    initialize();
  }, []);

  const refreshUserRecord = async ({
    info,
    activity,
    line,
    post,
  }: IRefreshUserRecordType) => {
    if (user)
      setUserRecord({
        info: info ? await getUserInfo(user.$id) : userRecord.info,
        activity: activity
          ? await getUserActivity(user.$id)
          : userRecord.activity,
        line: line ? await getUserLineList(user.$id) : userRecord.line,
        post: post ? await getUserPostList(user.$id) : userRecord.post,
      });
  };
  useEffect(() => {
    setIsOnline(!!isInternetReachable);
  }, [isInternetReachable]);

  return (
    <GlobalContext.Provider
      value={{
        setUser,
        setUserRecord,
        refreshUserRecord,
        setIsRefreshFeeds,
        user,
        userRecord,
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
