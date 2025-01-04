// import React, { useState } from "react";
// import { View, Text, TouchableOpacity, Modal } from "react-native";
// import { ExtendedUserType, NotificationType } from "@/constants/types";
// import AdaptiveTime from "../AdaptiveTime";
// import ModalNotification from "./ModalNotification";
// import { setNotificationViewed } from "@/services/notificationServices";

// interface NotificationItemProps {
//   notification: NotificationType;
//   isSelected: boolean;
//   isViewed: boolean;
//   userInfo: ExtendedUserType;
//   setIsRefreshUserInfo: (isRefreshing: boolean) => void;
//   onLongPress: () => void;
//   handleSelectNotification: (notification: NotificationType) => void;
//   isSelectionOn: boolean;
// }

// const NotificationItem: React.FC<NotificationItemProps> = ({
//   notification,
//   isSelected,
//   isViewed,
//   userInfo,
//   setIsRefreshUserInfo,
//   onLongPress,
//   handleSelectNotification,
//   isSelectionOn,
// }) => {
//   const [isModalNotificationVisible, setIsModalNotificationVisible] =
//     useState(false);

//   const onOpen = async () => {
//     setIsModalNotificationVisible(true);
//     if (!isViewed) {
//       await setNotificationViewed(userInfo, notification.id);
//       setIsRefreshUserInfo(true);
//     }
//   };

//   return (
//     <View className="h-auto w-fit m-1 rounded-md overflow-hidden">
//       <TouchableOpacity
//         onLongPress={onLongPress}
//         onPress={
//           isSelectionOn ? () => handleSelectNotification(notification) : onOpen
//         }
//         className={`px-2 py-2 flex flex-row items-center space-x-2 justify-between ${
//           isSelected ? "bg-primaryLight" : "bg-background"
//         } ${!isSelected && !isViewed && "bg-panel"}`}
//       >
//         <View className="flex-1">
//           <Text className="text-lg font-semibold text-gray-800">
//             {notification.title}
//           </Text>
//           <Text
//             className="text-sm font-light text-gray-800"
//             numberOfLines={1}
//             ellipsizeMode="tail"
//           >
//             {notification.description.replace(/\n/g, " ")}
//           </Text>
//         </View>
//         <View className="items-center justify-center">
//           <AdaptiveTime
//             isoDate={notification.created_at}
//             textStyles="text-sm text-gray-600"
//             isIntervalShort
//           />
//         </View>
//       </TouchableOpacity>
//       {isModalNotificationVisible && (
//         <ModalNotification
//           notification={notification}
//           isVisible={isModalNotificationVisible}
//           onClose={() => setIsModalNotificationVisible(false)}
//         />
//       )}
//     </View>
//   );
// };

// export default NotificationItem;
