import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { ImagePickerAsset } from "expo-image-picker";
import CustomButton from "./CustomButton";
import { colors, icons } from "@/constants";
import WebView from "react-native-webview";
import { convertToBase64, getHTMLImageRender } from "@/lib/commonUtil";

type IPhotoPickerProps = {
  selectedImages: ImagePickerAsset[];
  setSelectedImages: React.Dispatch<React.SetStateAction<ImagePickerAsset[]>>;
  containerStyles?: string;
  isBanner?: boolean;
};

const PhotoPicker: React.FC<IPhotoPickerProps> = ({
  selectedImages,
  setSelectedImages,
  containerStyles,
  isBanner,
}) => {
  const [isImagePreviewVisible, setIsImagePreviewVisible] = useState(false);
  const [base64Image, setBase64Image] = useState<string | null>(null);

  const pickImage = async (): Promise<void> => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: isBanner ? true : false,
      allowsMultipleSelection: isBanner ? false : true,
      aspect: isBanner ? [1, 1] : undefined,
    });

    if (!result.canceled && result.assets) {
      setSelectedImages((prevImages) => [...prevImages, ...result.assets]);
    } else {
      console.log("Image picker was canceled or no assets selected.");
    }
  };

  const removeImage = (uri: string) => {
    setSelectedImages((prevImages) =>
      prevImages.filter((img) => img.uri !== uri)
    );
  };

  const handleLongPress = (uri: string) => {
    Alert.alert(
      "Remove Image",
      "Do you want to remove this image?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => removeImage(uri),
        },
      ],
      { cancelable: true }
    );
  };

  const openImageModal = async (uri: string) => {
    const base64Uri = await convertToBase64(uri);
    if (base64Uri) {
      setBase64Image(base64Uri);
      setIsImagePreviewVisible(true);
    }
  };

  return (
    <>
      <View
        className={`flex-row h-auto w-full border-2 border-primary bg-background rounded-lg p-2 space-y-2 ${containerStyles}`}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={true}
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {selectedImages.length > 0 ? (
            selectedImages.map((asset, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => openImageModal(asset.uri)}
                onLongPress={() => handleLongPress(asset.uri)}
              >
                <Image
                  source={{ uri: asset.uri }}
                  className="w-32 h-32 rounded-lg mr-2 border border-gray-300"
                />
              </TouchableOpacity>
            ))
          ) : (
            <Text className="p-2 text-base text-gray-500">
              No images selected
            </Text>
          )}
        </ScrollView>
        <CustomButton
          title={
            selectedImages.length === 0
              ? isBanner
                ? "Add a Banner"
                : "Add an Image"
              : ""
          }
          handlePress={pickImage}
          containerStyles={`py-1 border-2 border-primary ${
            isBanner && selectedImages.length != 0 ? "hidden" : "visible"
          }`}
          textStyles="text-primary"
          withBackground={false}
          imageOnly={selectedImages.length === 0 ? undefined : icons.add}
          imageStyles="w-10 h-28"
          iconTint={colors.primary}
        />
      </View>

      {/* Modal to show the image in full screen */}
      <Modal
        visible={isImagePreviewVisible}
        transparent={false}
        animationType="slide"
      >
        <TouchableOpacity
          className="flex-1 absolute items-center"
          onPress={() => setIsImagePreviewVisible(false)}
        />
        <View className="bg-black w-full h-full relative">
          <WebView
            originWhitelist={["*"]}
            source={{ html: getHTMLImageRender(base64Image!) }}
            scalesPageToFit={true}
            bounces={true}
            showsVerticalScrollIndicator={false}
          />
          <View className="absolute top-0 w-full h-16 bg-black opacity-70" />
          <CustomButton
            handlePress={() => setIsImagePreviewVisible(false)}
            imageOnly={icons.back}
            imageStyles="h-6 w-6"
            iconTint="#fff"
            withBackground={false}
            containerStyles="absolute top-5 left-0"
          />
        </View>
      </Modal>
    </>
  );
};

export default PhotoPicker;
