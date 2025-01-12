import React from "react";
import { Modal, View, Text, TouchableOpacity, Image } from "react-native";
import CustomButton from "../CustomButton";
import MiniPostView from "./MiniPostView";
import { PostType } from "@/types/models";
import { colors, icons } from "@/constants";

type Props = {
  visible: boolean;
  onClose: () => void;
  post: PostType.Info;
  onEditPress: () => void;
  onNotifyPress: () => void;
  onDelete: () => void;
};

const ModalOptions = ({
  visible,
  onClose,
  post,
  onEditPress,
  onNotifyPress,
  onDelete,
}: Props) => (
  <Modal visible={visible} transparent animationType="slide">
    <TouchableOpacity
      className="absolute w-full h-full bg-black opacity-70"
      onPress={onClose}
    />

    <View className="absolute bottom-0 w-full justify-center bg-background p-4 rounded-t-lg overflow-hidden">
      <View className="mb-4 flex-row justify-between overflow-hidden">
        <Text className="text-2xl text-gray-950 font-semibold">
          Manage Post
        </Text>
        <CustomButton
          handlePress={onClose}
          containerStyles="-mr-4 bg-transparent"
        >
          <Image
            source={icons.close}
            className="h-5 w-5"
            tintColor={colors.uGray}
          />
        </CustomButton>
      </View>
      <MiniPostView post={post} />
      <View className="w-full h-auto">
        <CustomButton
          title="Notify Line"
          handlePress={onNotifyPress}
          containerStyles="h-10 w-full mb-1"
        />
        <CustomButton
          title="Edit Caption"
          handlePress={onEditPress}
          containerStyles="h-9 w-full border-2 border-primary mb-1 bg-transparent"
          textStyles="text-primary"
        />
        <CustomButton
          title="Delete Post"
          handlePress={onDelete}
          containerStyles="h-9 w-full border-2 border-primary bg-transparent"
          textStyles="text-primary"
        />
      </View>
    </View>
  </Modal>
);

export default ModalOptions;
