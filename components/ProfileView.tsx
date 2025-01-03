import { View, Text, TouchableOpacity, Alert, Modal } from "react-native";
import React, { useState } from "react";
import { Image } from "expo-image";
import { colors, icons, images } from "@/constants";
import { ExtendedUserType } from "@/constants/types";
import CustomButton from "./CustomButton";
import {
  confirmAction,
  getDisplayName,
  getDisplayRole,
  getHTMLImageRender,
} from "@/lib/definedAlgo";
import { getImagePreview } from "@/services/commonServices";
import { router } from "expo-router";
import WebView from "react-native-webview";
import ProfilePicture from "./ProfilePicture";
import { deletePushTarget } from "@/services/notificationServices";
import { logoutCurrentUser } from "@/services/userServices";
import { useGlobalContext } from "@/context/GlobalProvider";

interface ProfileViewProps {
  extendedUserInfo: ExtendedUserType;
  setActiveTab: (activeTab: string) => void;
}

const ProfileView = ({ extendedUserInfo, setActiveTab }: ProfileViewProps) => {
  const [_activeTab, set_ActiveTab] = useState("post");
  const [isImagePreviewVisible, setIsImagePreviewVisible] = useState(false);
  const { setUser } = useGlobalContext();

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
      const isLoggedOut = await logoutCurrentUser();
      if (isLoggedOut) {
        // setting global state
        setUser(null);
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
    <View className="h-auto w-full items-center bg-background">
      <View className="h-40 w-full bg-primary overflow-hidden">
        <Image
          source={images.building}
          contentFit="cover"
          className="w-full h-56 opacity-50"
        />
      </View>
      <CustomButton
        handlePress={() => {
          router.push("/settings");
        }}
        containerStyles="absolute top-44 left-2 h-6 w-6 p-0"
        imageOnly={icons.settings}
        imageStyles="h-6 w-6"
        iconTint={colors.primary}
        withBackground={false}
      />
      <CustomButton
        handlePress={logoutHandle}
        containerStyles="absolute top-44 right-2 h-6 w-6"
        imageOnly={icons.logout}
        imageStyles="h-6 w-6"
        iconTint={colors.primary}
        withBackground={false}
      />

      <View className="w-auto h-auto mt-24 mb-4 space-y-2">
        <Text className="text-base text-gray-800">
          {"Name\t\t\t\t\t\t: "}
          <Text className="text-lg text-gray-800 font-medium">
            {getDisplayName(extendedUserInfo) === extendedUserInfo.username ? (
              <Text className="text-lg text-gray-800 font-medium italic">
                Unset
              </Text>
            ) : (
              getDisplayName(extendedUserInfo)
            )}
          </Text>
        </Text>

        <Text className="text-base text-gray-800">
          Username
          <Text className="text-lg text-gray-800 font-medium">
            {`\t\t: ${extendedUserInfo.username}`}
          </Text>
        </Text>
        <Text className="text-base text-gray-800">
          Email
          <Text className="text-lg text-gray-800 font-medium">
            {`\t\t\t\t\t\t: ${extendedUserInfo.email}`}
          </Text>
        </Text>
        <Text className="text-base text-gray-800">
          {`Role\t\t\t\t\t\t\t: `}
          <Text className="text-lg text-gray-800 font-medium">
            {getDisplayRole(extendedUserInfo)}
          </Text>
        </Text>
      </View>

      <Text className="text-3xl pt-3 pb-2 w-full font-semibold text-primary px-4 bg-panel border-primary border-t-4">
        Content
      </Text>
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
            {extendedUserInfo.posts ? extendedUserInfo.posts.length! : "N/A"}
          </Text>
          <Text className="text-lg font-medium -mt-2">
            {extendedUserInfo.posts
              ? extendedUserInfo.posts.length > 1
                ? "Posts"
                : "Post"
              : "N/A"}
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
            {extendedUserInfo.lines ? extendedUserInfo.lines.length! : "N/A"}
          </Text>
          <Text className="text-lg font-medium -mt-2">
            {extendedUserInfo.lines
              ? extendedUserInfo.lines.length > 1
                ? "Lines"
                : "Line"
              : "N/A"}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="absolute top-14 items-center">
        <ProfilePicture
          userInfo={extendedUserInfo}
          containerStyle="h-32 w-32 rounded-3xl  overflow-hidden shadow-lg shadow-primary"
          imageStyle="flex-1 bg-primary"
          imageContentFit="cover"
          onPress={() => {
            setIsImagePreviewVisible(true);
          }}
        />
        <Text className="mt-2 text-primary text-3xl font-semibold">
          {getDisplayName(extendedUserInfo) == extendedUserInfo.username
            ? extendedUserInfo.username
            : getDisplayName(extendedUserInfo)}
        </Text>
      </View>
      {/* Modal to show the image in full screen */}
      <Modal
        visible={isImagePreviewVisible}
        transparent={false}
        animationType="slide"
      >
        <TouchableOpacity
          className="flex-1 absolute items-center"
          onPress={() => setIsImagePreviewVisible(false)}
        />
        <View className="bg-black w-full h-full relative">
          <WebView
            originWhitelist={["*"]}
            source={{
              html: getHTMLImageRender(
                extendedUserInfo.picture_id
                  ? getImagePreview(extendedUserInfo.picture_id)
                  : extendedUserInfo.avatar_url!
              ),
            }}
            scalesPageToFit={true}
            bounces={true}
            showsVerticalScrollIndicator={false}
          />
          <View className="absolute top-0 w-full h-16 bg-black opacity-70" />
          <CustomButton
            handlePress={() => setIsImagePreviewVisible(false)}
            imageOnly={icons.back}
            imageStyles="h-6 w-6"
            iconTint="#fff"
            withBackground={false}
            containerStyles="absolute top-5 left-0"
          />
        </View>
      </Modal>
    </View>
  );
};

export default ProfileView;
