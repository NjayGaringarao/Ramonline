import { Models } from "react-native-appwrite";

export interface RefreshUserRecordType {
  info?: boolean;
  line?: boolean;
  post?: boolean;
  notification?: boolean;
}

export interface GlobalContextInterface {
  setUser: Dispatch<
    React.SetStateAction<Models.User<Models.Preferences> | null>
  >;
  setUserInfo: Dispatch<React.SetStateAction<UserType.Info>>;
  setUserPost: Dispatch<React.SetStateAction<PostType.Info[]>>;
  setUserLine: Dispatch<React.SetStateAction<LineType.Info[]>>;
  setUserNotification: Dispatch<React.SetStateAction<NotificationType.Info[]>>;
  refreshUserRecord: (update: RefreshUserRecordType) => void;
  setIsRefreshLineFeed: Dispatch<React.SetStateAction<boolean>>;
  setIsRefreshPostFeed: Dispatch<React.SetStateAction<boolean>>;
  resetGlobalState: () => void;
  initializeGlobalState: () => Promise<void>;
  user: Models.User<Models.Preferences> | null;
  userInfo: UserType.Info;
  userPost: PostType.Info[];
  userLine: LineType.Info[];
  userNotification: NotificationType.Info[];
  fcmToken?: string;
  isRefreshLineFeed: boolean;
  isRefreshPostFeed: boolean;
  isLoading: boolean;
  isInternetConnection: boolean | null;
}
