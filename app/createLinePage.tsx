import CustomButton from "@/components/CustomButton";
import FormField from "@/components/FormField";
import Loading from "@/components/Loading";
import PhotoPicker from "@/components/PhotoPicker";
import icons from "@/constants/icons";
import { useGlobalContext } from "@/context/GlobalProvider";
import { confirmAction } from "@/lib/commonUtil";
import { createLine, uploadBanner } from "@/services/lineServices";
import { ImagePickerAsset } from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import { View, Text, ScrollView, Alert, Image } from "react-native";
import Toast from "react-native-root-toast";

const createLinePage = () => {
  const { userInfo, refreshUserRecord, setIsRefreshLineFeed } =
    useGlobalContext();
  const [isLoading, setIsLoading] = useState(false);
  const [lineName, setLineName] = useState("");
  const [lineDescription, setLineDescription] = useState("");
  const [image, setImage] = useState<ImagePickerAsset[]>([]);

  const clearInputHandle = () => {
    setLineName("");
    setLineDescription("");
    setImage([]);
  };

  const createLineHandle = async () => {
    if (
      image.length == 0 ||
      lineName.length == 0 ||
      lineDescription.length == 0
    ) {
      Toast.show(`You cannot create a line with missing detail/s.`, {
        duration: Toast.durations.LONG,
      });
      return;
    }

    if (
      !(await confirmAction(
        "Confirm Line",
        "Do you really want to create this line?"
      ))
    )
      return;

    try {
      setIsLoading(true);
      const banner = await uploadBanner(image[0]);

      const result = await createLine(
        userInfo.id,
        lineName,
        lineDescription,
        banner.$id
      );

      if (result?.responseStatusCode == 200) {
        Alert.alert("Success", "Your Line is created successfully.");
        refreshUserRecord({
          line: true,
        });
        setIsRefreshLineFeed(true);
      } else {
        Toast.show(`There might be a problem creating you line.`, {
          duration: Toast.durations.LONG,
        });
      }
      clearInputHandle();
      router.navigate("/home");
    } catch (error) {
      Alert.alert(
        "Failed",
        "A problem was encountered while creating the Line. Please try again later."
      );
      console.log(`newLine.tsx => createLineHandle :: ERROR : ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="h-full bg-background">
      <View className="h-14 w-full flex-row items-center bg-primary">
        <CustomButton
          handlePress={() => {
            router.back();
          }}
          containerStyles="bg-transparent"
        >
          <Image source={icons.back} className="h-6 w-6" tintColor={"#fff"} />
        </CustomButton>
        <Text className="text-gray-200 text-2xl font-bold">Create Line</Text>
      </View>
      <ScrollView className="flex-1 px-2 pt-4">
        <FormField
          value={lineName}
          placeholder="Line Name"
          handleChangeText={setLineName}
          containerStyles="mb-4"
          maxLength={30}
        />
        <FormField
          value={lineDescription}
          placeholder="Description ..."
          handleChangeText={setLineDescription}
          isMultiline={true}
          maxLines={6}
          containerStyles="mb-4"
        />
        <PhotoPicker
          selectedImages={image}
          setSelectedImages={setImage}
          containerStyles="mb-4"
          isBanner={true}
        />
      </ScrollView>
      <View className="flex-row self-end w-full px-2">
        <CustomButton
          handlePress={clearInputHandle}
          title="Clear"
          textStyles="text-primary"
          containerStyles="h-12 w-1/2 my-2 border-2 border-primary bg-transparent"
        />
        <CustomButton
          handlePress={createLineHandle}
          title="Done"
          containerStyles="h-12 w-1/2 my-2"
        />
      </View>
      <View
        className={`${
          isLoading ? "visible" : "hidden"
        } absolute h-full w-full items-center justify-center`}
      >
        <View className="h-full w-full bg-white opacity-90"></View>

        <Loading
          containerStyles="absolute"
          loadingPrompt="Creating your Line"
        />
      </View>
    </View>
  );
};

export default createLinePage;
