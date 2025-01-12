import { colors, icons, images } from "@/constants";
import React, { useState } from "react";
import { TouchableOpacity, View, Text, Modal, Image } from "react-native";
import { LineType } from "@/types/models";
import { getImagePreview } from "@/services/commonServices";
import LineView from "./LineView";
import CustomButton from "../CustomButton";

type UserInterfaceType = {
  onPress?: () => void;
  text?: string;
};

type ILineCardProps = {
  userInterface?: UserInterfaceType;
  line?: LineType.Info;
  children?: React.ReactNode;
};

const LineCard = ({ userInterface, line, children }: ILineCardProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        onPress={line ? openModal : userInterface?.onPress}
        className="ml-2 h-64 w-48 rounded-lg overflow-hidden"
      >
        <View className="w-full">
          <View className="w-full h-48 justify-center items-center">
            <Image
              source={images.gate}
              className="absolute h-48 w-full opacity-40"
            />
            {children ? (
              children
            ) : (
              <Image
                source={{ uri: getImagePreview(line?.banner_id!) }}
                tintColor={line ? undefined : colors.background}
                className={` ${
                  line ? "h-full w-full opacity-100" : "h-36 w-full opacity-100"
                }`}
              />
            )}
          </View>
          <View className="h-16 bg-background items-center justify-center px-2">
            <Text className="text-primary text-xl font-semibold">
              {line ? line.name : userInterface?.text}
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
        {line ? (
          <View className=" flex-1 justify-center items-center">
            <View className="w-11/12 h-auto bg-background rounded-lg overflow-hidden">
              <LineView line={line} isInModal={true} />
              <CustomButton
                handlePress={() => {
                  setModalVisible(false);
                }}
                containerStyles="absolute right-0 top-8 bg-transparent"
              >
                <Image
                  source={icons.close}
                  className="h-5 w-5"
                  tintColor={colors.uGray}
                />
              </CustomButton>
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
