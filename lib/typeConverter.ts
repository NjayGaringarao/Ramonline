import { LineType, NotificationType, PostType, UserType } from "@/types/models";
import { SessionType } from "@/types/utils";
import { Models } from "react-native-appwrite";

//#region User
export const toUserInfo = (document: Models.Document) => {
  const user: UserType.Info = {
    id: document.$id,
    username: document.username,
    name: document.name,
    avatar_url: document.avatar_url,
    picture_id: document.picture_id,
    role: document.role,
    created_at: new Date(document.created_at),
  };
  return user;
};

export const toUserInfoList = (documents: Models.Document[]) => {
  const userList: UserType.Info[] = [];

  for (let i = 0; documents.length > i; i++) {
    userList.push(toUserInfo(documents[i]));
  }

  return userList;
};

//#endregion

//#region  Post

export const toPostInfo = (document: Models.Document) => {
  const post: PostType.Info = {
    id: document.$id,
    caption: document.caption,
    user_id: document.user_id,
    image_id: document.image_id,
    created_at: new Date(document.created_at),
  };

  return post;
};

export const toPostInfoList = (documents: Models.Document[]) => {
  const postList: PostType.Info[] = [];

  for (let i = 0; documents.length > i; i++) {
    postList.push(toPostInfo(documents[i]));
  }

  return postList;
};

//#endregion

//#region Notification

export const toPushTargetList = (userTargets: Models.Target[]) => {
  const pushTargets: Models.Target[] = [];
  userTargets.forEach((target) => {
    if (target.providerType === "push") {
      pushTargets.push(target);
    }
  });

  return pushTargets;
};

export const toNotificationInfo = (document: Models.Document) => {
  const notification: NotificationType.Info = {
    id: document.$id,
    title: document.title,
    description: document.description,
    user_id: document.user_id,
    origin: [document.origin[0], document.origin[1]],
    content: [document.content[0], document.content[1]],
    isViewed: !!document.isViewed,
    created_at: new Date(document.created_at),
  };

  return notification;
};

export const toNotificationInfoList = (documents: Models.Document[]) => {
  const notificationList: NotificationType.Info[] = [];

  for (let i = 0; documents.length > i; i++) {
    notificationList.push(toNotificationInfo(documents[i]));
  }

  return notificationList;
};

//#endregion

//#region Line

export const toLineInfo = (document: Models.Document) => {
  const line: LineType.Info = {
    id: document.$id,
    name: document.name,
    description: document.description,
    banner_id: document.banner_id,
    user_id: document.user_id,
    created_at: new Date(document.created_at),
  };

  return line;
};

export const toLineInfoList = (documents: Models.Document[]) => {
  const lineList: LineType.Info[] = [];

  for (let i = 0; documents.length > i; i++) {
    lineList.push(toLineInfo(documents[i]));
  }

  return lineList;
};

export const toLineSubscription = (document: Models.Document) => {
  const line: LineType.Subscription = {
    id: document.$id,
    user_id: document.user_id,
    line_id: document.line_id,
  };

  return line;
};

export const toLineSubscriptionList = (documents: Models.Document[]) => {
  const lineList: LineType.Subscription[] = [];

  for (let i = 0; documents.length > i; i++) {
    lineList.push(toLineSubscription(documents[i]));
  }

  return lineList;
};
//#endregion

//#region Other

export const toSessionList = (rawSession: Models.SessionList) => {
  let sessions: SessionType[] = [];

  if (!rawSession.total) return [];

  for (let i = 0; rawSession.total > i; i++) {
    const session: SessionType = {
      id: rawSession.sessions[i].$id,
      current: rawSession.sessions[i].current,
      created_at: new Date(rawSession.sessions[i].$createdAt),
      osName: rawSession.sessions[i].osName,
      country: rawSession.sessions[i].countryCode,
      ip: rawSession.sessions[i].ip,
    };

    sessions.push(session);
  }

  return sessions;
};

//#endregion
