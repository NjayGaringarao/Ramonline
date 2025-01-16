import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import CustomButton from "../CustomButton";
import { LineType } from "@/types/models";
import { images } from "@/constants";
import { getImagePreview } from "@/services/commonServices";
import TextBox from "../TextBox";
import { useGlobalContext } from "@/context/GlobalContext";

type ModalSendNotificationProps = {
  visible: boolean;
  selectedLines: LineType.Info[];
  handleSelectLine: (line: LineType.Info) => void;
  onClose: () => void;
  onDone: () => void;
  notificationTitle: string;
  setNotificationTitle: (notificationTitle: string) => void;
};

const ModalSendNotification = ({
  visible,
  handleSelectLine,
  onClose,
  onDone,
  selectedLines,
  notificationTitle,
  setNotificationTitle,
}: ModalSendNotificationProps) => {
  const { userLine } = useGlobalContext();
  return (
    <Modal visible={visible} transparent animationType="none">
      <View className="flex-1 justify-center">
        <TouchableOpacity
          className="h-full w-full flex-1 absolute items-center bg-black opacity-80"
          onPress={onClose}
        />
        <View className="w-11/12 h-auto bg-background rounded-lg py-4 px-2 justify-center relative self-center">
          <Text className="font-semibold text-2xl text-primary ml-2 mb-2">
            Select Line/s to Notify
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
          <TextBox
            title="Title"
            titleTextStyles="text-primary text-xl font-semibold"
            textValue={notificationTitle}
            placeholder="Title will default to Line Name if unset"
            maxLength={50}
            textInputStyles="text-base"
            handleChangeText={setNotificationTitle}
            boxStyles="w-full py-1 border border-primary rounded-lg px-4"
            containerStyles="pb-1 shadow-primary shadow-2xl"
          />
          <View className="pt-2 flex-row w-full justify-end">
            <Text className="text-base self-center">
              Line Selected : {selectedLines.length}
            </Text>
            <View className="flex-row flex-1 justify-end">
              <CustomButton
                title="Cancel"
                handlePress={onClose}
                containerStyles="border border-primary h-10 w-24 bg-transparent"
                textStyles="text-primary"
              />
              <CustomButton
                title="Send"
                handlePress={onDone}
                isLoading={selectedLines.length == 0}
                containerStyles="w-24"
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalSendNotification;
