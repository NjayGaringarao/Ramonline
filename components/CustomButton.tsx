import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { Image } from "expo-image";

interface CustomButtonProps {
  title?: string;
  handlePress: () => void;
  containerStyles?: string;
  textStyles?: string;
  isLoading?: boolean;
  withBackground?: boolean;
  imageOnly?: string;
  imageStyles?: string;
  iconTint?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title = "",
  handlePress,
  containerStyles = "",
  textStyles = "text-white",
  isLoading = false,
  withBackground = true,
  imageOnly = null,
  imageStyles = null,
  iconTint,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`${
        withBackground ? "bg-primary dark:bg-secondary" : "bg-transparent"
      } rounded-lg px-4 min-h-24 justify-center items-center ${containerStyles} ${
        isLoading ? "opacity-50" : ""
      } `}
      disabled={isLoading}
    >
      <Image
        className={`${imageStyles} ${imageOnly ? "" : "hidden"}`}
        source={imageOnly}
        contentFit="contain"
        tintColor={iconTint}
      />
      <Text
        className={`text-darkText font-semibold text-lg self-center ${textStyles} ${
          imageOnly ? "hidden" : ""
        }`}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
