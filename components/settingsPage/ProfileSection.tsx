import React, { useEffect, useState, useRef } from "react";
import { View, Text } from "react-native";
import TextBox from "../TextBox";
import CustomButton from "../CustomButton";
import ProfilePicturePicker from "../ProfilePicturePicker";
import { UserType } from "@/types/models";
import { ImagePickerAsset } from "expo-image-picker";
import Loading from "../Loading";
import { updateProfile } from "@/services/userServices";
import Toast from "react-native-root-toast";
import { confirmAction } from "@/lib/commonUtil";

interface ProfileSectionProp {
  userInfo: UserType.Info;
  refreshUserInfo: (refresh: boolean) => void;
  isRefreshUserInfo: boolean;
}

const ProfileSection = ({
  userInfo,
  refreshUserInfo,
  isRefreshUserInfo,
}: ProfileSectionProp) => {
  const [isModified, setIsModified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newProfilePicture, setNewProfilePicture] = useState<
    ImagePickerAsset | undefined
  >();
  const [form, setform] = useState({
    fName: "",
    mName: "",
    lName: "",
  });
  const profilePickerRef = useRef<{ clear: () => void }>(null);

  const clearHandle = () => {
    if (userInfo.name) {
      setform({
        fName: userInfo.name[0] ? userInfo.name[0] : "",
        mName: userInfo.name[1] ? userInfo.name[1] : "",
        lName: userInfo.name[2] ? userInfo.name[2] : "",
      });
    }
    clearProfilePicture();
  };

  const clearProfilePicture = () => {
    profilePickerRef.current?.clear();
  };

  const updateHandle = async () => {
    if (
      !(await confirmAction(
        "Confirm Changes",
        "Save changes that you've made?"
      ))
    )
      return;
    try {
      setIsLoading(true);
      if (
        !(await updateProfile(
          userInfo.id,
          [form.fName, form.mName, form.lName],
          newProfilePicture
        ))
      ) {
        throw Error;
      }

      Toast.show(`Succesfully applied changes.`, {
        duration: Toast.durations.LONG,
      });
      refreshUserInfo(true);
    } catch (error) {
      Toast.show(`Failed to save changes.`, {
        duration: Toast.durations.LONG,
      });
      clearHandle();
    }
  };

  useEffect(() => {
    clearHandle();
  }, [userInfo]);

  useEffect(() => {
    if (userInfo.name) {
      if (
        form.fName !== userInfo.name[0] ||
        form.mName !== userInfo.name[1] ||
        form.lName !== userInfo.name[2] ||
        newProfilePicture
      ) {
        setIsModified(true);
      } else {
        setIsModified(false);
      }
    }
  }, [form, newProfilePicture]);

  useEffect(() => {
    if (!isRefreshUserInfo) setIsLoading(false);
  }, [isRefreshUserInfo]);

  return (
    <View className="mb-8 gap-2">
      <Text className="text-xl font-semibold text-uBlack">
        User Information
      </Text>
      <View>
        <View className="w-full flex-row space-x-4">
          <View className="justify-center items-center">
            <ProfilePicturePicker
              ref={profilePickerRef}
              userInfo={userInfo}
              setNewProfilePicture={(e) => setNewProfilePicture(e)}
              newProfilePicture={newProfilePicture}
              containerStyle="h-32 w-32 rounded-3xl overflow-hidden bg-panel shadow-lg shadow-primary"
              imageStyle="flex-1 bg-panel"
              imageContentFit="cover"
            />
            <Text className="text-sm text-uGray font-semibold pt-1">
              {userInfo.username}
            </Text>
          </View>

          <View className="flex-1 w-full">
            <TextBox
              title="First Name"
              titleTextStyles="text-uGray text-sm font-semibold"
              textValue={form.fName}
              placeholder="unset"
              maxLength={20}
              textInputStyles="text-base"
              handleChangeText={(e) => setform({ ...form, fName: e })}
              boxStyles="w-full py-1 bg-panel rounded-lg px-4"
              containerStyles="pb-1"
            />
            <TextBox
              title="Middle Name"
              titleTextStyles="text-uGray text-sm font-semibold"
              textValue={form.mName}
              placeholder="unset"
              maxLength={20}
              textInputStyles="text-base"
              handleChangeText={(e) => setform({ ...form, mName: e })}
              boxStyles="w-full py-1 bg-panel rounded-lg px-4"
              containerStyles="pb-1"
            />
            <TextBox
              title="Last Name"
              titleTextStyles="text-uGray text-sm font-semibold"
              textValue={form.lName}
              placeholder="unset"
              maxLength={20}
              textInputStyles="text-base"
              handleChangeText={(e) => setform({ ...form, lName: e })}
              boxStyles="w-full py-1 bg-panel rounded-lg px-4"
              containerStyles="pb-1"
            />
          </View>
        </View>
        {isModified ? (
          <View className="self-end mt-2 flex-row">
            <CustomButton
              title="Update"
              handlePress={updateHandle}
              containerStyles="py-1"
            />
            <CustomButton
              title="Reset"
              handlePress={clearHandle}
              containerStyles="ml-2 py-1 border-2 border-primary bg-transparent"
              textStyles="text-primary"
            />
          </View>
        ) : null}
      </View>
      {isLoading && (
        <View className="absolute items-center justify-center h-full w-full">
          <View className="absolute h-full w-full bg-panel opacity-90"></View>
          <Loading
            loadingPrompt="Applying Changes"
            containerStyles="absolute"
          />
        </View>
      )}
    </View>
  );
};

export default ProfileSection;
