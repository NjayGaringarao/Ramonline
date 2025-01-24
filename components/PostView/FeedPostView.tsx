import { View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { PostType, UserType } from "@/types/models";
import { useGlobalContext } from "@/context/GlobalProvider";
import UserBanner from "../UserBanner";
import ImageDisplay from "./ImageDisplay";
import { router } from "expo-router";
import CaptionView from "./CaptionView";
import AdaptiveTime from "../AdaptiveTime";
import { getUserInfo } from "@/services/userServices";

type IFeedPostViewProps = {
  post: PostType.Info;
};

const FeedPostView = ({ post }: IFeedPostViewProps) => {
  const { userInfo } = useGlobalContext();
  const [owner, setOwner] = useState<UserType.Info>();

  useEffect(() => {
    const initializeUser = async () => {
      if (post.user_id === userInfo.id) {
        setOwner(userInfo);
      } else {
        try {
          setOwner(await getUserInfo(post.user_id));
        } catch (error) {}
      }
    };
    initializeUser();
  }, [post]);

  if (owner) {
    const HandleUserBanner = () => {
      if (userInfo.id === owner.id) {
        router.navigate("/(tabs)/profile");
      } else {
        router.push(`/(content)/user/${post.user_id}`);
      }
    };

    return (
      <View className={`w-full h-auto pb-10 bg-background p-2 `}>
        <View className="w-full h-auto my-2 flex-row justify-between">
          <UserBanner userInfo={owner} handlePress={HandleUserBanner} />
          <AdaptiveTime
            isoDate={post.created_at.toISOString()}
            textStyles="self-end pr-4 pt-2 text-gray-600"
          />
        </View>
        <View className="rounded-t-lg overflow-hidden">
          <ImageDisplay
            imageIds={post.image_id}
            onImagePress={() => router.push(`/(content)/post/image/${post.id}`)}
          />
        </View>

        <CaptionView post={post} />
      </View>
    );
  }
};

export default FeedPostView;
