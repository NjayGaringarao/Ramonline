import { View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import WebView from "react-native-webview";
import CustomButton from "@/components/CustomButton";
import { router, useGlobalSearchParams } from "expo-router";
import { getImagePreview } from "@/services/commonServices";
import { PostType, UserType } from "@/types/models";
import { getPost } from "@/services/postServices";
import Toast from "react-native-root-toast";
import { icons } from "@/constants";
import UserBanner from "@/components/UserBanner";
import { getUserInfo } from "@/services/userServices";
import CaptionView from "@/components/PostView/CaptionView";
import AdaptiveTime from "@/components/AdaptiveTime";
import Loading from "@/components/Loading";

const getHTMLImageRender = (image_id: string[]) => {
  if (image_id.length == 1) {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh; /* Use full height of the viewport */
            background-color: black;
          }
          img {
            max-width: 100%; /* Ensure it doesn't exceed the width */
            max-height: 100%; /* Ensure it doesn't exceed the height */
            object-fit: contain; /* Maintain aspect ratio */
          }
        </style>
      </head>
      <body>
        <img src="${getImagePreview(image_id[0])}" alt="Full Screen Image" />
      </body>
    </html>
  `;
  } else {
    return `<!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            background-color: black;
          }
          img {
            width: 100%;
            height: auto;
          }
          p {
            font-size: 3rem;
            color: white;
            text-align: center;
            padding: 6rem 0; /* Equivalent to py-24 in Tailwind */
          }
          div {
            width: 100%;
            height: 10rem;
            background-color: black
          }
        </style>
      </head>
      <body>
        <div></div>
        ${image_id
          .map((item) => `<img src="${getImagePreview(item)}" alt="Image"/>`)
          .join("")}
 
      </body>
    </html>`;
  }
};

const postImage = () => {
  const searchParams = useGlobalSearchParams();
  const [post, setPost] = useState<PostType.Info>();
  const [owner, setOwner] = useState<UserType.Info>();

  const initialize = async (post_id: string) => {
    try {
      const _post = await getPost(post_id);
      setPost(_post);
      setOwner(await getUserInfo(_post.user_id!));
    } catch (error) {
      Toast.show("There was an error loading teh post");
    }
  };

  useEffect(() => {
    if (searchParams.post_id) {
      initialize(searchParams.post_id.toString());
    }
  }, [searchParams]);

  if (post && owner) {
    return (
      <View className="flex-1 bg-black">
        <WebView
          originWhitelist={["*"]}
          source={{
            html: getHTMLImageRender(post.image_id),
          }}
          style={{ flex: 1 }}
          scalesPageToFit={true}
          bounces={true}
          showsVerticalScrollIndicator={false}
        />

        <View className="absolute top-0 w-full h-16">
          <View className="flex-1 bg-black opacity-70" />
          <CustomButton
            handlePress={() => router.back()}
            containerStyles="absolute left-0 top-3 bg-transparent"
          >
            <Image source={icons.back} className="h-6 w-6" tintColor={"#fff"} />
          </CustomButton>
        </View>
        <View className="absolute bottom-0 w-full h-auto">
          <View className=" absolute h-full w-full bg-black opacity-70" />
          <View className="p-2">
            <View className="flex-1">
              <UserBanner
                userInfo={owner}
                nameStyle="text-white"
                roleStyle="text-white"
              />
              <AdaptiveTime
                isoDate={post.created_at.toISOString()}
                textStyles="self-end pr-4 text-uGray -mt-4"
                isFullDate
              />
            </View>
            <CaptionView
              post={post}
              isMiniPostView={true}
              textStyles="text-white"
            />
          </View>
        </View>
      </View>
    );
  } else {
    return (
      <View className="flex-1 bg-black">
        <Loading loadingPrompt="Please wait" color="#fff" />
      </View>
    );
  }
};

export default postImage;
