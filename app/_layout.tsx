import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootSiblingParent } from "react-native-root-siblings";
import React from "react";
import "@/global.css";
import { StatusBar } from "expo-status-bar";
import { colors } from "@/constants";
import GlobalProvider from "@/context/GlobalProvider";
export default function RootLayout() {
  return (
    <>
      <RootSiblingParent>
        <GlobalProvider>
          <SafeAreaView className="flex flex-1">
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen
                name="settings"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="create/post"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="create/line"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="(auth)"
                options={{
                  headerShown: false,
                }}
              />

              <Stack.Screen
                name="(tabs)"
                options={{
                  headerShown: false,
                }}
              />
            </Stack>
          </SafeAreaView>
        </GlobalProvider>
      </RootSiblingParent>
      <StatusBar backgroundColor={colors.background} style="light" />
    </>
  );
}
