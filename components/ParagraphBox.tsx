import { View, TextInput, TextInputProps, ScrollView } from "react-native";
import React from "react";

interface IParagraphBoxType extends TextInputProps {
  value: string;
  placeholder: string;
  handleChangeText: (text: string) => void;
  containerStyles?: string;
  isNoBorder?: boolean;
  maxLength?: number;
}

const ParagraphBox: React.FC<IParagraphBoxType> = ({
  value,
  placeholder,
  handleChangeText,
  containerStyles = "",
  isNoBorder = false,
  maxLength,
  ...props
}) => {
  return (
    <View className={`${containerStyles}`}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 8, // Equivalent to px-2
          alignItems: "flex-start",
          flexDirection: "row",
        }}
        className="max-h-96"
      >
        <TextInput
          className="h-full w-full text-uBlack text-base py-4"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7b7b8b"
          onChangeText={handleChangeText}
          multiline={true}
          style={{
            textAlignVertical: "top",
            letterSpacing: 1,
          }}
          {...props}
          maxLength={maxLength}
        />
      </ScrollView>
    </View>
  );
};

export default ParagraphBox;
