import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { colors, icons } from "@/constants";
import { SessionType } from "@/types/utils";
import { confirmAction, formatDateToLocal } from "@/lib/commonUtil";
import Toast from "react-native-root-toast";
import { logoutUser } from "@/services/userServices";
import CustomButton from "../CustomButton";

interface IRenderSession {
  session: SessionType;
  setIsLoading: (isLoading: boolean) => void;
  isInternetConnection: boolean;
}

const RenderSession = ({
  session,
  setIsLoading,
  isInternetConnection,
}: IRenderSession) => {
  const [isVisible, setIsVisible] = useState(true);

  const deleteSessionHandle = async () => {
    if (!(await confirmAction("Confirm Logout", "The session will be logout.")))
      return;

    try {
      setIsLoading(true);
      await logoutUser(session.id);
      setIsVisible(false);
    } catch (error) {
      Toast.show(`Failed to delete session.`, {
        duration: Toast.durations.LONG,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className={`${isVisible ? "visible" : "hidden"} mt-[2px]`}>
      <View className="flex-row w-full px-3 py-3 items-center bg-panel">
        <View className="flex-row gap-4 items-center justify-center">
          <Image
            source={session.osName == "Android" ? icons.android : icons.apple}
            className="h-8 w-8"
          />
          <View>
            <Text className="text-lg text-uBlack font-medium">{`${session.ip} ${
              session.current ? "(Current)" : ""
            }`}</Text>
            <Text className="text-gray-800 text-sm font-mono -mt-1">
              {`${session.country.toUpperCase()} ${formatDateToLocal(
                session.created_at.toISOString()
              )}`}
            </Text>
          </View>
        </View>
        {!session.current && (
          <CustomButton
            handlePress={deleteSessionHandle}
            containerStyles="absolute right-3 bg-transparent"
            isLoading={!isInternetConnection}
          >
            <Image
              source={icons.close}
              className="h-5 w-5"
              tintColor={colors.uGray}
            />
          </CustomButton>
        )}
      </View>
    </View>
  );
};

export default RenderSession;
