import GlobalProvider from "@/context/GlobalProvider";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootSiblingParent } from "react-native-root-siblings";
import React from "react";

export default function RootLayout() {
  return (
    <>
      <SafeAreaView className="h-full w-full">
        <GlobalProvider>
          <RootSiblingParent>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen
                name="settings"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="line"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="createLinePage"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="createPostPage"
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
          </RootSiblingParent>
        </GlobalProvider>
      </SafeAreaView>
    </>
  );
}
