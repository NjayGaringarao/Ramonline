import { colors, icons, images } from "@/constants";
import React, { useState } from "react";
import { TouchableOpacity, View, Text, Modal, Pressable } from "react-native";
import { Image } from "expo-image";
import { LineType, UserType } from "@/types/models";
import { getImagePreview } from "@/services/commonServices";
import LineView from "./LineView";
import CustomButton from "../CustomButton";

type UserInterfaceType = {
  onPress?: () => void;
  text?: string;
};

type ILineCardProps = {
  userInterface?: UserInterfaceType;
  lineInfo?: LineType.Info;
  userInfo: UserType.Info;

  children?: React.ReactNode;
};

const LineCard = ({
  userInterface,
  lineInfo,
  userInfo,
  children,
}: ILineCardProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const renderImage = (image_id: string) => {
    try {
      return getImagePreview(image_id);
    } catch (error) {
      console.log(`ERROR (PostView.tsx => renderImage) :: ${error}`);
      return "";
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={lineInfo ? openModal : userInterface?.onPress}
        className="ml-2 h-64 w-48 rounded-lg overflow-hidden"
      >
        <View className="w-full">
          <View className="w-full h-48 justify-center items-center">
            <Image
              source={images.gate}
              contentFit="cover"
              className="absolute h-48 w-full opacity-40"
            />
            {children ? (
              children
            ) : (
              <Image
                source={lineInfo && renderImage(lineInfo.banner_id)}
                contentFit="contain"
                tintColor={lineInfo ? undefined : colors.background}
                className={` ${
                  lineInfo
                    ? "h-full w-full opacity-100"
                    : "h-36 w-full opacity-100"
                }`}
              />
            )}
          </View>
          <View className="h-16 bg-background items-center justify-center px-2">
            <Text className="text-primary text-xl font-semibold">
              {lineInfo ? lineInfo.name : userInterface?.text}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Modal for lineView */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <TouchableOpacity
          className="absolute h-full w-full bg-black opacity-50"
          onPress={() => {
            setModalVisible(false);
          }}
        />
        {lineInfo ? (
          <View className=" flex-1 justify-center items-center">
            <View className="w-11/12 h-auto bg-background rounded-lg overflow-hidden">
              <LineView
                lineInfo={lineInfo}
                userInfo={userInfo}
                isInModal={true}
              />
              <CustomButton
                handlePress={() => {
                  setModalVisible(false);
                }}
                imageOnly={icons.close}
                imageStyles="h-5 w-5"
                iconTint={colors.uGray}
                withBackground={false}
                containerStyles="absolute right-0 top-8"
              />
            </View>
          </View>
        ) : (
          <View className=" flex-1 justify-center items-center">
            <View className="w-11/12 h-96 bg-background rounded-lg" />
          </View>
        )}
      </Modal>
    </>
  );
};

export default LineCard;
