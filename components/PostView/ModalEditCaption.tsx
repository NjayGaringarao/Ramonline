import React, { useEffect, useState } from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import CustomButton from "../CustomButton";
import FormField from "../FormField";

type ModalEditCaptionProps = {
  visible: boolean;
  initialCaption: string;
  onSave: () => void;
  onClose: () => void;
  setCaptionForm: (captionForm: string) => void;
  captionForm: string;
};

const ModalEditCaption = ({
  visible,
  setCaptionForm,
  captionForm,
  onSave,
  onClose,
}: ModalEditCaptionProps) => {
  return (
    <Modal visible={visible} transparent animationType="none">
      <View className="flex-1 justify-center">
        <TouchableOpacity
          className="h-full w-full flex-1 absolute items-center bg-black opacity-80"
          onPress={onClose}
        />
        <View className="w-11/12 h-auto bg-background rounded-lg p-4 justify-center relative self-center space-y-4">
          <Text className="font-semibold text-2xl text-primary">
            Edit Caption
          </Text>
          <View className="items-end space-y-4">
            <FormField
              value={captionForm}
              placeholder={""}
              handleChangeText={(text) => setCaptionForm(text)}
              isMultiline={true}
            />
            <View className="flex-row">
              <CustomButton
                title="Cancel"
                handlePress={onClose}
                withBackground={false}
                containerStyles="border-2 border-primary mx-2 h-10"
                textStyles="text-primary"
              />
              <CustomButton title="Save" handlePress={onSave} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalEditCaption;
