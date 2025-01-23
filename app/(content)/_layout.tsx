import React from "react";
import { Stack } from "expo-router";

const layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="user/[id]"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="user/image/[user_id]"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="line/[id]"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="line/image/[line_id]"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="post/[id]"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="post/image/[post_id]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default layout;
