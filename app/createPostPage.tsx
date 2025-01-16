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

const createPostPage = () => {
  const { userInfo, refreshUserRecord, isOnline } = useGlobalContext();
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
      if (!isOnline) throw Error("No Internet Connection.");
      const post = await createPost(userInfo.id, caption, images);
      if (post) {
        Toast.show(`Uploaded Succesfully`, {
          duration: Toast.durations.LONG,
        });
        refreshUserRecord({
          post: true,
        });
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
      <ScrollView className="flex-1 px-2 pt-4">
        <FormField
          value={caption}
          placeholder="Type caption here ..."
          handleChangeText={setCaption}
          isMultiline={true}
          maxLines={6}
          containerStyles="mb-4 bg-panel"
        />
        <PhotoPicker
          selectedImages={images}
          setSelectedImages={setImages}
          containerStyles="mb-4"
        />
      </ScrollView>
      <View className="flex-row self-end w-full px-2 gap-2">
        <CustomButton
          handlePress={clearInputs}
          title="Clear"
          textStyles="text-primary"
          containerStyles="flex-1 h-12 my-2 border-2 border-primary bg-transparent"
        />
        <CustomButton
          handlePress={createPostHandle}
          title="Done"
          containerStyles="flex-1 h-12 w-full my-2"
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
