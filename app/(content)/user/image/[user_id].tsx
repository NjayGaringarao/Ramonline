import { View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import CustomButton from "@/components/CustomButton";
import { icons } from "@/constants";
import { router, useGlobalSearchParams } from "expo-router";
import { getImagePreview } from "@/services/commonServices";
import { getUserInfo } from "@/services/userServices";
import Toast from "react-native-root-toast";
import { UserType } from "@/types/models";
import WebView from "react-native-webview";
import UserBanner from "@/components/UserBanner";

const getHTMLImageRender = (user: UserType.Info) => {
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
        <img src="${
          user.picture_id ? getImagePreview(user.picture_id) : user.avatar_url
        }" alt="Full Screen Image" />
      </body>
    </html>
  `;
};

const userImage = () => {
  const searchParams = useGlobalSearchParams();
  const [userInfo, setUserInfo] = useState<UserType.Info>();
  const initialize = async (user_id: string) => {
    try {
      setUserInfo(await getUserInfo(user_id));
    } catch (error) {
      Toast.show("There was an error loading profile picture.");
    }
  };

  useEffect(() => {
    if (searchParams.user_id) {
      initialize(searchParams.user_id.toString());
    }
  }, [searchParams]);
  if (userInfo)
    return (
      <View className="flex-1">
        <View className="absolute top-0 w-full h-16">
          <View className="flex-1 bg-black opacity-70" />
          <CustomButton
            handlePress={() => router.back()}
            containerStyles="absolute left-0 top-3 bg-transparent"
          >
            <Image source={icons.back} className="h-6 w-6" tintColor={"#fff"} />
          </CustomButton>
        </View>
        <WebView
          originWhitelist={["*"]}
          source={{
            html: getHTMLImageRender(userInfo),
          }}
          style={{ flex: 1 }}
          scalesPageToFit={true}
          bounces={true}
          showsVerticalScrollIndicator={false}
        />
        <View className="absolute bottom-0 w-full h-auto">
          <View className=" absolute h-full w-full bg-black opacity-70" />
          <View className="p-2">
            <View className="flex-1">
              <UserBanner
                userInfo={userInfo}
                nameStyle="text-white"
                roleStyle="text-white"
              />
            </View>
          </View>
        </View>
      </View>
    );
};

export default userImage;
