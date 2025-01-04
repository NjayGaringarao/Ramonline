// import { Models } from "react-native-appwrite";
// import {
//   _createTarget,
//   _deleteTarget,
//   _getCurrentUser,
//   _getDocument,
//   _getSession,
//   _listSession,
//   _subscribeTopic,
//   _unsubscribeTopic,
//   _updateDocument,
// } from "./appwrite";
// import {
//   ExtendedUserType,
//   LineType,
//   NotificationType,
// } from "@/constants/types";
// import messaging from "@react-native-firebase/messaging";
// import * as Notifications from "expo-notifications";
// import { AppRegistry, Alert } from "react-native";
// import { toNotificationList, toPushTargetList } from "@/lib/typeConverter";
// import {
//   COLLECTION_USER_ID,
//   COLLECTION_USER_NOTIFICATION_ID,
// } from "@/constants/variables";

// //#region Firebase Messaging

// // Request permission for notifications
// export const requestNotificationPermissions = async () => {
//   const { status } = await Notifications.requestPermissionsAsync();
//   if (status !== "granted") {
//     console.log("Notification permission not granted!");
//   }
// };

// // Retrieve FCM token and request permission
// export const getFCMToken = async (setFcmToken?: (token: string) => void) => {
//   const authStatus = await messaging().requestPermission();
//   const enabled =
//     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//   if (enabled) {
//     const fcmToken = await messaging().getToken();
//     if (setFcmToken) setFcmToken(fcmToken);
//     console.log(`FCM Token: ${fcmToken}`);
//     return fcmToken;
//   } else {
//     console.log("Notification permission not granted for FCM.");
//     return undefined;
//   }
// };

// // Setup notification handlers
// export const setupNotificationHandlers = () => {
//   // Background message handler
//   // messaging().setBackgroundMessageHandler(async (remoteMessage) => {
//   //   console.log("Message handled in the background:", remoteMessage);
//   //   AppRegistry.registerComponent("index", () => {});
//   // });

//   // Handle notifications that open the app from a quit state
//   messaging()
//     .getInitialNotification()
//     .then((remoteMessage) => {
//       if (remoteMessage) {
//         console.log(
//           "Notification caused the app to open from quit state:",
//           remoteMessage.notification
//         );
//       }
//     });

//   // Handle notifications that open the app from the background
//   messaging().onNotificationOpenedApp((remoteMessage) => {
//     console.log(
//       "Notification caused app to open from background state:",
//       remoteMessage.notification
//     );
//   });

//   // Handle notifications when the app is in the foreground
//   messaging().onMessage(async (remoteMessage) => {
//     Alert.alert("A new FCM message arrived", JSON.stringify(remoteMessage));
//   });

//   Notifications.setNotificationHandler({
//     handleNotification: async () => ({
//       shouldShowAlert: true,
//       shouldPlaySound: true,
//       shouldSetBadge: true,
//     }),
//   });
// };

// //#endregion

// const getMatchedSessionTarget = async (
//   targets: Models.Target[],
//   session: Models.Session
// ) => {
//   let matchedTargets: Models.Target[] = [];

//   targets.forEach((target) => {
//     if (target.$id == session.$id) {
//       matchedTargets.push(target);
//     }
//   });

//   if (matchedTargets.length == 1) {
//     return matchedTargets[0];
//   } else {
//     return undefined;
//   }
// };

// const createPushTarget = async (sessionId: string, fcmToken: string) => {
//   try {
//     return await _createTarget(sessionId, fcmToken);
//   } catch (error) {
//     throw Error(`createPushTarget : ${error}`);
//   }
// };

// const validateTargets = async (targets: Models.Target[]) => {
//   try {
//     const sessionList = await _listSession();

//     // getting push targets
//     const pushTargets: Models.Target[] = toPushTargetList(targets);

//     // getting unused pushtargets
//     let unusedPushTargets: Models.Target[] = [];
//     pushTargets.forEach((target) => {
//       const isUsed = sessionList.sessions.some((session) => {
//         return session.$id === target.$id;
//       });

//       if (!isUsed) {
//         unusedPushTargets.push(target);
//       }
//     });

//     // delete unused pushtargets (if there is any)
//     if (unusedPushTargets.length) {
//       unusedPushTargets.forEach(async (targets) => {
//         await _deleteTarget(targets.$id);
//       });
//     }
//   } catch (error) {
//     throw Error(`validateTargetsWithSessions : ${error}`);
//   }
// };

// const resubscribeTopics = async (
//   pushTargets: Models.Target[],
//   userSubscriptions: LineType[]
// ) => {
//   // iterates all user subscriptions. each iteration, there is a iteration of pushtargets where the actual resubscription happens
//   userSubscriptions.forEach((subscription) => {
//     pushTargets.forEach(async (target) => {
//       try {
//         await _subscribeTopic(subscription.id, target.$id);
//       } catch (error) {
//         console.log(
//           `setupNewPushTarget - topic ID : ${subscription.id} PushTarget ID: ${target.$id} \n Error : ${error}`
//         );
//       }
//     });
//   });
// };

// // to be used when logging in
// export const setupPushTarget = async (
//   fcmToken: string,
//   user: Models.User<Models.Preferences>,
//   subscriptions: LineType[]
// ) => {
//   try {
//     const session = await _getSession();
//     const matchedSessionTarget = await getMatchedSessionTarget(
//       user.targets,
//       session
//     );

//     if (matchedSessionTarget) {
//       if (fcmToken != matchedSessionTarget.identifier) {
//         await _deleteTarget(matchedSessionTarget.$id);
//         user.targets.push(await createPushTarget(session.$id, fcmToken));
//       }
//     } else {
//       user.targets.push(await createPushTarget(session.$id, fcmToken));
//     }

//     await validateTargets(user.targets);
//     // do resubscription of all the targets into lists of subscriptions in user docs
//     const newUser = await _getCurrentUser();
//     const newPushTarget: Models.Target[] = toPushTargetList(newUser.targets);
//     resubscribeTopics(newPushTarget, subscriptions);
//     return newUser;
//   } catch (error) {
//     console.log(
//       `notificationServices.ts => setupPushTarget :: ERROR : ${error}`
//     );
//   }
// };

// //to be used when Logging out
// export const deletePushTarget = async () => {
//   try {
//     const session = await _getSession();
//     await _deleteTarget(session.$id);
//   } catch (error) {
//     console.log(
//       `notificationServices.ts => deletePushTarget :: ERROR : ${error}`
//     );
//   }
// };

// export const getNotifications = async (
//   user_id: string
// ): Promise<NotificationType[]> => {
//   try {
//     let result: NotificationType[] = [];
//     const notificationDocs = await _getDocument(
//       COLLECTION_USER_NOTIFICATION_ID,
//       user_id
//     );

//     if (notificationDocs.notifications) {
//       result = toNotificationList(notificationDocs.notifications);
//     }

//     return result;
//   } catch (error) {
//     console.error(
//       `notificationServices.ts => getNotification :: ERROR : ${error}`
//     );
//     return [];
//   }
// };

// export const setNotificationViewed = async (
//   userInfo: ExtendedUserType,
//   notification_id: string
// ) => {
//   try {
//     await _updateDocument(COLLECTION_USER_ID, userInfo.id, {
//       viewed_notification_ids: [
//         ...userInfo.viewed_notification_ids,
//         notification_id,
//       ],
//     });
//   } catch (error) {
//     console.error(
//       `notificationServices.ts => setNotificationViewed :: ERROR : ${error}`
//     );
//   }
// };

// export const deleteNotification = async (
//   userInfo: ExtendedUserType,
//   notifications: NotificationType[]
// ) => {
//   const notification_ids: string[] = notifications.map(
//     (notification) => notification.id
//   );

//   try {
//     await _updateDocument(COLLECTION_USER_ID, userInfo.id, {
//       viewed_notification_ids: userInfo.viewed_notification_ids.filter(
//         (id) => !notification_ids.includes(id)
//       ),
//     });

//     const user_notifications = await getNotifications(userInfo.id);
//     const userNotification_ids = user_notifications.map(
//       (notification) => notification.id
//     );

//     await _updateDocument(COLLECTION_USER_NOTIFICATION_ID, userInfo.id, {
//       notifications: userNotification_ids.filter(
//         (notif) => !notification_ids.includes(notif)
//       ),
//     });
//   } catch (error) {
//     console.error(
//       `notificationServices.ts => deleteNotification :: ERROR : ${error}`
//     );
//   }
// };
