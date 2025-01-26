import React, { useState } from "react";
import Autolink from "react-native-autolink";
import { Text, View, ScrollView, Linking } from "react-native";
import { PostType } from "@/types/models";

type ICaptionProps = {
  post: PostType.Info;
  isMiniPostView?: boolean;
  textStyles?: string;
};

const CaptionView: React.FC<ICaptionProps> = ({
  post,
  isMiniPostView,
  textStyles,
}) => {
  const hasImages = post.image_id && post.image_id.length > 0;

  if (!post.caption) return null;

  const isLongCaption: boolean =
    post.caption.length > 150 || post.caption.split("\n").length - 1 > 4;
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Logic for displaying the caption
  if (!isLongCaption && !hasImages) {
    return (
      <View
        className={`px-4 py-12 bg-panel shadow-lg shadow-primary rounded-lg items-center justify-center `}
      >
        <Text
          className={`text-2xl text-center text-uBlack font-semibold ${textStyles}`}
        >
          <Autolink text={post.caption} />
        </Text>
      </View>
    );
  } else if (hasImages && !isMiniPostView) {
    return (
      <Text
        className={`p-2 text-base text-left font-normal bg-panel rounded-b-lg ${textStyles}`}
        numberOfLines={isExpanded ? undefined : 4}
        onPress={() => setIsExpanded((prev) => !prev)}
      >
        <Autolink text={post.caption} />
      </Text>
    );
  } else if (!isMiniPostView) {
    return (
      <Text
        className={`p-2 text-base text-left font-normal bg-panel rounded-lg ${textStyles}`}
        numberOfLines={isExpanded ? undefined : 4}
        lineBreakMode="middle"
        onPress={() => {
          setIsExpanded((prev) => !prev);
        }}
      >
        <Autolink text={post.caption} />
      </Text>
    );
  } else if (isMiniPostView) {
    return (
      <ScrollView
        showsVerticalScrollIndicator={true}
        className={`m-2 border-t-2 border-primary ${
          isExpanded ? "max-h-64" : "max-h-24"
        }`}
      >
        <Text
          className={`text-sm text-left font-normal ${textStyles}`}
          onPress={() => {
            setIsExpanded((prev) => !prev);
          }}
        >
          <Autolink text={post.caption} />
        </Text>
      </ScrollView>
    );
  }
};

export default CaptionView;
