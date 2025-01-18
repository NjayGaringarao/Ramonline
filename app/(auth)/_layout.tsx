import React from "react";
import { Stack } from "expo-router";

const layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="signIn"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="recovery/[email]"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="signUp"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="verification"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="deleteAccount"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default layout;
