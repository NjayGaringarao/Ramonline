import { View, Text, ScrollView, Image } from "react-native";
import React from "react";
import CustomButton from "@/components/CustomButton";
import { icons } from "@/constants";
import { router } from "expo-router";
import { useGlobalContext } from "@/context/GlobalProvider";
import ProfileSection from "@/components/settingsPage/ProfileSection";
import AffliationSection from "@/components/settingsPage/AffliationSection";
import SessionSection from "@/components/settingsPage/SessionSection";
import CredentialSection from "@/components/settingsPage/CredentialSection";
import Collapsible from "@/components/Collapsible";

const settings = () => {
  return (
    <>
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
      <ScrollView className="bg-background flex-1 px-2 py-4">
        <ProfileSection />
        <Collapsible
          title="PRMSU - Castillejos Affiliation"
          titleStyle="text-xl font-semibold text-uBlack"
        >
          <AffliationSection />
        </Collapsible>

        <Collapsible
          title="User Sessions"
          titleStyle="text-xl font-semibold text-uBlack"
        >
          <SessionSection />
        </Collapsible>

        <Collapsible
          title="Login Credentials"
          titleStyle="text-xl font-semibold text-uBlack"
        >
          <CredentialSection />
        </Collapsible>

        <Collapsible
          title="Danger Zone"
          titleStyle="text-xl font-semibold text-red-600"
        >
          <View className="mb-8">
            <Text className="text-base font-medium text-gray-800">
              {"\n\t\t\tAnyone can come and go."}
            </Text>
            <CustomButton
              title="Delete Account"
              handlePress={() => {}}
              containerStyles="py-1 mt-2"
              isLoading={true}
            />
          </View>
        </Collapsible>
      </ScrollView>
    </>
  );
};

export default settings;
