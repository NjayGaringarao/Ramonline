import React from "react";
import { View, Text, Modal, TouchableOpacity, Image } from "react-native";
import CustomButton from "../CustomButton";
import MiniLineView from "./MiniLineView";
import { LineType, UserType } from "@/types/models";
import { colors, icons } from "@/constants";

type ModalOptionsProps = {
  isVisible: boolean;
  onClose: () => void;
  onEditDescription: () => void;
  onDelete: () => void;
  line: LineType.Info;
  owner: UserType.Info;
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
        <View className="flex-row items-center justify-between pb-4">
          <Text className="text-2xl text-gray-950 font-bold">Manage Line</Text>
          <CustomButton
            handlePress={onClose}
            containerStyles="-mr-4 bg-transparent"
          >
            <Image
              source={icons.close}
              tintColor={colors.uGray}
              className="h-5 w-5"
            />
          </CustomButton>
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
          containerStyles="h-10 border border-primary bg-transparent"
          textStyles="text-primary"
        />
      </View>
    </View>
  </Modal>
);

export default ModalOptions;
