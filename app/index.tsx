import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, Text, Image } from "react-native";
import { useGlobalContext } from "@/context/GlobalContext";
import CustomButton from "@/components/CustomButton";
import { colors, images } from "@/constants";
import React, { useEffect } from "react";

export default function Index() {
  const { isLoading, user } = useGlobalContext();

  useEffect(() => {
    if (!isLoading && user) {
      if (!user.emailVerification) {
        router.replace("/(auth)/verification");
      } else {
        router.replace("/home");
      }
    }
  }, [isLoading, user]);

  return (
    <>
      <View className="flex flex-1 bg-background items-center justify-center relative">
        <Image
          source={images.gate}
          className="absolute h-full w-full opacity-20"
        />
        <View className="flex-1 items-center justify-center">
          <Image source={images.logo} className="h-64 w-64" />
          <Text className=" font-extrabold text-primary text-6xl mt-2">
            Ramonline
          </Text>
          <Text className="font-bold text-lg text-gray-700 -mt-2">
            Making ramonians more connected
          </Text>
        </View>
        <View className="w-full items-center p-6">
          <CustomButton
            title="Continue"
            handlePress={() => router.replace("/signIn")}
            containerStyles="w-full h-12"
            isLoading={isLoading}
          />
        </View>
      </View>
      <StatusBar backgroundColor={colors.background} style="auto" />
    </>
  );
}
