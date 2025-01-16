import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Modal,
  Image,
} from "react-native";
import React, { useState } from "react";
import { colors, icons, images } from "@/constants";
import { UserType, LineType, PostType } from "@/types/models";
import CustomButton from "./CustomButton";
import {
  confirmAction,
  getDisplayName,
  getDisplayRole,
  getHTMLImageRender,
} from "@/lib/commonUtil";
import { getImagePreview } from "@/services/commonServices";
import { router } from "expo-router";
import WebView from "react-native-webview";
import ProfilePicture from "./ProfilePicture";
import { deletePushTarget } from "@/services/notificationServices";
import { logoutUser } from "@/services/userServices";
import { useGlobalContext } from "@/context/GlobalContext";
import "@/global.css";

interface ProfileViewProps {
  setActiveTab: (activeTab: string) => void;
}

const ProfileView = ({ setActiveTab }: ProfileViewProps) => {
  const [_activeTab, set_ActiveTab] = useState("post");
  const [isImagePreviewVisible, setIsImagePreviewVisible] = useState(false);
  const {
    user,
    setUser,
    setUserInfo,
    setUserLine,
    setUserActivity,
    setUserPost,
    setUserNotification,
    userInfo,
    userLine,
    userPost,
  } = useGlobalContext();

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
        setUser(null);
        setUserInfo(Object);
        setUserActivity(Object);
        setUserPost([]);
        setUserLine([]);
        setUserNotification([]);

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
      <CustomButton
        handlePress={() => {
          router.push("/settings");
        }}
        containerStyles="absolute top-44 left-2 h-6 w-6 p-0 bg-transparent"
      >
        <Image
          source={icons.settings}
          tintColor={colors.primary}
          className="h-6 w-6"
        />
      </CustomButton>
      <CustomButton
        handlePress={logoutHandle}
        containerStyles="absolute top-44 right-2 h-6 w-6 bg-transparent"
      >
        <Image
          source={icons.logout}
          className="h-6 w-6"
          tintColor={colors.primary}
        />
      </CustomButton>

      <View className="w-auto h-auto mt-24 mb-4 gap-2">
        <Text className="text-base text-uGray font-semibold">
          {"Name\t\t\t\t\t\t: "}
          <Text className="text-lg text-uBlack font-semibold">
            {getDisplayName(userInfo) === userInfo.username ? (
              <Text>unset</Text>
            ) : (
              getDisplayName(userInfo)
            )}
          </Text>
        </Text>

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
            setIsImagePreviewVisible(true);
          }}
        />
        <Text className="mt-2 text-primary text-3xl font-semibold">
          {getDisplayName(userInfo) == userInfo.username
            ? userInfo.username
            : getDisplayName(userInfo)}
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
                userInfo.picture_id
                  ? getImagePreview(userInfo.picture_id)
                  : userInfo.avatar_url!
              ),
            }}
            scalesPageToFit={true}
            bounces={true}
            showsVerticalScrollIndicator={false}
          />
          <View className="absolute top-0 w-full h-16 bg-black opacity-70" />
          <CustomButton
            handlePress={() => setIsImagePreviewVisible(false)}
            containerStyles="absolute top-5 left-0 bg-transparent"
          >
            <Image source={icons.back} tintColor={"#fff"} className="h-6 w-6" />
          </CustomButton>
        </View>
      </Modal>
    </View>
  );
};

export default ProfileView;
