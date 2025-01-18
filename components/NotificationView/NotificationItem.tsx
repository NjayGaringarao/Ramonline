import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { UserType, NotificationType } from "@/types/models";
import AdaptiveTime from "../AdaptiveTime";
import ModalLinePost from "./ModalLinePost";
import { setNotificationViewed } from "@/services/notificationServices";
import { RefreshUserRecordType } from "@/types/utils";

interface NotificationItemProps {
  notification: NotificationType.Info;
  isSelected: boolean;
  refreshUserRecord: (update: RefreshUserRecordType) => void;
  onLongPress: () => void;
  handleSelectNotification: (notification: NotificationType.Info) => void;
  isSelectionOn: boolean;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  isSelected,
  refreshUserRecord,
  onLongPress,
  handleSelectNotification,
  isSelectionOn,
}) => {
  const [isModalNotificationVisible, setIsModalNotificationVisible] =
    useState(false);

  const onOpen = async () => {
    setIsModalNotificationVisible(true);
    if (!notification.isViewed) {
      await setNotificationViewed(notification.id);
      refreshUserRecord({ notification: true });
    }
  };

  return (
    <View className="h-auto w-fit m-1 rounded-md overflow-hidden">
      <TouchableOpacity
        onLongPress={onLongPress}
        onPress={
          isSelectionOn ? () => handleSelectNotification(notification) : onOpen
        }
        className={`px-2 py-2 flex flex-row items-center space-x-2 justify-between ${
          isSelected ? "bg-primaryLight" : "bg-background"
        } ${!isSelected && !notification.isViewed && "bg-panel"}`}
      >
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-800">
            {notification.title}
          </Text>
          <Text
            className="text-sm font-light text-gray-800"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {notification.description?.replace(/\n/g, " ")}
          </Text>
        </View>
        <View className="items-center justify-center">
          <AdaptiveTime
            isoDate={notification.created_at.toISOString()}
            textStyles="text-sm text-gray-600"
            isIntervalShort
          />
        </View>
      </TouchableOpacity>
      {isModalNotificationVisible && (
        <ModalLinePost
          notification={notification}
          isVisible={isModalNotificationVisible}
          onClose={() => setIsModalNotificationVisible(false)}
        />
      )}
    </View>
  );
};

export default NotificationItem;
