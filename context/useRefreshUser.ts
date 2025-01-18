import { getUserInfo } from "@/services/userServices";
import { getUserLineList } from "@/services/lineServices";
import { getUserPostList } from "@/services/postServices";
import { getUserNotificationList } from "@/services/notificationServices";
import { RefreshUserRecordType } from "./GlobalContext";
import { Models } from "react-native-appwrite";

export const useRefreshUser = (
  user: Models.User<Models.Preferences> | null,
  setUserInfo: (info: any) => void,
  setUserLine: (lines: any) => void,
  setUserPost: (posts: any) => void,
  setUserNotification: (notifications: any) => void
) => {
  return async ({ info, line, post, notification }: RefreshUserRecordType) => {
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
};
