import { View, Text, TouchableOpacity, Alert, Image } from "react-native";
import React, { useState } from "react";
import { colors, icons, images } from "@/constants";
import CustomButton from "./CustomButton";
import {
  confirmAction,
  getDisplayName,
  getDisplayRole,
} from "@/lib/commonUtil";
import { router } from "expo-router";
import ProfilePicture from "./ProfilePicture";
import { deletePushTarget } from "@/services/notificationServices";
import { logoutUser } from "@/services/userServices";
import { useGlobalContext } from "@/context/GlobalProvider";
import "@/global.css";

interface ProfileViewProps {
  setActiveTab: (activeTab: string) => void;
}

const ProfileView = ({ setActiveTab }: ProfileViewProps) => {
  const [_activeTab, set_ActiveTab] = useState("post");
  const { user, resetGlobalState, userInfo, userLine, userPost } =
    useGlobalContext();

  const setTabHandler = (tab: string) => {
    setActiveTab(tab);
    set_ActiveTab(tab);
  };

  const logoutHandle = async () => {
    try {
      // setIsLoading(true);

      const isConfirmed = await confirmAction(
        "Confirm Logout",
        "Do you really want to Logout?"
      );

      if (!isConfirmed) throw Error;
      await deletePushTarget();
      const isLoggedOut = await logoutUser();
      if (isLoggedOut) {
        resetGlobalState();
        router.replace("/signIn");
      } else {
        Alert.alert(
          "Error",
          "Logout is Unsuccessful. Make sure you are connected to the internet and restart the app."
        );
      }
    } catch (error) {
    } finally {
      // setIsLoading(false);
    }
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
          Email
          <Text className="text-lg text-uBlack font-semibold">
            {`\t\t\t\t\t\t: ${user?.email}`}
          </Text>
        </Text>
        <Text className="text-base text-uGray font-semibold">
          {`Role\t\t\t\t\t\t\t: `}
          <Text className="text-lg text-uBlack font-semibold">
            {getDisplayRole(userInfo)}
          </Text>
        </Text>
      </View>

      <View className="flex-row w-full pb-2 justify-end gap-2 px-2">
        <View className="bg-panel rounded-xl overflow-hidden">
          <CustomButton
            title={`Settings`}
            textStyles="text-lg text-uGray"
            handlePress={() => {
              router.push("/settings");
            }}
            containerStyles="p-0 bg-transparent"
          >
            <Image
              source={icons.settings}
              tintColor={colors.primary}
              className="h-5 w-5 mr-1"
            />
          </CustomButton>
        </View>
        <View className="bg-panel rounded-xl overflow-hidden">
          <CustomButton
            title="Logout"
            textStyles="text-lg text-uGray"
            handlePress={logoutHandle}
            containerStyles="p-0 bg-transparent"
          >
            <Image
              source={icons.logout}
              className="h-5 w-5 mr-1"
              tintColor={colors.primary}
            />
          </CustomButton>
        </View>
      </View>

      <View className="flex-row justify-between px-2 pt-3 pb-2 w-full bg-panel border-primary border-t-4">
        <Text className="text-3xl font-semibold text-primary ">Content </Text>
        <View className="flex-row pb-2 gap-2">
          <View className="bg-background rounded-xl overflow-hidden">
            <CustomButton
              title={`Post`}
              textStyles="text-lg text-uGray"
              handlePress={() => {
                router.push("/create/post");
              }}
              containerStyles="p-0 bg-transparent"
            >
              <Image
                source={icons.add}
                tintColor={colors.primary}
                className="h-5 w-5 mr-1"
              />
            </CustomButton>
          </View>

          <View className="bg-background rounded-xl overflow-hidden">
            <CustomButton
              title={`Line`}
              textStyles="text-lg text-uGray"
              handlePress={() => {
                router.push("/create/line");
              }}
              containerStyles="p-0 bg-transparent"
            >
              <Image
                source={icons.add}
                tintColor={colors.primary}
                className="h-5 w-5 mr-1"
              />
            </CustomButton>
          </View>
        </View>
      </View>
      <View className="h-20 w-full flex-row">
        <TouchableOpacity
          className={`flex-1 items-center justify-center rounded-br-lg  ${
            _activeTab == "post" ? "" : "bg-panel "
          }`}
          onPress={() => {
            setTabHandler("post");
          }}
        >
          <Text className="text-3xl font-semibold text-gray-800">
            {userPost ? userPost.length! : "N/A"}
          </Text>
          <Text className="text-lg font-medium -mt-2">
            {userPost.length > 1 ? "Posts" : "Post"}
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
            {userLine.length}
          </Text>
          <Text className="text-lg font-medium -mt-2">
            {userLine.length > 1 ? "Lines" : "Line"}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="absolute top-14 items-center">
        <ProfilePicture
          userInfo={userInfo}
          containerStyle="h-32 w-32 rounded-3xl  overflow-hidden shadow-lg shadow-primary"
          imageStyle="flex-1 bg-primary"
          onPress={() => {
            router.push(`/(content)/user/image/${userInfo.id}`);
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

export default ProfileView;
