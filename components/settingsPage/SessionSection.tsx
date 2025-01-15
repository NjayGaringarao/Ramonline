import { View, Text, FlatList, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { SessionType } from "@/types/utils";
import { colors, icons } from "@/constants";
import RenderSession from "./RenderSession";
import CustomButton from "../CustomButton";
import Toast from "react-native-root-toast";
import { getUserSessions } from "@/services/userServices";
import Loading from "../Loading";

const SessionSection = () => {
  const [sessions, setSessions] = useState<SessionType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getSessionsHandle = async () => {
    try {
      setIsLoading(true);

      setSessions(await getUserSessions());
    } catch (error) {
      Toast.show(`Failed to load sessions.`, {
        duration: Toast.durations.LONG,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getSessionsHandle();
  }, []);

  return (
    <View className="mb-4 gap-2">
      <View className="absolute -top-10 w-full items-end">
        <CustomButton
          handlePress={getSessionsHandle}
          containerStyles="-mr-1 bg-transparent"
        >
          <Image
            source={icons.refresh}
            className="h-5 w-5"
            tintColor={colors.uGray}
          />
        </CustomButton>
      </View>
      <View className="rounded-lg overflow-hidden">
        {sessions
          .sort((a, b) => (b.current ? 1 : 0) - (a.current ? 1 : 0))
          .map((session) => (
            <RenderSession
              key={session.id}
              session={session}
              setIsLoading={(e) => setIsLoading(e)}
            />
          ))}
      </View>
      {isLoading && (
        <View className="absolute items-center justify-center h-full w-full">
          <View className="absolute h-full w-full bg-panel opacity-90"></View>
          <Loading loadingPrompt="Fetching" containerStyles="absolute" />
        </View>
      )}
    </View>
  );
};

export default SessionSection;
