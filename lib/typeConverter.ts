import notification from "@/app/(tabs)/notification";
import {
  PostType,
  LineType,
  UserType,
  ExtendedUserType,
  NotificationType,
  SessionType,
} from "@/constants/types";
import { Models } from "react-native-appwrite";

//#region User
export const toUser = (document: Models.Document) => {
  const user: UserType = {
    id: document.$id,
    email: document.email,
    username: document.username,
    name: document.name,
    avatar_url: document.avatar_url,
    picture_id: document.picture_id,
    role: document.role,
    joined_at: document.joined_at,
  };
  return user;
};

export const toExtendedUser = (
  document: Models.Document,
  userLines: LineType[]
) => {
  const user: UserType = {
    id: document.$id,
    email: document.email,
    username: document.username,
    name: document.name,
    avatar_url: document.avatar_url,
    picture_id: document.picture_id,
    role: document.role,
    joined_at: document.joined_at,
  };
  const extendedUser: ExtendedUserType = {
    ...user,
    posts: extractToPostList(document.posts, user),
    subscriptions: toLineList(document.subscriptions),
    lines: userLines,
    viewed_notification_ids: document.viewed_notification_ids,
  };

  return extendedUser;
};

//#endregion

//#region  Post

export const extractToPostList = (
  postDocuments: Models.Document[],
  user: UserType
) => {
  let posts: PostType[] = [];
  for (let i = 0; postDocuments.length > i; i++) {
    const post: PostType = {
      id: postDocuments[i].$id,
      user: user,
      caption: postDocuments[i].caption,
      image_ids: postDocuments[i].image_ids,
      audio_id: postDocuments[i].audio_id,
      created_at: postDocuments[i].created_at,
    };
    posts.push(post);
  }
  return posts;
};

export const toPostList = (postDocuments: Models.Document[]) => {
  let postList: PostType[] = [];

  for (let i = 0; postDocuments.length > i; i++) {
    const post: PostType = {
      id: postDocuments[i].$id,
      user: {
        id: postDocuments[i].user.$id,
        email: postDocuments[i].user.email,
        username: postDocuments[i].user.username,
        name: postDocuments[i].user.name,
        avatar_url: postDocuments[i].user.avatar_url,
        picture_id: postDocuments[i].user.picture_id,
        role: postDocuments[i].user.role,
        joined_at: postDocuments[i].user.joined_at,
      },
      caption: postDocuments[i].caption,
      image_ids: postDocuments[i].image_ids,
      audio_id: postDocuments[i].audio_id,
      created_at: postDocuments[i].created_at,
    };
    postList.push(post);
  }

  return postList;
};

export const toPost = (postDocument: Models.Document): PostType => {
  return {
    id: postDocument.$id,
    user: toUser(postDocument.user),
    caption: postDocument.caption,
    image_ids: postDocument.image_ids,
    audio_id: postDocument.audio_id,
    created_at: postDocument.created_at,
  };
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

export const toNotificationList = (
  notificationDocuments: Models.Document[]
) => {
  if (notificationDocuments && notificationDocuments.length) {
    let notificationList: NotificationType[] = [];

    for (let i = 0; notificationDocuments.length > i; i++) {
      const notification = toNotification(notificationDocuments[i]);
      notificationList.push(notification);
    }
    return notificationList;
  } else {
    return [];
  }
};

export const toNotification = (notificationDocument: Models.Document) => {
  return {
    id: notificationDocument.$id,
    created_at: notificationDocument.created_at,
    title: notificationDocument.title,
    description: notificationDocument.description,
    line_id: notificationDocument.line_id,
    post_id: notificationDocument.post_id,
  };
};

//#endregion

//#region Line

export const toLineList = (lineDocuments?: Models.Document[]) => {
  if (lineDocuments && lineDocuments.length) {
    let lineList: LineType[] = [];

    for (let i = 0; lineDocuments.length > i; i++) {
      const line: LineType = toLine(lineDocuments[i]);

      lineList.push(line);
    }
    return lineList;
  } else {
    return [];
  }
};

export const toLine = (lineDocument: Models.Document) => {
  return {
    id: lineDocument.$id,
    created_at: lineDocument.created_at,
    name: lineDocument.name,
    description: lineDocument.description,
    user_id: lineDocument.user_id,
    banner_id: lineDocument.banner_id,
  };
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
      deviceModel: rawSession.sessions[i].deviceModel,
      osName: rawSession.sessions[i].osName,
      countryName: rawSession.sessions[i].countryName,
      ip: rawSession.sessions[i].ip,
    };

    sessions.push(session);
  }

  return sessions;
};

//#endregion
