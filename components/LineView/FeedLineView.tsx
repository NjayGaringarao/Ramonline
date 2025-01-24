import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { getImagePreview } from "@/services/commonServices";
import { LineType, UserType } from "@/types/models";
import { images } from "@/constants";
import DescriptionView from "./DescriptionView";
import CustomButton from "../CustomButton";
import {
  countSubscribers,
  isUserSubscribed,
  subscribeLine,
  unsubscribeLine,
} from "@/services/lineServices";
import Toast from "react-native-root-toast";

interface IFeedLineView {
  line: LineType.Info;
  userInfo: UserType.Info;
}
const FeedLineView = ({ line, userInfo }: IFeedLineView) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);

  const setupSubscriptionStatus = async () => {
    try {
      setIsLoading(true);
      setIsSubscribed(await isUserSubscribed(userInfo.id, line.id));
    } catch (error) {
      Alert.alert(
        "Error",
        "A problem was encountered while checking your subscriptions. Please try again later."
      );
      console.log(`LineView.tsx => setupSubscriptions :: ERROR : ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const subscriptionHandle = async () => {
    try {
      if (isSubscribed) {
        const result = await unsubscribeLine(userInfo.id, line.id);
        if (result) setIsSubscribed(false);
        Toast.show(
          `You are now unable to recieve notifications from ${line.name}.`,
          {
            duration: Toast.durations.LONG,
          }
        );

        setSubscriberCount((prev) => prev - 1);
      } else {
        const result = await subscribeLine(userInfo.id, line.id);
        if (result) setIsSubscribed(true);
        Toast.show(`You are able to recieve notifications from ${line.name}.`, {
          duration: Toast.durations.LONG,
        });
        setSubscriberCount((prev) => prev + 1);
      }
    } catch (error) {
      Alert.alert(
        "Failed",
        "A problem was encountered while managing subscription a Line. Please try again later."
      );
      console.log(`FeedLineView.tsx => subscriptionHandle :: ERROR : ${error}`);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      setupSubscriptionStatus();
      setSubscriberCount(await countSubscribers(line.id));
    };

    initialize();
  }, []);

  return (
    <View className={`w-full h-auto mb-4 bg-background p-2 `}>
      <View className="rounded-lg overflow-hidden bg-panel">
        <TouchableOpacity
          onPress={() => router.push(`/(content)/line/image/${line.id}`)}
          className="bg-primary"
        >
          <Image
            source={images.gate}
            className="absolute w-full h-56 opacity-40"
            resizeMode="cover"
          />
          <Image
            source={{ uri: getImagePreview(line.banner_id, 30) }}
            className="w-full h-56"
            resizeMode="cover"
          />
        </TouchableOpacity>
        <View className="h-auto w-full">
          <View className="w-full bg-panel rounded-b-lg">
            <Text
              className="text-2xl text-primary font-semibold pt-4 pl-4"
              onPress={() => router.push(`/(content)/line/${line.id}`)}
            >
              {line.name}
            </Text>
          </View>
          <DescriptionView line={line} />
        </View>
        <View className="w-full flex-row justify-end items-center pb-4 px-4">
          <Text className="text-xl text-uGray font-semibold px-4">
            {subscriberCount < 0 ? 0 : subscriberCount}
          </Text>

          <CustomButton
            handlePress={subscriptionHandle}
            title={isSubscribed ? "Unsubscribe" : "Subscribe"}
            containerStyles={`py-1 ${
              isSubscribed ? "border border-primary bg-transparent" : ""
            } self-end`}
            textStyles={`${
              isSubscribed
                ? "text-primary font-semibold"
                : "text-white font-semibold"
            } ${!!isSubscribed && "bg-transparent"}`}
            isLoading={isLoading}
          />
        </View>
      </View>
    </View>
  );
};

export default FeedLineView;
