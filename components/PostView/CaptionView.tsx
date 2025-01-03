import React, { useState } from "react";
import Hyperlink from "react-native-hyperlink";
import {
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Linking,
} from "react-native";
import { PostType } from "@/constants/types";

type ICaptionProps = {
  post: PostType;
  isMiniPostView?: boolean;
};

const CaptionView: React.FC<ICaptionProps> = ({ post, isMiniPostView }) => {
  const hasImages = post.image_ids && post.image_ids.length > 0;

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
        <Hyperlink
          linkStyle={{ color: "#2980b9" }}
          onPress={(url, text) => Linking.openURL(url)}
        >
          <Text className={`text-2xl text-center text-uBlack font-semibold`}>
            {post.caption}
          </Text>
        </Hyperlink>
      </View>
    );
  } else if (hasImages && !isMiniPostView) {
    return (
      <Hyperlink
        linkStyle={{ color: "#2980b9" }}
        onPress={(url, text) => Linking.openURL(url)}
      >
        <Text
          className="p-2 text-base text-left font-normal bg-panel rounded-b-lg"
          numberOfLines={isExpanded ? undefined : 4}
          onPress={() => setIsExpanded((prev) => !prev)}
        >
          {post.caption}
        </Text>
      </Hyperlink>
    );
  } else if (!isMiniPostView) {
    return (
      <Hyperlink
        linkStyle={{ color: "#2980b9" }}
        onPress={(url, text) => Linking.openURL(url)}
      >
        <Text
          className="p-2 text-base text-left font-normal bg-panel rounded-lg"
          numberOfLines={isExpanded ? undefined : 4}
          lineBreakMode="middle"
          onPress={() => {
            setIsExpanded((prev) => !prev);
          }}
        >
          {post.caption}
        </Text>
      </Hyperlink>
    );
  } else if (isMiniPostView) {
    return (
      <ScrollView
        showsVerticalScrollIndicator={true}
        className="m-2 border-t-4 border-primary max-h-32"
      >
        <Hyperlink
          linkStyle={{ color: "#2980b9" }}
          onPress={(url, text) => Linking.openURL(url)}
        >
          <Text className="text-base text-left font-normal">
            {post.caption}
          </Text>
        </Hyperlink>
      </ScrollView>
    );
  }
};

export default CaptionView;
