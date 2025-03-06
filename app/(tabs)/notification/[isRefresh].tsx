import { View, Text, FlatList, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "@/context/GlobalProvider";
import { confirmAction, sortByDate } from "@/lib/commonUtil";
import NotificationItem from "@/components/NotificationView/NotificationItem";
import CustomButton from "@/components/CustomButton";
import { NotificationType } from "@/types/models";
import { deleteNotification } from "@/services/notificationServices";
import { colors, icons } from "@/constants";
import { useGlobalSearchParams } from "expo-router";

const Notification = () => {
  const searchParams = useGlobalSearchParams();
  const { refreshUserRecord, userNotification, isInternetConnection } =
    useGlobalContext();
  const [notificationList, setNotificationList] = useState<
    NotificationType.Info[]
  >([]);
  const [isSelectionOn, setIsSelectionOn] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<
    NotificationType.Info[]
  >([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleSelectNotification = (notification: NotificationType.Info) => {
    setSelectedNotification((prev) =>
      prev.find(
        (selectedNotification) => selectedNotification.id === notification.id
      )
        ? prev.filter(
            (selectedNotification) =>
              selectedNotification.id !== notification.id
          )
        : [...prev, notification]
    );
  };

  const deleteNotificationHandle = async () => {
    if (
      !(await confirmAction(
        "Delete Notification",
        "You may not be able to access its content again if deleted."
      ))
    )
      return;

    setIsRefreshing(true);

    try {
      await deleteNotification(selectedNotification);
      setSelectedNotification([]);
    } catch {
      console.log(
        `notification.tsx => deleteNotificationHandle :: ERROR Deleting`
      );
    } finally {
      setIsSelectionOn(false);
      onRefreshHandle();
    }
  };

  const setupHandle = () => {
    setNotificationList(sortByDate(userNotification));
    setIsRefreshing(false);
  };

  const onRefreshHandle = () => {
    if (!isInternetConnection) return;
    setIsRefreshing(true);
    refreshUserRecord({ notification: true });
  };

  useEffect(() => {
    setupHandle();
  }, [userNotification]);

  useEffect(() => {
    if (selectedNotification.length === 0) setIsSelectionOn(false);
  }, [selectedNotification]);

  useEffect(() => {
    if (!searchParams) return;
    if (searchParams.isRefresh == "true") {
      setIsRefreshing(true);
      refreshUserRecord({
        info: true,
        line: true,
        post: true,
        notification: true,
      });
    }
  }, [searchParams]);

  return (
    <View className="flex-1 bg-background mt-12">
      <View className="w-full flex-row justify-between items-center">
        <Text className="font-bold text-gray-900 text-2xl my-4 mx-2">
          Notification
        </Text>
        <CustomButton
          handlePress={onRefreshHandle}
          containerStyles="bg-transparent"
        >
          <Image
            source={icons.refresh}
            className="h-6 w-6"
            tintColor={colors.primary}
          />
        </CustomButton>
      </View>
      <FlatList
        data={notificationList}
        className="flex-1 mb-2"
        keyExtractor={(notification, index) => index.toString()}
        renderItem={({ item }) => {
          const isSelected = selectedNotification.some(
            (selectedNotification) => selectedNotification.id === item.id
          );

          return (
            <NotificationItem
              notification={item}
              isSelected={isSelected}
              refreshUserRecord={refreshUserRecord}
              onLongPress={() => {
                setIsSelectionOn(true);
                handleSelectNotification(item);
              }}
              handleSelectNotification={(e: NotificationType.Info) => {
                handleSelectNotification(e);
              }}
              isSelectionOn={isSelectionOn}
            />
          );
        }}
        ListEmptyComponent={
          <View className="flex-1 bg-panel mx-2 my-12 py-12 items-center rounded-lg overflow-hidden shadow-primary shadow-lg">
            <Text className="text-xl text-primary font-semibold text-center pb-2 ">
              ✅ YOU'RE ALL CAUGHT UP ✅
            </Text>
          </View>
        }
        onRefresh={onRefreshHandle}
        refreshing={isRefreshing}
      />
      {isSelectionOn && (
        <View className="h-auto py-2 flex-row w-full justify-between items-center px-2 bg-panel">
          <Text className="text-base self-center">
            Selected: {selectedNotification.length}
          </Text>
          <View className="flex-row w-fit place-self-end gap-2">
            <CustomButton
              title="Delete"
              handlePress={deleteNotificationHandle}
              containerStyles="w-24"
            />
            <CustomButton
              title="Cancel"
              handlePress={() => {
                setSelectedNotification([]);
                setIsSelectionOn(false);
              }}
              containerStyles="border border-primary h-10 w-24 bg-transparent"
              textStyles="text-primary"
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default Notification;
