import { View, Text, ScrollView, Image } from "react-native";
import React from "react";
import CustomButton from "@/components/CustomButton";
import { icons } from "@/constants";
import { router } from "expo-router";
import ProfileSection from "@/components/settingsPage/ProfileSection";
import AffliationSection from "@/components/settingsPage/AffliationSection";
import SessionSection from "@/components/settingsPage/SessionSection";
import CredentialSection from "@/components/settingsPage/CredentialSection";
import Collapsible from "@/components/Collapsible";
import { useGlobalContext } from "@/context/GlobalProvider";

const settings = () => {
  const { isInternetConnection } = useGlobalContext();
  return (
    <View className="flex-1">
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
          Account Settings
        </Text>
      </View>
      <ScrollView className="bg-background flex-1 px-2 pt-4 pb-10">
        <ProfileSection isInternetConnection={!!isInternetConnection} />
        <Collapsible
          title="PRMSU - Castillejos Affiliation"
          titleStyle="text-xl font-semibold text-uBlack"
        >
          <AffliationSection isInternetConnection={!!isInternetConnection} />
        </Collapsible>

        <Collapsible
          title="Sessions"
          titleStyle="text-xl font-semibold text-uBlack"
        >
          <SessionSection isInternetConnection={!!isInternetConnection} />
        </Collapsible>

        <Collapsible
          title="Login Credentials"
          titleStyle="text-xl font-semibold text-uBlack"
        >
          <CredentialSection isInternetConnection={!!isInternetConnection} />
        </Collapsible>

        <View className="pb-10">
          <Collapsible
            title="Danger Zone"
            titleStyle="text-xl font-semibold text-red-600"
          >
            <View className="mb-8">
              <CustomButton
                title="Leave Ramonline"
                handlePress={() => {
                  router.push("/(auth)/deleteAccount");
                }}
                containerStyles="py-1 mt-2 mr-4"
              />
              <CustomButton
                title="Clear User Data"
                handlePress={() => {
                  router.push("/(auth)/deleteAccount");
                }}
                containerStyles="bg-transparent py-1 mt-1 mr-4"
                textStyles="text-primary"
                isLoading={true}
              />
            </View>
          </Collapsible>
        </View>
      </ScrollView>
    </View>
  );
};

export default settings;
