import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import CustomButton from "../CustomButton";
import ParagraphBox from "../ParagraphBox";

type ModalEditDescriptionProps = {
  visible: boolean;
  onSave: () => void;
  onClose: () => void;
  setDescriptionForm: (descriptionForm: string) => void;
  descriptionForm: string;
  line_name: string;
};

const ModalEditDescription = ({
  visible,
  setDescriptionForm,
  descriptionForm,
  onSave,
  onClose,
  line_name,
}: ModalEditDescriptionProps) => {
  return (
    <Modal visible={visible} transparent animationType="none">
      <View className="flex-1 justify-center">
        <TouchableOpacity
          className="h-full w-full flex-1 absolute items-center bg-black opacity-80"
          onPress={onClose}
        />
        <View className="w-11/12 h-auto bg-panel rounded-lg p-4 justify-center relative self-center space-y-4">
          <Text
            className="font-semibold text-2xl text-primary pb-4"
            numberOfLines={1}
          >
            {line_name}
          </Text>
          <View className="items-end space-y-4">
            <ParagraphBox
              value={descriptionForm}
              placeholder={""}
              handleChangeText={(text) => setDescriptionForm(text)}
              containerStyles="bg-background"
            />
            <View className="flex-row mt-4">
              <CustomButton
                title="Save"
                handlePress={onSave}
                containerStyles="w-24"
              />
              <CustomButton
                title="Cancel"
                handlePress={onClose}
                containerStyles="w-24 border border-primary mx-2 h-10 bg-transparent"
                textStyles="text-primary"
              ></CustomButton>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalEditDescription;
