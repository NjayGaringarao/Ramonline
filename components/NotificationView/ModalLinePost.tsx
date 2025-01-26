import { View, Text, Modal, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { LineType, NotificationType, PostType } from "@/types/models";
import { getPost } from "@/services/postServices";
import { getLine } from "@/services/lineServices";
import Loading from "../Loading";
import CustomButton from "../CustomButton";
import { colors, icons } from "@/constants";
import { formatDateToLocal } from "@/lib/commonUtil";
import ImageDisplay from "../PostView/ImageDisplay";
import CaptionView from "../PostView/CaptionView";
import { router } from "expo-router";

interface ModalLinePostType {
  notification: NotificationType.Info;
  isVisible: boolean;
  onClose: () => void;
}

const ModalLinePost = ({
  notification,
  isVisible,
  onClose,
}: ModalLinePostType) => {
  const [post, setpost] = useState<PostType.Info>();
  const [line, setLine] = useState<LineType.Info>();
  const [isLoading, setIsLoading] = useState(false);

  const queryData = async () => {
    setIsLoading(true);
    try {
      setpost(await getPost(notification.content[1]));
      setLine(await getLine(notification.origin[1]));
    } catch {}
    setIsLoading(false);
  };

  useEffect(() => {
    queryData();
  }, []);

  return (
    <Modal visible={isVisible} transparent animationType="none">
      <View className="flex-1 justify-center">
        <TouchableOpacity
          className="h-full w-full flex-1 absolute items-center bg-black opacity-80"
          onPress={onClose}
        />
        <View className="w-11/12 h-auto bg-background rounded-lg justify-center relative self-center px-2 pb-4 overflow-hidden">
          <View className="flex-row justify-between items-center w-full px-2 py-2">
            <View className="flex-1 overflow-hidden">
              <Text
                className="text-2xl font-semibold text-primary"
                numberOfLines={1}
              >
                {notification.title}
              </Text>
            </View>
            <CustomButton
              handlePress={onClose}
              containerStyles="-mr-2 bg-transparent"
            >
              <Image
                source={icons.close}
                tintColor={colors.uGray}
                className="h-5 w-5"
              />
            </CustomButton>
          </View>
          <View className="w-full bg-background shadow-lg shadow-primary items-center mb-2">
            {post ? (
              <View className={`w-full h-auto bg-background p-2 `}>
                <View className="rounded-t-lg overflow-hidden -mb-2 mx-2">
                  <ImageDisplay
                    imageIds={post.image_id}
                    onImagePress={() =>
                      router.push(`/(content)/post/image/${post.id}`)
                    }
                  />
                </View>

                <CaptionView post={post} isMiniPostView />
              </View>
            ) : isLoading ? (
              <Loading loadingPrompt="Loading" containerStyles="m-4" />
            ) : (
              <Text className="my-6 text-lg">
                The post seems to be deleted by the owner.
              </Text>
            )}
          </View>
          <View className="px-1 overflow-hidden">
            <Text className="text-base text-gray-900">
              {"Recieve from\t: "}
              <Text
                className="font-semibold"
                onPress={() => {
                  onClose();
                  router.push(`/(content)/line/${notification.origin[1]}`);
                }}
              >
                {line?.name}
              </Text>
            </Text>
            <Text className="text-base text-gray-900">
              {"Recieve time\t: "}
              <Text className="font-semibold">
                {formatDateToLocal(notification.created_at.toISOString())}
              </Text>
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalLinePost;
