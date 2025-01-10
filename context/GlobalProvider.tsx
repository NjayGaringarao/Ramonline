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

interface RefreshRecordUserType {
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
  setIsRefreshUserRecord: Dispatch<React.SetStateAction<RefreshRecordUserType>>;
  setIsRefreshFeeds: Dispatch<React.SetStateAction<boolean>>;
  user: Models.User<Models.Preferences> | null;
  userRecord: UserRecordType;
  isRefreshUserRecord: RefreshRecordUserType;
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
  setIsRefreshUserRecord: (param: RefreshRecordUserType) => {},
  setIsRefreshFeeds: (param: boolean) => {},
  user: null,
  userRecord: emptyUserRecord,
  isRefreshUserRecord: {
    info: false,
    activity: false,
    line: false,
    post: false,
  },
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
  const [isRefreshUserRecord, setIsRefreshUserRecord] =
    useState<RefreshRecordUserType>({
      info: false,
      activity: false,
      line: false,
      post: false,
    });
  const [isRefreshFeeds, setIsRefreshFeeds] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    const initialize = async () => {
      await requestNotificationPermissions();
      setupNotificationHandlers();

      getCurrentUser()
        .then(async (user) => {
          if (user) {
            setUser(user);

            setUserRecord({
              info: await getUserInfo(user.$id),
              activity: await getUserActivity(user.$id),
              line: await getUserLineList(user.$id),
              post: await getUserPostList(user.$id),
            });
            await setupPushTarget(user);
          } else {
            setUser(null);
          }
        })
        .catch((error) => console.log(error))
        .finally(() => setIsLoading(false));
    };

    initialize();
  }, []);

  useEffect(() => {
    const refresh = async () => {
      try {
        setIsLoading(true);
        if (user) {
          setUserRecord({
            info: isRefreshUserRecord.info
              ? await getUserInfo(user.$id)
              : userRecord.info,
            activity: isRefreshUserRecord.activity
              ? await getUserActivity(user.$id)
              : userRecord.activity,
            line: isRefreshUserRecord.line
              ? await getUserLineList(user.$id)
              : userRecord.line,
            post: isRefreshUserRecord.post
              ? await getUserPostList(user.$id)
              : userRecord.post,
          });
        }
      } catch (error) {
        console.log(
          "GlobalProvider : There was a problem querying user information"
        );
      } finally {
        setIsLoading(false);
      }
    };
    if (isRefreshUserRecord) {
      refresh();
      setIsRefreshUserRecord({
        info: false,
        activity: false,
        line: false,
        post: false,
      });
    }
  }, [isRefreshUserRecord]);

  useEffect(() => {
    setIsOnline(!!isInternetReachable);
  }, [isInternetReachable]);

  return (
    <GlobalContext.Provider
      value={{
        setUser,
        setUserRecord,
        setIsRefreshUserRecord,
        setIsRefreshFeeds,
        user,
        userRecord,
        isRefreshUserRecord,
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
