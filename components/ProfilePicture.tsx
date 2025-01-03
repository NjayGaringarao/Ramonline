import { TouchableOpacity, View } from "react-native";
import { Image, ImageContentFit } from "expo-image";
import React from "react";
import { ExtendedUserType, UserType } from "@/constants/types";
import { getImagePreview } from "@/services/commonServices";

interface IProfilePictureType {
  userInfo: UserType | ExtendedUserType;
  onPress?: () => void;
  onLongPress?: () => void;
  containerStyle?: string;
  imageStyle?: string;
  imageContentFit?: ImageContentFit;
}

const ProfilePicture = ({
  userInfo,
  onPress,
  onLongPress,
  containerStyle,
  imageStyle,
  imageContentFit,
}: IProfilePictureType) => {
  if (onLongPress || onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        onLongPress={onLongPress}
        className={containerStyle}
      >
        <Image
          className={imageStyle}
          contentFit={imageContentFit}
          source={
            userInfo.picture_id
              ? getImagePreview(userInfo.picture_id)
              : userInfo.avatar_url
          }
          placeholder={userInfo.avatar_url}
        />
      </TouchableOpacity>
    );
  } else {
    return (
      <View className={containerStyle}>
        <Image
          className={imageStyle}
          contentFit={imageContentFit}
          source={
            userInfo.picture_id
              ? getImagePreview(userInfo.picture_id)
              : userInfo.avatar_url
          }
          placeholder={userInfo.avatar_url}
        />
      </View>
    );
  }
};

export default ProfilePicture;
