import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import CustomButton from "../CustomButton";
import FormField from "../FormField";
import ParagraphBox from "../ParagraphBox";

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
        <View className="w-11/12 h-auto bg-panel rounded-lg p-4 justify-center relative self-center space-y-4">
          <View className="items-end space-y-4">
            <ParagraphBox
              value={captionForm}
              placeholder={""}
              handleChangeText={(text) => setCaptionForm(text)}
              containerStyles="bg-background"
            />
            <View className="flex-row mt-2">
              <CustomButton title="Save" handlePress={onSave} />
              <CustomButton
                title="Cancel"
                handlePress={onClose}
                containerStyles="border border-primary mx-2 h-10 bg-transparent"
                textStyles="text-primary"
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalEditCaption;
