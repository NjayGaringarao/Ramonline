import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import { colors } from "@/constants";

type LoadingType = {
  containerStyles?: string;
  loadingPrompt: string;
  color?: string;
};

const Loading = ({ containerStyles, loadingPrompt, color }: LoadingType) => {
  return (
    <View
      className={`flex-1 items-center justify-center bg-transparent flex-row space-x-2 ${containerStyles}`}
    >
      <Text
        className=" text-2xl font-semibold"
        style={{ color: color ? color : colors.primary }}
      >
        {loadingPrompt}
      </Text>
      <ActivityIndicator color={color ? color : colors.primary} size="large" />
    </View>
  );
};

export default Loading;
