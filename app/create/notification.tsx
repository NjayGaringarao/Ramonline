import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useGlobalContext } from "@/context/GlobalProvider";
import { LineType, PostType } from "@/types/models";
import { confirmAction } from "@/lib/commonUtil";
import { notifyLine } from "@/services/lineServices";
import { icons, images } from "@/constants";
import { getImagePreview } from "@/services/commonServices";
import Toast from "react-native-root-toast";
import TextBox from "@/components/TextBox";
import CustomButton from "@/components/CustomButton";
import MiniPostView from "@/components/PostView/MiniPostView";
import { getPost } from "@/services/postServices";
import Loading from "@/components/Loading";

const notification = () => {
  const { messageType, contentId } = useLocalSearchParams();
  const { userLine } = useGlobalContext();
  const [selectedLines, setSelectedLines] = useState<LineType.Info[]>([]);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [post, setPost] = useState<PostType.Info>();
  const handleSelectLine = (line: LineType.Info) => {
    setSelectedLines((prev) =>
      prev.find((selectedLine) => selectedLine.id === line.id)
        ? prev.filter((selectedLine) => selectedLine.id !== line.id)
        : [...prev, line]
    );
  };

  const sendNotifPostHandle = async () => {
    if (
      !(
        (await confirmAction(
          "Send Notification",
          "Are you sure you want to send this post as notification? This action will take effect immediately and cannot be undone."
        )) && selectedLines.length > 0
      )
    )
      return;

    for (let i = 0; selectedLines.length > i; i++) {
      const result = await notifyLine(
        notificationTitle,
        selectedLines[i].id,
        contentId.toString()
      );

      if (result?.responseStatusCode == 200) {
        Toast.show(`Notification sent on ${selectedLines[i].name} line`, {
          duration: Toast.durations.LONG,
        });
      } else {
        Toast.show(
          `Failed to send notification on ${selectedLines[i].name} line`,
          { duration: Toast.durations.LONG }
        );
      }
    }

    setSelectedLines([]);
    router.back();
  };

  useEffect(() => {
    const initialize = async () => {
      if (!contentId) return;
      if (messageType.toString() == "post") {
        setPost(await getPost(contentId.toString()));
      }
    };

    initialize();
  }, [contentId]);

  return (
    <View className="flex-1 bg-background">
      <View className="h-14 w-full flex-row items-center bg-primary">
        <CustomButton
          handlePress={() => {
            router.back();
          }}
          containerStyles="bg-transparent"
        >
          <Image source={icons.back} className="h-6 w-6" tintColor={"#fff"} />
        </CustomButton>
        <Text className="text-gray-200 text-2xl font-bold">
          Send Notification
        </Text>
      </View>
      <View className="flex-1 justify-center py-4 px-2 gap-2">
        <Text className="font-semibold text-2xl text-uBlack ml-2 mb-2">
          Message
        </Text>
        <TextBox
          textValue={notificationTitle}
          placeholder="Title (Default to Line name if unset)"
          maxLength={50}
          textInputStyles="text-base"
          handleChangeText={setNotificationTitle}
          boxStyles="w-full py-1 border border-primary rounded-lg px-4"
          containerStyles="pb-1 shadow-primary shadow-2xl"
        />
        {messageType.toString() === "post" && contentId && post ? (
          <MiniPostView post={post} />
        ) : (
          <Loading loadingPrompt={"Loading Post"} />
        )}
        <Text className="font-semibold text-2xl text-uBlack ml-2 mb-2">
          Send to
        </Text>
        <FlatList
          data={userLine}
          className="h-max-64 w-full mb-2"
          keyExtractor={(line, index) => index.toString()}
          renderItem={({ item }) => {
            const isSelected = selectedLines.some(
              (selectedLine) => selectedLine.id === item.id
            );

            return (
              <View className="h-auto w-fit m-1 rounded-md overflow-hidden">
                <TouchableOpacity
                  onPress={() => handleSelectLine(item)}
                  className={`py-1 flex-1 flex-row items-center gap-2 ${
                    isSelected ? "bg-panel" : "bg-background"
                  }`}
                >
                  <View className="bg-primary rounded-lg overflow-hidden">
                    <Image
                      source={images.gate}
                      resizeMode="cover"
                      className="absolute left-0 h-16 w-20 opacity-50"
                    />
                    <Image
                      source={{ uri: getImagePreview(item.banner_id) }}
                      className="h-16 w-20"
                      resizeMode="cover"
                    />
                  </View>
                  <View className="flex-1 mr-2">
                    <Text className="text-lg font-semibold text-gray-800">
                      {item.name}
                    </Text>
                    <Text
                      className="text-sm font-light text-gray-800"
                      numberOfLines={1}
                    >
                      {item.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            );
          }}
          ListEmptyComponent={
            <Text className="text-primary text-xl font-semibold justify-center m-4">
              You do not own any lines. You may create one.
            </Text>
          }
        />
      </View>

      <View className="flex-row w-full justify-end items-center px-2 py-2 bg-panel">
        <Text className="text-base self-center">
          Line Selected : {selectedLines.length}
        </Text>
        <View className="flex-row flex-1 justify-end gap-2">
          <CustomButton
            title="Send"
            handlePress={sendNotifPostHandle}
            isLoading={selectedLines.length == 0}
            containerStyles="w-24 h-10"
          />
          <CustomButton
            title="Cancel"
            handlePress={() => router.back()}
            containerStyles="border border-primary h-10 w-24 bg-transparent"
            textStyles="text-primary"
          />
        </View>
      </View>
    </View>
  );
};

export default notification;
