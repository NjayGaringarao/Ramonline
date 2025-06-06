import { Models, Query } from "react-native-appwrite";
import {
  _createTarget,
  _deleteDocument,
  _deleteTarget,
  _getCurrentUser,
  _getDocument,
  _getSession,
  _listDocuments,
  _listSession,
  _subscribeTopic,
  _unsubscribeTopic,
  _updateDocument,
  _updateTarget,
} from "./appwrite";
import messaging from "@react-native-firebase/messaging";
import * as Notifications from "expo-notifications";
import { Alert } from "react-native";
import {
  toLineInfoList,
  toLineSubscriptionList,
  toNotificationInfoList,
  toPushTargetList,
} from "@/lib/typeConverter";
import { env } from "@/constants/env";
import { LineType, NotificationType, UserType } from "@/types/models";
import { hashId } from "@/lib/commonUtil";

//#region Notification Handling

// Request permission for notifications
export const requestNotificationPermissions = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    console.log("Notification permission not granted!");
  }
};

// Retrieve FCM token and request permission
export const getFCMToken = async (setFcmToken?: (token: string) => void) => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    const fcmToken = await messaging().getToken();
    if (setFcmToken) setFcmToken(fcmToken);
    console.log(`FCM Token: ${fcmToken}`);
    return fcmToken;
  } else {
    console.log("Notification permission not granted for FCM.");
    return undefined;
  }
};

//#region Notification Setup
const getMatchedSessionTarget = (
  targets: Models.Target[],
  session: Models.Session
) => {
  const matchedTargets: Models.Target[] = [];

  for (let i = 0; targets.length > i; i++) {
    if (targets[i].$id === hashId(session.$id)) return targets[i];
  }
  return undefined;
};

const validateTargets = async (targets: Models.Target[]) => {
  try {
    const sessionList = await _listSession();

    // getting push targets
    const pushTargets: Models.Target[] = toPushTargetList(targets);

    // getting unused pushtargets
    let unusedPushTargets: Models.Target[] = [];
    pushTargets.forEach((target) => {
      const isUsed = sessionList.sessions.some((session) => {
        return hashId(session.$id) === target.$id;
      });

      if (!isUsed) {
        unusedPushTargets.push(target);
      }
    });

    // delete unused pushtargets (if there is any)
    if (unusedPushTargets.length) {
      unusedPushTargets.forEach(async (targets) => {
        await _deleteTarget(targets.$id);
      });
    }
  } catch (error) {
    throw Error(`validateTargetsWithSessions : ${error}`);
  }
};

const resubscribeTopics = async (
  pushTargets: Models.Target[],
  userSubscriptions: LineType.Subscription[]
) => {
  // iterates all user subscriptions. each iteration, there is a iteration of pushtargets where the actual resubscription happens
  userSubscriptions.forEach((subscription) => {
    pushTargets.forEach(async (target) => {
      try {
        await _subscribeTopic(subscription.line_id, target.$id);
      } catch (error) {
        console.log(
          `setupNewPushTarget - topic ID : ${subscription.line_id} PushTarget ID: ${target.$id} \n Error : ${error}`
        );
      }
    });
  });
};

export const setupPushTarget = async (
  user: Models.User<Models.Preferences>,
  fcmToken: string
) => {
  try {
    const lineSubscriptionDocuments = await _listDocuments(
      env.DATABASE_PRIMARY,
      env.COLLECTION_LINE_SUBSCRIPTION,
      [Query.equal("user_id", user.$id)]
    );
    const lineSubscription = toLineSubscriptionList(
      lineSubscriptionDocuments.documents
    );

    const session = await _getSession();
    const matchedSessionTarget = getMatchedSessionTarget(user.targets, session);

    if (matchedSessionTarget) {
      if (fcmToken != matchedSessionTarget.identifier) {
        user.targets.filter(
          (target) => target.$id !== matchedSessionTarget.$id
        );
        user.targets.push(await _updateTarget(hashId(session.$id), fcmToken));
      }
    } else {
      user.targets.push(await _createTarget(hashId(session.$id), fcmToken));
    }

    await validateTargets(user.targets);
    // do resubscription of all the targets into lists of subscriptions in user docs
    const newUser = await _getCurrentUser();
    const newPushTarget: Models.Target[] = toPushTargetList(newUser.targets);
    resubscribeTopics(newPushTarget, lineSubscription);
    return newUser;
  } catch (error) {
    console.log(
      `notificationServices.ts => setupPushTarget :: ERROR : ${error}`
    );
  }
};

//to be used when Logging out
export const deletePushTarget = async () => {
  try {
    const session = await _getSession();
    await _deleteTarget(hashId(session.$id));
  } catch (error) {
    console.log(
      `notificationServices.ts => deletePushTarget :: ERROR : ${error}`
    );
  }
};

//#endregion

//#region Notification Database

export const getUserNotificationList = async (user_id: string) => {
  try {
    const notification = await _listDocuments(
      env.DATABASE_PRIMARY,
      env.COLLECTION_NOTIFICATION_INFO,
      [Query.equal("user_id", user_id), Query.orderDesc("created_at")]
    );

    return toNotificationInfoList(notification.documents);
  } catch (error) {
    console.error(
      `notificationServices.ts => getNotification :: ERROR : ${error}`
    );
    return [];
  }
};

export const setNotificationViewed = async (notification_id: string) => {
  try {
    return await _updateDocument(
      env.DATABASE_PRIMARY,
      env.COLLECTION_NOTIFICATION_INFO,
      notification_id,
      {
        isViewed: true,
      }
    );
  } catch (error) {
    console.error(
      `notificationServices.ts => setNotificationViewed :: ERROR : ${error}`
    );
  }
};

export const deleteNotification = async (
  notification: NotificationType.Info[]
) => {
  for (let i = 0; notification.length > i; i++) {
    try {
      await _deleteDocument(
        env.DATABASE_PRIMARY,
        env.COLLECTION_NOTIFICATION_INFO,
        notification[i].id
      );
    } catch (error) {
      console.error(
        `notificationServices.ts => deleteNotification :: ERROR : ${error}`
      );
    }
  }
};
//#endregion
