import { colors, images } from "@/constants";
import React from "react";
import { TouchableOpacity, View, Text, Image } from "react-native";
import { LineType } from "@/types/models";
import { getImagePreview } from "@/services/commonServices";
import { router } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { FontAwesome } from "@expo/vector-icons";

type UserInterfaceType = {
  onPress?: () => void;
  text?: string;
};

type ILineCardProps = {
  userInterface?: UserInterfaceType;
  line: LineType.Info;
  children?: React.ReactNode;
  isSubscribe?: boolean;
};

const LineCard = ({
  userInterface,
  line,
  children,
  isSubscribe,
}: ILineCardProps) => {
  return (
    <View className="py-1 px-2 w-full">
      <TouchableOpacity
        onPress={() => router.push(`/(content)/line/${line.id}`)}
        className="rounded-lg overflow-hidden bg-panel"
      >
        <View className="flex-row gap-1">
          <Image
            source={images.gate}
            className="absolute w-14 h-14 opacity-40"
          />
          {children ? (
            children
          ) : (
            <Image
              source={{ uri: getImagePreview(line?.banner_id!, 10, 256, 256) }}
              tintColor={line ? undefined : colors.background}
              className={` ${
                line ? "h-14 w-14 opacity-100" : "h-14 w-14 opacity-100"
              }`}
            />
          )}
          <View className="justify-center flex-1 mr-2">
            <Text
              className="text-primary text-base font-semibold mt-1"
              numberOfLines={2}
              style={{ lineHeight: 16 }}
            >
              {line ? line.name : userInterface?.text}
            </Text>
            {isSubscribe && (
              <FontAwesome
                name="star"
                size={18}
                className="absolute bottom-1 -right-1"
                color={colors.primary}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default LineCard;
