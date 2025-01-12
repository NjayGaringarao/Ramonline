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

interface FormFieldProps extends TextInputProps {
  title?: string;
  value: string;
  isPassword?: boolean;
  placeholder: string;
  handleChangeText: (text: string) => void;
  containerStyles?: string;
  isNoBorder?: boolean;
  borderStyle?: string | null;
  isMultiline?: boolean; // New prop for multi-line capability
  maxLines?: number; // New optional prop for maximum lines
  maxLength?: number;
}

const FormField: React.FC<FormFieldProps> = ({
  title,
  value,
  isPassword,
  placeholder,
  handleChangeText,
  containerStyles = "",
  isNoBorder = false,
  borderStyle,
  isMultiline = false, // Default to false
  maxLines = 12, // Default to 12 if not specified
  maxLength,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  // Set maximum height for multiline input based on maxLines prop
  const maxHeight = isMultiline ? maxLines * 24 : 48; // Assuming 24 height per line

  return (
    <View className={`${containerStyles}`}>
      <Text
        className={`text-base text-primary font-medium ${
          title ? "" : "hidden"
        }`}
      >
        {title}
      </Text>
      <View
        className={`${isNoBorder ? "" : "border-2 border-primary"} ${
          borderStyle ? borderStyle : "border-black-200"
        } w-full ${
          isMultiline ? "min-h-24" : "h-12"
        } px-4 bg-black-200 rounded-lg focus:border-secondary items-center flex-row`}
      >
        <TextInput
          className="flex-1 text-black font-psemibold text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7b7b8b"
          onChangeText={handleChangeText}
          secureTextEntry={
            (title === "Password" || title === "Confirm Password") &&
            !showPassword
          }
          multiline={isMultiline} // Set multiline based on the prop
          numberOfLines={isMultiline ? maxLines : 1} // Use maxLines for multiline input
          style={{
            maxHeight, // Apply maximum height
            textAlignVertical: isMultiline ? "top" : "center", // Align text to the top for multiline
          }}
          {...props}
          maxLength={maxLength}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
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
