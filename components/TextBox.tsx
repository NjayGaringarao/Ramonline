import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TextInputProps,
  Image,
} from "react-native";
import React, { useState } from "react";
import { colors, icons } from "../constants";

interface TextBoxProps extends TextInputProps {
  title?: string;
  titleTextStyles?: string;
  textValue: string;
  textInputStyles?: string;
  handleChangeText: (text: string) => void;
  isPassword?: boolean;
  placeholderValue?: string;
  placeholderTextStyles?: string;
  containerStyles?: string;
  boxStyles?: string;
  isDisabled?: boolean;
}

const FormField: React.FC<TextBoxProps> = ({
  title,
  titleTextStyles,
  textValue,
  textInputStyles,
  handleChangeText,
  isPassword,
  placeholderValue,
  placeholderTextStyles,
  containerStyles = "",
  boxStyles = "",
  maxLength,
  isDisabled = false,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={containerStyles}>
      <Text className={`${titleTextStyles} ${title ? "" : "hidden"}`}>
        {title}
      </Text>
      <View className="w-full">
        <View className={`py-2 px-4 ${boxStyles} flex-row`}>
          <TextInput
            className={`flex-1 text-uBlack font-medium mr-10 ${textInputStyles}`}
            value={textValue}
            placeholder={placeholderValue}
            placeholderTextColor={colors.uGrayLight}
            onChangeText={handleChangeText}
            secureTextEntry={isPassword && !showPassword}
            style={{
              textAlignVertical: "center",
              letterSpacing: 1,
            }}
            {...props}
            maxLength={maxLength}
          />
        </View>
        {!!isDisabled && (
          <View className="absolute w-full h-full bg-panel opacity-50" />
        )}
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="absolute right-4 bottom-2"
          >
            <Image
              source={!showPassword ? icons.show : icons.hide}
              className="w-6 h-6"
              resizeMode="contain"
              tintColor={colors.primary}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
