import React, { useState } from "react";
import { View, Text, ScrollView, Image } from "react-native";
import { router } from "expo-router";
import TextBox from "@/components/TextBox";
import CustomButton from "@/components/CustomButton";
import Collapsible from "@/components/Collapsible";
import Toast from "react-native-root-toast";
import { confirmAction, getDisplayName } from "@/lib/commonUtil";
import { deleteUserAccount } from "@/services/userServices";
import { useGlobalContext } from "@/context/GlobalProvider";
import { icons, images } from "@/constants";
import ProfilePicture from "@/components/ProfilePicture";

const DeleteAccount = () => {
  const {
    user,
    userInfo,
    setUser,
    setUserInfo,
    setUserLine,
    setUserNotification,
    setUserPost,
  } = useGlobalContext();
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteAccount = async () => {
    if (
      !(await confirmAction(
        "Confirm Deletion",
        "Are you sure you want to delete your account? This action cannot be undone."
      ))
    ) {
      return;
    }

    try {
      setIsLoading(true);
      const result = await deleteUserAccount(user?.$id!, password);

      if (result.responseStatusCode === 500) throw Error;
      Toast.show("Account successfully deleted.", {
        duration: Toast.durations.LONG,
      });

      setUser(null);
      setUserInfo({
        id: "",
        username: "",
        name: ["", "", ""],
        avatar_url: "",
        picture_id: "",
        role: ["", "", "", ""],
        created_at: new Date(0),
      });
      setUserLine([]);
      setUserPost([]);
      setUserNotification([]);
      router.replace("/(auth)/signIn");
    } catch (error) {
      Toast.show(
        "Failed to delete account due to wrong password or internal server error. Please try again.",
        {
          duration: Toast.durations.LONG,
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="bg-background flex-1">
      <View className="h-14 w-full flex-row items-center bg-primary">
        <CustomButton
          handlePress={() => {
            router.back();
          }}
          containerStyles="bg-transparent"
        >
          <Image source={icons.back} className="h-6 w-6" tintColor={"#fff"} />
        </CustomButton>
        <Text className="text-gray-100 text-2xl font-bold">
          Leave Ramonline
        </Text>
      </View>

      <Image
        source={images.prmsu}
        className="absolute top-24 right-4 h-36 w-36 opacity-10"
      />
      <Image
        source={images.gate}
        className="absolute h-full w-full opacity-10 -px-4 -py-6 mt-14"
      />
      <View className="flex-1 px-4 py-6 justify-center items-center gap-8">
        <View className="w-full gap-2 flex-row items-end">
          <ProfilePicture
            userInfo={userInfo}
            containerStyle="h-32 w-32 rounded-3xl  overflow-hidden shadow-lg shadow-primary"
            imageStyle="flex-1 bg-primary"
          />
          <View>
            <Text
              className="text-3xl text-uBlack font-semibold"
              numberOfLines={2}
            >
              {getDisplayName(userInfo) === userInfo.username ? (
                <Text>unset</Text>
              ) : (
                getDisplayName(userInfo)
              )}
            </Text>
            <Text className="text-base text-uGray -mt-1">{user?.email}</Text>
          </View>
        </View>

        <View className="w-full gap-2">
          <TextBox
            title="Enter your password to continue"
            titleTextStyles="text-uGray text-xl font-semibold mb-2"
            textValue={password}
            placeholder="Enter your password"
            handleChangeText={setPassword}
            isPassword={true}
            boxStyles="w-full py-2 bg-panel rounded-lg px-4"
          />

          <CustomButton
            title="⚠️ Leave Ramonline ⚠️"
            handlePress={handleDeleteAccount}
            containerStyles="w-full bg-red-600 rounded-lg"
            textStyles="text-white"
            isLoading={isLoading || password.length == 0}
          />
        </View>

        <View>
          <Text className="text-uBlack text-2xl font-semibold mb-3">
            Frequently Asked Questions
          </Text>
          <ScrollView className="max-h-52 mr-2">
            <Collapsible
              title="1. What happens if I leave Ramonline?"
              childrenContainerStyle="ml-10"
            >
              <Text
                className="text-base font-mono text-uBlack"
                style={{ lineHeight: 22 }}
              >
                If you choose to leave Ramonline, your account will be
                permanently deleted, and you will no longer have access to it or
                any associated data.
              </Text>
            </Collapsible>

            <Collapsible
              title="2. Can I recover my account after deletion?"
              childrenContainerStyle="ml-10"
            >
              <Text
                className="text-base font-mono text-uBlack"
                style={{ lineHeight: 22 }}
              >
                No, account recovery is not possible after deletion. Once your
                account is deleted, all associated data is permanently removed
                from our systems.
              </Text>
            </Collapsible>

            <Collapsible
              title="3. What happens to my posts and data after deletion?"
              childrenContainerStyle="ml-10"
            >
              <Text
                className="text-base font-mono text-uBlack"
                style={{ lineHeight: 22 }}
              >
                All your posts, lines, and personal data will be permanently
                deleted from our system. However, notifications or logs caused
                by your lines may be retained for record-keeping purposes.
              </Text>
            </Collapsible>

            <Collapsible
              title="4. Can I create a new account with the same email?"
              childrenContainerStyle="ml-10"
            >
              <Text
                className="text-base font-mono text-uBlack"
                style={{ lineHeight: 22 }}
              >
                Yes, you can register a new account using the same email address
                after your previous account has been deleted.
              </Text>
            </Collapsible>
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default DeleteAccount;
