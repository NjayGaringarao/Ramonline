import { View, Text, ScrollView, Image } from "react-native";
import React, { useState } from "react";
import CustomButton from "@/components/CustomButton";
import FormField from "@/components/FormField";
import { ImagePickerAsset } from "expo-image-picker";
import PhotoPicker from "@/components/PhotoPicker";
import { createPost } from "@/services/postServices";
import { useGlobalContext } from "@/context/GlobalProvider";
import Loading from "@/components/Loading";
import { confirmAction } from "@/lib/commonUtil";
import { router } from "expo-router";
import Toast from "react-native-root-toast";
import { icons } from "@/constants";
import ParagraphBox from "@/components/ParagraphBox";

const createPostPage = () => {
  const {
    userInfo,
    refreshUserRecord,
    isInternetConnection,
    setIsRefreshPostFeed,
  } = useGlobalContext();
  const [caption, setCaption] = useState<string>("");
  const [images, setImages] = useState<ImagePickerAsset[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const createPostHandle = async () => {
    if (images.length == 0 && caption.length == 0) {
      Toast.show(`You cannot create an empty post.`, {
        duration: Toast.durations.LONG,
      });
      return;
    }

    if (
      !(await confirmAction(
        "Confirm Post",
        "Do you really want to create this post?"
      ))
    )
      return;

    setIsLoading(true);
    try {
      const post = await createPost(userInfo.id, caption, images);
      if (post) {
        Toast.show(`Uploaded Succesfully`, {
          duration: Toast.durations.LONG,
        });
        refreshUserRecord({
          post: true,
        });
        setIsRefreshPostFeed(true);
      }
      router.back();
    } catch (error) {
      Toast.show(`Failed: ${error}`, {
        duration: Toast.durations.LONG,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearInputs = () => {
    setCaption("");
    setImages([]);
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
        <Text className="text-gray-200 text-2xl font-bold">Create Post</Text>
      </View>
      <ScrollView
        className="flex-1 px-2 pt-4"
        contentContainerStyle={{
          alignItems: "flex-start",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <View className="w-full h-auto">
          <Text className="text-uGray text-xl font-semibold">Caption</Text>
          <ParagraphBox
            value={caption}
            placeholder="Make it creative, descriptive, or even formal. Avoid explicit content to keep the environment neat but importantly, write according to your style!"
            handleChangeText={setCaption}
            containerStyles="flex-1 bg-panel border border-primary rounded-lg min-h-72"
          />
        </View>
        <View className="w-full h-auto">
          <Text className="text-uGray text-xl font-semibold">Image</Text>
          <PhotoPicker
            selectedImages={images}
            setSelectedImages={setImages}
            containerStyles="mb-4"
          />
        </View>
      </ScrollView>
      <View className="w-full flex-row justify-end gap-2 px-4 py-2 bg-panel">
        <CustomButton
          handlePress={createPostHandle}
          title="Done"
          containerStyles="h-10 w-24"
          isLoading={!!!isInternetConnection}
        />
        <CustomButton
          handlePress={clearInputs}
          title="Clear"
          textStyles="text-primary"
          containerStyles="h-10 w-24 border border-primary bg-transparent"
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
          loadingPrompt="Uploading your post"
        />
      </View>
    </View>
  );
};

export default createPostPage;
