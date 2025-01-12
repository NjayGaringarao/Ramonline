import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image } from "react-native";
import { getImagePreview } from "@/services/commonServices";
import { PostType, UserType } from "@/types/models";
import CaptionView from "./CaptionView";
import { getDisplayName, getDisplayRole } from "@/lib/commonUtil";
import ProfilePicture from "../ProfilePicture";
import AdaptiveTime from "../AdaptiveTime";
import { getUserInfo } from "@/services/userServices";
import { useGlobalContext } from "@/context/GlobalProvider";

type MiniPostViewProps = {
  post: PostType.Info;
};

const MiniPostView = ({ post }: MiniPostViewProps) => {
  const [owner, setOwner] = useState<UserType.Info>(Object);
  const { userRecord } = useGlobalContext();
  const renderImage = (imageId: string) => {
    try {
      return getImagePreview(imageId);
    } catch (error) {
      console.log(`ERROR (MiniaturePostView => renderImage) :: ${error}`);
      return "";
    }
  };

  useEffect(() => {
    if (post.user_id == userRecord.info.id) {
      setOwner(userRecord.info);
    } else {
      getUserInfo(post.user_id).then((result) => setOwner(result));
    }
  }, [post]);

  return (
    <View className="w-full h-auto px-2 mb-4 bg-background items-center justify-center rounded-md shadow-md shadow-primary">
      <View className="w-full h-auto justify-center ">
        <View className="flex-row space-x-2 h-auto items-center mx-2 mt-2">
          <ProfilePicture userInfo={owner} imageStyle="h-8 w-8 rounded-lg" />

          <View className="justify-center">
            <Text className="text-base font-semibold">
              {getDisplayName(owner)}
            </Text>
            <Text className="text-xs font-mono -mt-1">
              {getDisplayRole(owner)}
            </Text>
          </View>
        </View>

        {/* Miniature Caption */}
        <CaptionView post={post} isMiniPostView={true} />
      </View>

      {/* Images for Miniature */}
      <View className="overflow-hidden h-auto m-2 bg-panel w-full rounded-md">
        <FlatList
          data={post.image_id}
          keyExtractor={(item) => item.toString()}
          horizontal={true}
          showsHorizontalScrollIndicator={true}
          renderItem={({ item }) => (
            <Image
              source={{ uri: renderImage(item) }}
              className="w-36 h-36"
              resizeMode="cover"
            />
          )}
          ListFooterComponent={
            <View
              className={`${
                post.image_id?.length == 0 ? "h-16" : "h-36"
              } w-36 items-center justify-around`}
            >
              <Text className="text-sm text-primary">
                {post.image_id?.length == 0
                  ? "No Image to Show"
                  : "Nothing\nFollows"}
              </Text>
            </View>
          }
        />
      </View>
      <View className="w-full py-1 items-end">
        <AdaptiveTime
          isoDate={post.created_at.toISOString()}
          isFullDate
          textStyles="text-gray-600"
        />
      </View>
    </View>
  );
};

export default MiniPostView;
