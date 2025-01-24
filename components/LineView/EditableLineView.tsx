import { View, Text, Alert, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "@/context/GlobalProvider";
import { LineType, UserType } from "@/types/models";
import Toast from "react-native-root-toast";
import {
  countSubscribers,
  deleteLine,
  isUserSubscribed,
  subscribeLine,
  unsubscribeLine,
  updateDescription,
} from "@/services/lineServices";
import { confirmAction } from "@/lib/commonUtil";
import UserBanner from "../UserBanner";
import { colors, icons, images } from "@/constants";
import { getImagePreview } from "@/services/commonServices";
import DescriptionView from "./DescriptionView";
import CustomButton from "../CustomButton";
import ModalOptions from "./ModalOptions";
import ModalEditDescription from "./ModalEditDescription";
import { router } from "expo-router";

type IEditableLineViewProps = {
  line: LineType.Info;
};

const EditableLineView = ({ line }: IEditableLineViewProps) => {
  const { userInfo, refreshUserRecord } = useGlobalContext();
  const [isModalOptionVisible, setIsModalOptionVisible] = useState(false);
  const [isModalEditVisible, setIsModalEditVisible] = useState(false);
  const [isThisVisible, setIsThisVisible] = useState(true);
  const [owner, setOwner] = useState<UserType.Info>(Object);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [descriptionForm, setDescriptionForm] = useState<string>("");
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

  const deleteLineHandle = async () => {
    if (
      !(await confirmAction(
        "Delete Line",
        "Do you really want to delete this line?"
      ))
    )
      return;
    try {
      setIsLoading(true);
      setIsModalOptionVisible(false);
      setIsThisVisible(false);
      await deleteLine(line.id);
      refreshUserRecord({
        line: true,
      });
    } catch (error) {
      Alert.alert(
        "Failed",
        "A problem was encountered while deleting a Line. Please try again later."
      );
      console.log(`LineView.tsx => deleteLineHandle :: ERROR : ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const updateLineHandle = async () => {
    if (
      !(await confirmAction(
        "Confirm Changes",
        "Do you really want to save the changes you've made?"
      ))
    )
      return;

    try {
      setIsLoading(true);
      setIsModalOptionVisible(false);
      setIsModalEditVisible(false);

      const result = await updateDescription(line.id, descriptionForm);
      if (result) {
        line.description = descriptionForm;
        Toast.show(`Line updated`, {
          duration: Toast.durations.LONG,
        });
        refreshUserRecord({
          line: true,
        });
      }
    } catch (error) {
      Alert.alert(
        "Failed",
        "A problem was encountered while updating a Line. Please try again later."
      );
      console.log(`LineView.tsx => updateLineHandle :: ERROR : ${error}`);
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
      console.log(
        `EditableLineView.tsx => subscriptionHandle :: ERROR : ${error}`
      );
    }
  };

  useEffect(() => {
    const initialize = async () => {
      setDescriptionForm(line.description);
      setupSubscriptionStatus();
      setSubscriberCount(await countSubscribers(line.id));
      setOwner(userInfo);
    };

    initialize();
  }, []);
  return (
    <>
      <View
        className={`w-full h-auto mb-4 bg-background p-2 ${
          isThisVisible ? "visible" : "hidden"
        }`}
      >
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
          <View className="w-full flex-row justify-end items-center pb-4">
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
            <CustomButton
              handlePress={() => {
                setIsModalOptionVisible(true);
              }}
              containerStyles={`bg-transparent w-12`}
            >
              <Image
                source={icons.options}
                className="h-6 w-6 rotate-90"
                tintColor={colors.uGray}
              />
            </CustomButton>
          </View>
        </View>
      </View>

      <ModalOptions
        isVisible={isModalOptionVisible}
        onClose={() => setIsModalOptionVisible(false)}
        onEditDescription={() => {
          setIsModalEditVisible(true);
          setIsModalOptionVisible(false);
        }}
        onDelete={deleteLineHandle}
        line={line}
        owner={owner}
      />
      <ModalEditDescription
        visible={isModalEditVisible}
        onClose={() => {
          setIsModalEditVisible(false);
          setDescriptionForm(line.description);
        }}
        onSave={updateLineHandle}
        descriptionForm={descriptionForm}
        setDescriptionForm={(description) => setDescriptionForm(description)}
        line_name={line.name}
      />
    </>
  );
};

export default EditableLineView;
