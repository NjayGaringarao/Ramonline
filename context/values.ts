import { UserType } from "@/types/models";
import { GlobalContextInterface } from "./context";

export const emptyUserInfo: UserType.Info = {
  id: "",
  username: "",
  name: ["", "", ""],
  avatar_url: "",
  role: ["", "", "", ""],
  created_at: new Date(0),
};

export const defaultValue: GlobalContextInterface = {
  setUser: () => {},
  setUserInfo: () => {},
  setUserPost: () => {},
  setUserLine: () => {},
  setUserNotification: () => {},
  refreshUserRecord: () => {},
  setIsRefreshLineFeed: () => {},
  setIsRefreshPostFeed: () => {},
  resetGlobalState: () => {},
  initializeGlobalState: async () => {},
  user: null,
  userInfo: emptyUserInfo,
  userPost: [],
  userLine: [],
  userNotification: [],
  fcmToken: undefined,
  isRefreshLineFeed: false,
  isRefreshPostFeed: false,
  isLoading: false,
  isInternetConnection: null,
};
