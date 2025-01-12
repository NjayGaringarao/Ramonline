import { TouchableOpacity, View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { UserType } from "@/types/models";
import { getImagePreview } from "@/services/commonServices";

interface IProfilePictureType {
  userInfo: UserType.Info;
  onPress?: () => void;
  onLongPress?: () => void;
  containerStyle?: string;
  imageStyle?: string;
}

const ProfilePicture = ({
  userInfo,
  onPress,
  onLongPress,
  containerStyle,
  imageStyle,
}: IProfilePictureType) => {
  const [imagePreview, setImagePreview] = useState<string>(userInfo.avatar_url);

  useEffect(() => {
    const initialize = async () => {
      if (userInfo.picture_id && userInfo.picture_id.length > 19) {
        setImagePreview(getImagePreview(userInfo.picture_id));
      } else {
        setImagePreview(userInfo.avatar_url);
      }
    };

    initialize();
  }, [userInfo]);

  console.log("User Info:", JSON.stringify(userInfo, null, 2));
  console.log("Image Preview:", imagePreview);

  if (onLongPress || onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        onLongPress={onLongPress}
        className={containerStyle}
      >
        <Image className={imageStyle} source={{ uri: imagePreview }} />
      </TouchableOpacity>
    );
  } else {
    return (
      <View className={containerStyle}>
        <Image className={imageStyle} source={{ uri: imagePreview }} />
      </View>
    );
  }
};

export default ProfilePicture;
