import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { images } from "@/constants";
import { UserType } from "@/types/models";
import { getDisplayName, getDisplayRole } from "@/lib/commonUtil";
import ProfilePicture from "./ProfilePicture";
import { router } from "expo-router";

interface IUserInfoViewType {
  userInfo: UserType.Info;
  setActiveTab: (activeTab: string) => void;
  userPostLength: number;
  userLineLength: number;
}

const UserInfoView = ({
  userInfo,
  setActiveTab,
  userLineLength,
  userPostLength,
}: IUserInfoViewType) => {
  const [_activeTab, set_ActiveTab] = useState("post");

  const setTabHandler = (tab: string) => {
    setActiveTab(tab);
    set_ActiveTab(tab);
  };

  return (
    <View className="h-auto w-full items-center bg-background mb-4">
      <View className="h-40 w-full bg-primary overflow-hidden">
        <Image
          source={images.building}
          resizeMode="cover"
          className="w-full h-56 opacity-50"
        />
      </View>

      <View className="w-auto h-auto mt-24 mb-4 gap-2">
        <Text className="text-base text-uGray font-semibold">
          Username
          <Text className="text-lg text-uBlack font-semibold">
            {`\t\t: ${userInfo.username}`}
          </Text>
        </Text>
        <Text className="text-base text-uGray font-semibold">
          {`Role\t\t\t\t\t\t\t: `}
          <Text className="text-lg text-uBlack font-semibold">
            {getDisplayRole(userInfo)}
          </Text>
        </Text>
      </View>

      <View className=" w-full border-primary border-t-4 ">
        <View className="bg-panel">
          <Text className="text-3xl font-semibold text-primary py-3 px-2">
            Content{" "}
          </Text>
        </View>
        <View className="flex-row w-full h-20">
          <TouchableOpacity
            className={`flex-1 items-center justify-center rounded-br-lg  ${
              _activeTab == "post" ? "" : "bg-panel "
            }`}
            onPress={() => {
              setTabHandler("post");
            }}
          >
            <Text className="text-3xl font-semibold text-gray-800">
              {userPostLength}
            </Text>
            <Text className="text-lg font-medium -mt-2">
              {userPostLength > 1 ? "Posts" : "Post"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 items-center justify-center rounded-bl-lg ${
              _activeTab == "line" ? "" : "bg-panel "
            }`}
            onPress={() => {
              setTabHandler("line");
            }}
          >
            <Text className="text-3xl font-semibold text-gray-800">
              {userLineLength}
            </Text>
            <Text className="text-lg font-medium -mt-2">
              {userLineLength > 1 ? "Lines" : "Line"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="absolute top-14 items-center">
        <ProfilePicture
          userInfo={userInfo}
          containerStyle="h-32 w-32 rounded-3xl  overflow-hidden shadow-lg shadow-primary"
          imageStyle="flex-1 bg-primary"
          onPress={() => {
            router.push(`/(content)/user/${userInfo.id}`);
          }}
        />
        <Text className="mt-2 text-primary text-3xl font-semibold">
          {getDisplayName(userInfo) == userInfo.username
            ? userInfo.username
            : getDisplayName(userInfo)}
        </Text>
      </View>
    </View>
  );
};

export default UserInfoView;
