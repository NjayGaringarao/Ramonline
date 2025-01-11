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
      className={`bg-primary rounded-lg overflow-hidden px-4 py-2 ${containerStyles}`}
    >
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        disabled={isLoading}
        className="flex-1 flex-row space-x-2 justify-center items-center"
      >
        {children}
        <Text
          className={`text-darkText font-semibold text-xl self-center ${textStyles} ${
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
