import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import CustomButton from "../CustomButton";
import MiniLineView from "./MiniLineView";
import { LineType, UserType } from "@/constants/types";
import { colors, icons } from "@/constants";

type ModalOptionsProps = {
  isVisible: boolean;
  onClose: () => void;
  onEditDescription: () => void;
  onDelete: () => void;
  line: LineType;
  owner: UserType;
};

const ModalOptions = ({
  isVisible,
  onClose,
  onEditDescription,
  onDelete,
  line,
  owner,
}: ModalOptionsProps) => (
  <Modal visible={isVisible} transparent animationType="slide">
    <View className="flex-1 justify-center">
      <TouchableOpacity
        className="h-full w-full absolute bg-black opacity-80"
        onPress={onClose}
      />
      <View className="absolute bottom-0 w-full bg-background rounded-t-lg p-4 self-center space-y-1">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl text-gray-950 font-bold pb-4">
            Manage Line
          </Text>
          <CustomButton
            handlePress={onClose}
            imageOnly={icons.close}
            iconTint={colors.uGray}
            imageStyles="h-5 w-5"
            withBackground={false}
            containerStyles="-mr-4"
          />
        </View>
        <MiniLineView line={line} user={owner} />
        <CustomButton
          handlePress={onEditDescription}
          title="Edit Description"
          containerStyles="h-10 mb-1"
        />
        <CustomButton
          handlePress={onDelete}
          title="Delete Line"
          containerStyles="h-10 border-2 border-primary"
          withBackground={false}
          textStyles="text-primary"
        />
      </View>
    </View>
  </Modal>
);

export default ModalOptions;
