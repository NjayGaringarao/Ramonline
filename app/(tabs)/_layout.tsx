import { View, Text } from "react-native";
import { Image } from "expo-image";
import React from "react";
import { Tabs } from "expo-router";
import { colors, icons, images } from "@/constants";
import { StatusBar } from "expo-status-bar";

const layout = () => {
  return (
    <>
      <View className=" pt-4 h-16 bg-primary justify-end">
        <Text className="pl-4 text-background text-4xl font-bold">
          RamONLINE
        </Text>
      </View>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            position: "absolute",
            top: 0,
            elevation: 0,
            paddingRight: "40%",
            borderTopColor: "transparent",
            backgroundColor: colors.primary,
          },
          tabBarItemStyle: {
            alignItems: "flex-start",
            paddingLeft: 32,
          },
          tabBarShowLabel: false,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ focused }) => (
              <Image
                source={icons.home}
                className="h-6 w-6"
                tintColor={focused ? "#fff" : "#000"}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ focused }) => (
              <Image
                source={icons.profile}
                className="h-6 w-6"
                tintColor={focused ? "#fff" : "#000"}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="notification"
          options={{
            title: "Notification",
            tabBarIcon: ({ focused }) => (
              <Image
                source={icons.notification}
                className="h-6 w-6"
                tintColor={focused ? "#fff" : "#000"}
              />
            ),
          }}
        />
      </Tabs>
      <Image
        source={images.logo}
        className="h-24 w-24 absolute right-0 m-2 bg-background border-2 border-background rounded-full overflow-hidden"
      />
      <StatusBar backgroundColor={colors.primary} style="auto" />
    </>
  );
};

export default layout;
