import {
  View,
  Image,
  Alert,
  TouchableOpacity,
  Text,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import CustomButton from "@/components/CustomButton";
import { router, useGlobalSearchParams } from "expo-router";
import { icons, images } from "@/constants";
import { LineType, UserType } from "@/types/models";
import {
  countSubscribers,
  getLine,
  isUserSubscribed,
  subscribeLine,
  unsubscribeLine,
} from "@/services/lineServices";
import { useGlobalContext } from "@/context/GlobalProvider";
import Toast from "react-native-root-toast";
import { getUserInfo } from "@/services/userServices";
import Loading from "@/components/Loading";
import { getImagePreview } from "@/services/commonServices";
import DescriptionView from "@/components/LineView/DescriptionView";
import UserBanner from "@/components/UserBanner";
import AdaptiveTime from "@/components/AdaptiveTime";

const line = () => {
  const searchParams = useGlobalSearchParams();
  const { userInfo, setIsRefreshLineFeed } = useGlobalContext();
  const [line, setLine] = useState<LineType.Info>();
  const [owner, setOwner] = useState<UserType.Info>();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);

  const initialize = async (line_id: string) => {
    try {
      setIsLoading(true);
      const _line = await getLine(line_id);
      setLine(_line);

      if (_line.user_id == userInfo.id) {
        setOwner(userInfo);
      } else {
        setOwner(await getUserInfo(_line.user_id));
      }
      setIsSubscribed(await isUserSubscribed(userInfo.id, _line.id));

      setSubscriberCount(await countSubscribers(_line.id));
    } catch (error) {
      Toast.show("There was an error fetching information");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchParams.id) {
      initialize(searchParams.id.toString());
    }
  }, [searchParams]);

  if (line && owner) {
    const UserBannerHandle = () => {
      if (line.user_id == userInfo.id) {
        Toast.show("That was you", {
          duration: Toast.durations.LONG,
        });
      } else {
        router.push(`/(content)/user/${owner.id}`);
      }
    };

    const subscriptionHandle = async () => {
      try {
        setIsLoading(true);
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
          Toast.show(
            `You are able to recieve notifications from ${line.name}.`,
            {
              duration: Toast.durations.LONG,
            }
          );
          setSubscriberCount((prev) => prev + 1);
        }
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await setIsRefreshLineFeed(true);
      } catch (error) {
        Alert.alert(
          "Failed",
          "A problem was encountered while managing subscription a Line. Please try again later."
        );
        console.log(
          `app/line/id.tsx => subscriptionHandle :: ERROR : ${error}`
        );
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <View className=" flex-1 items-center bg-background">
        <View className="h-14 w-full flex-row items-center bg-primary">
          <CustomButton
            handlePress={() => {
              router.back();
            }}
            containerStyles="bg-transparent"
          >
            <Image source={icons.back} className="h-6 w-6" tintColor={"#fff"} />
          </CustomButton>
        </View>

        <ScrollView className="flex-1 w-full overflow-y-scroll">
          <View>
            <TouchableOpacity
              onPress={() => router.push(`/(content)/line/image/${line.id}`)}
              className="bg-primary"
            >
              <Image
                source={images.gate}
                className="absolute w-full h-96 opacity-40"
                resizeMode="cover"
              />
              <Image
                source={{ uri: getImagePreview(line.banner_id, 30) }}
                className="w-full h-96"
                resizeMode="cover"
              />
            </TouchableOpacity>
            <View className="w-full bg-panel rounded-b-lg py-4 gap-2">
              <Text className="text-3xl text-primary font-semibold px-4">
                {line.name}
              </Text>
              <View className="w-full justify-end items-center flex-row px-4 gap-4">
                <Text className="text-xl text-uGray font-semibold">
                  {subscriberCount < 0 ? 0 : subscriberCount}
                </Text>
                <CustomButton
                  handlePress={subscriptionHandle}
                  title={isSubscribed ? "Unsubscribe" : "Subscribe"}
                  containerStyles={`self-end py-1 w-48 ${
                    isSubscribed ? "border border-primary bg-transparent" : ""
                  } self-end}`}
                  textStyles={`${
                    isSubscribed
                      ? "text-primary font-semibold"
                      : "text-white font-semibold"
                  } ${!!isSubscribed && "bg-transparent"}`}
                  isLoading={isLoading}
                />
              </View>
            </View>

            <View className="h-auto w-full px-4 py-2">
              <Text className="text-uBlack text-xl font-semibold">
                Line Description
              </Text>
              <DescriptionView line={line} />
            </View>
            <View className="h-auto w-full px-4 py-2 gap-2">
              <Text className="text-uBlack text-xl font-semibold">
                Line Owner
              </Text>
              <UserBanner userInfo={owner} handlePress={UserBannerHandle} />
            </View>

            <View className="h-auto w-full px-4 py-2 gap-2 mb-12">
              <Text className="text-uBlack text-xl font-semibold">
                Created at
              </Text>
              <View className="flex-row items-center gap-2">
                <AdaptiveTime
                  isoDate={line.created_at.toISOString()}
                  isFullDate
                />
                <Text className="text-lg font-semibold">|</Text>
                <AdaptiveTime isoDate={line.created_at.toISOString()} />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  } else {
    return (
      <View className="flex-1 bg-black">
        <Loading loadingPrompt="Please wait" color="#fff" />
      </View>
    );
  }
};

export default line;
