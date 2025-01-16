import { View, Text, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { Tabs } from "expo-router";
import { colors, icons, images } from "@/constants";
import { StatusBar } from "expo-status-bar";
import { useGlobalContext } from "@/context/GlobalContext";

const layout = () => {
  const { userActivity, userNotification } = useGlobalContext();
  const [totalUnread, setTotalUnread] = useState(0);

  useEffect(() => {
    setTotalUnread(
      userNotification.length - userActivity.viewed_notification_id.length
    );
  }, [userActivity, userNotification]);

  return (
    <>
      <View className=" pt-4 h-16 bg-primary justify-end">
        <Text className="pl-4 text-background text-4xl font-bold">
          Ramonline
        </Text>
      </View>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            position: "absolute",
            top: 0,
            paddingRight: "40%",
            backgroundColor: colors.primary,
            elevation: 0,
            shadowOpacity: 0,
            borderTopWidth: 0,
          },
          tabBarItemStyle: {
            alignItems: "flex-start",
            paddingLeft: 8,
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
          name="notification/[isRefresh]"
          options={{
            title: "Notification",
            tabBarIcon: ({ focused }) => (
              <View className="relative">
                <Image
                  source={icons.notification}
                  className="h-6 w-6"
                  tintColor={focused ? "#fff" : "#000"}
                />
                {!!(totalUnread > 0) && (
                  <View className="absolute -top-2 -right-2 w-5 bg-panel items-center justify center rounded-full">
                    <Text className="text-sm font-black text-primary">
                      {totalUnread > 99 ? "99+" : totalUnread}
                    </Text>
                  </View>
                )}
              </View>
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
