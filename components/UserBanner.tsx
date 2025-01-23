import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { UserType } from "@/types/models";
import { getImagePreview } from "@/services/commonServices";
import { getDisplayName, getDisplayRole } from "@/lib/commonUtil";
import { router } from "expo-router";

interface IUserBannerType {
  userInfo: UserType.Info;
  containerStyle?: string;
  nameStyle?: string;
  roleStyle?: string;
}

const UserBanner = ({
  userInfo,
  containerStyle,
  nameStyle,
  roleStyle,
}: IUserBannerType) => {
  const [pictureURL, setPictureURL] = useState("");

  useEffect(() => {
    setPictureURL(
      userInfo.picture_id
        ? getImagePreview(userInfo.picture_id, 50, 128, 128)
        : userInfo.avatar_url
    );
  }, [userInfo]);

  const handlePress = () => {
    router.push(`/(content)/user/${userInfo.id}`);
  };

  if (pictureURL) {
    return (
      <TouchableOpacity
        className={`flex-row gap-2 ${containerStyle}`}
        onPress={handlePress}
      >
        <Image
          className="h-12 w-12 rounded-full"
          source={{ uri: pictureURL }}
        />
        <View className="justify-center">
          <Text className={`text-lg font-semibold ${nameStyle}`}>
            {getDisplayName(userInfo)}
          </Text>
          <Text className={`text-xs font-mono -mt-1 ${roleStyle}`}>
            {getDisplayRole(userInfo)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
};

export default UserBanner;
