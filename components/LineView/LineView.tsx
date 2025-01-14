import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { getImagePreview } from "@/services/commonServices";
import CustomButton from "../CustomButton";
import Toast from "react-native-root-toast";
import { icons, images } from "@/constants";
import { LineType, UserType } from "@/types/models";
import { getUserInfo } from "@/services/userServices";
import DescriptionView from "./DescriptionView";
import {
  deleteLine,
  isUserSubscribed,
  subscribeLine,
  unsubscribeLine,
  updateDescription,
} from "@/services/lineServices";
import {
  confirmAction,
  getDisplayName,
  getDisplayRole,
  getHTMLImageRender,
} from "@/lib/commonUtil";
import WebView from "react-native-webview";
import ProfilePicture from "../ProfilePicture";
import ModalOptions from "./ModalOptions";
import ModalEditDescription from "./ModalEditDescription";
import { useGlobalContext } from "@/context/GlobalProvider";

type ILineViewProps = {
  line: LineType.Info;
  isInModal?: boolean;
  isModifyable?: boolean;
  isInFeed?: boolean;
};

const LineView = ({
  line,
  isInModal,
  isModifyable,
  isInFeed,
}: ILineViewProps) => {
  const { userRecord, refreshUserRecord } = useGlobalContext();
  const [isModalOptionVisible, setIsModalOptionVisible] = useState(false);
  const [isModalEditVisible, setIsModalEditVisible] = useState(false);
  const [isThisVisible, setIsThisVisible] = useState(true);
  const [owner, setOwner] = useState<UserType.Info>(Object);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [descriptionForm, setDescriptionForm] = useState<string>("");
  const [isBannerPreviewVisible, setIsBannerPreviewVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const renderImage = (image_id: string) => {
    try {
      return getImagePreview(image_id);
    } catch (error) {
      console.log(`ERROR (LineView.tsx => renderImage) :: ${error}`);
      return "";
    }
  };

  const setupSubscriptionStatus = async () => {
    try {
      setIsLoading(true);
      setIsSubscribed(await isUserSubscribed(userRecord.info.id, line.id));
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
        info: false,
        activity: false,
        line: true,
        post: false,
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
          info: false,
          activity: false,
          line: true,
          post: false,
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
      setIsLoading(true);
      if (isSubscribed) {
        const result = await unsubscribeLine(userRecord.info.id, line.id);
        if (result) setIsSubscribed(false);
        Toast.show(
          `You are unable to recieve notifications from ${line.name}.`,
          {
            duration: Toast.durations.LONG,
          }
        );
      } else {
        const result = await subscribeLine(userRecord.info.id, line.id);
        if (result) setIsSubscribed(true);
        Toast.show(`You are able to recieve notifications from ${line.name}.`, {
          duration: Toast.durations.LONG,
        });
      }
    } catch (error) {
      Alert.alert(
        "Failed",
        "A problem was encountered while managing subscription a Line. Please try again later."
      );
      console.log(`LineView.tsx => subscriptionHandle :: ERROR : ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setDescriptionForm(line.description);
    setupSubscriptionStatus();
    if (userRecord.info.id == line.user_id) {
      setOwner(userRecord.info);
    } else {
      getUserInfo(line.user_id).then((e) => {
        setOwner(e);
      });
    }
  }, []);

  return (
    <View
      className={`w-full h-auto pb-10 bg-background p-2 ${
        isThisVisible ? "visible" : "hidden"
      }`}
    >
      {/* Header */}
      <View className="w-full h-auto my-2">
        <View className="flex-row justify-between items-center">
          <View className="flex-row gap-2 h-12 items-center">
            <ProfilePicture
              userInfo={owner}
              imageStyle="h-12 w-12 rounded-full"
            />

            <View className="justify-center">
              <Text className="text-lg font-semibold">
                {getDisplayName(owner)}
              </Text>
              <Text className="text-xs font-mono -mt-1">
                {getDisplayRole(owner)}
              </Text>
            </View>
          </View>
          <CustomButton
            handlePress={() => {
              setIsModalOptionVisible(true);
            }}
            containerStyles={`-mr-2 bg-transparent ${
              isModifyable ? "visible" : "hidden"
            }`}
          >
            <Image source={icons.options} className="h-7 w-7" />
          </CustomButton>
        </View>
      </View>
      <View className="rounded-lg overflow-hidden">
        <TouchableOpacity
          onPress={() => setIsBannerPreviewVisible(true)}
          className="bg-primary"
        >
          <Image
            source={images.gate}
            className="absolute w-full h-56 opacity-40"
            resizeMode="cover"
          />
          <Image
            source={{ uri: renderImage(line.banner_id) }}
            className="w-full h-56"
            resizeMode="cover"
          />
        </TouchableOpacity>
        <View className="h-auto w-full">
          <Text className="text-xl text-primary font-semibold py-2">
            {line.name}
          </Text>
          <DescriptionView line={line} isInModal={isInModal} />
        </View>
        <CustomButton
          handlePress={subscriptionHandle}
          title={isSubscribed ? "Unsubscribe" : "Subscribe"}
          containerStyles={`py-1 ${
            isSubscribed ? "border-2 border-primary bg-transparent" : ""
          } ${isInFeed ? "self-end" : ""}`}
          textStyles={`${
            isSubscribed
              ? "text-primary font-semibold"
              : "text-white font-semibold"
          } ${!!isSubscribed && "bg-transparent"}`}
          isLoading={isLoading}
        />
      </View>

      {isModifyable ? (
        <>
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
            setDescriptionForm={(description) =>
              setDescriptionForm(description)
            }
          />
        </>
      ) : null}

      {/* Modal to show the image in full screen */}
      <Modal
        visible={isBannerPreviewVisible}
        transparent={false}
        animationType="slide"
      >
        <TouchableOpacity
          className="flex-1 absolute items-center"
          onPress={() => setIsBannerPreviewVisible(false)}
        />
        <View className="bg-black w-full h-full relative">
          <WebView
            originWhitelist={["*"]}
            source={{
              html: getHTMLImageRender(renderImage(line.banner_id)),
            }}
            scalesPageToFit={true}
            bounces={true}
            showsVerticalScrollIndicator={false}
          />
          <View className="absolute top-0 w-full h-16 bg-black opacity-70" />
          <CustomButton
            handlePress={() => setIsBannerPreviewVisible(false)}
            containerStyles="absolute top-5 left-0 bg-transparent"
          >
            <Image source={icons.back} className="h-6 w-6" tintColor={"#fff"} />
          </CustomButton>
        </View>
      </Modal>
    </View>
  );
};

export default LineView;
