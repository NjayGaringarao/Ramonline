import React, { ReactNode } from "react";
import { TouchableOpacity, Text, View, Image } from "react-native";

interface CustomButtonProps {
  title?: string;
  handlePress: () => void;
  containerStyles?: string;
  textStyles?: string;
  isLoading?: boolean;
  children?: ReactNode;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title = "",
  handlePress,
  containerStyles,
  textStyles = "text-white",
  isLoading = false,
  children,
}) => {
  return (
    <View
      className={`h-10 bg-primary rounded-lg overflow-hidden px-4 ${containerStyles} ${
        isLoading ? "opacity-50" : "opacity-100"
      }`}
    >
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        disabled={isLoading}
        className="flex-1 flex-row space-x-2 justify-center items-center"
      >
        {children}
        <Text
          className={`text-center font-semibold text-lg ${textStyles} ${
            title ? "visible" : "hidden"
          }`}
        >
          {title}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CustomButton;
