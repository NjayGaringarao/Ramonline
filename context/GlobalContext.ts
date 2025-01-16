// GlobalContext.ts
import { createContext, useContext, Dispatch } from "react";
import { Models } from "react-native-appwrite";
import { UserType, PostType, LineType, NotificationType } from "@/types/models";

export interface RefreshUserRecordType {
  info?: boolean;
  activity?: boolean;
  line?: boolean;
  post?: boolean;
  notification?: boolean;
}

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
  isInternetReachable: boolean | undefined;
}

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
  userInfo: {
    id: "",
    username: "",
    name: ["", "", ""],
    avatar_url: "",
    role: ["", "", "", ""],
    created_at: new Date(0),
  },
  userActivity: { id: "", viewed_notification_id: [] },
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
