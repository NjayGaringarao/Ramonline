import { Modal, TouchableOpacity, View, Image } from "react-native";
import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import { ImagePickerAsset, launchImageLibraryAsync } from "expo-image-picker";
import { convertToBase64, getHTMLImageRender } from "@/lib/commonUtil";
import WebView from "react-native-webview";
import CustomButton from "./CustomButton";
import { colors, icons } from "@/constants";
import { getImagePreview } from "@/services/commonServices";
import { UserType } from "@/types/models";

interface ProfilePicturePickerType {
  containerStyle?: string;
  userInfo: UserType.Info;
  imageStyle?: string;
  setNewProfilePicture: (image: ImagePickerAsset | undefined) => void;
  newProfilePicture: ImagePickerAsset | undefined;
}

const ProfilePicturePicker = forwardRef(
  (
    {
      containerStyle,
      userInfo,
      setNewProfilePicture,
      newProfilePicture,
      imageStyle,
    }: ProfilePicturePickerType,
    ref
  ) => {
    const [pickerImage, setPickerImage] = useState<
      ImagePickerAsset | undefined
    >();
    const [imageSource, setImageSource] = useState<string | undefined>();
    const [isImagePreviewVisible, setIsImagePreviewVisible] = useState(false);

    const clearHandle = () => {
      setPickerImage(undefined);
      setImageSource(
        userInfo.picture_id
          ? getImagePreview(userInfo.picture_id)
          : userInfo.avatar_url!
      );
      setNewProfilePicture(undefined);
    };

    const pickImagehandle = async (): Promise<void> => {
      const result = await launchImageLibraryAsync({
        mediaTypes: "images",
        quality: 1,
        allowsEditing: true,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets) {
        setPickerImage(result.assets[0]);
      } else {
        console.log("Image picker was canceled or no assets selected.");
      }
    };

    useEffect(() => {
      const changeSourceHandle = async () => {
        if (pickerImage) {
          setImageSource(await convertToBase64(pickerImage.uri));
          setNewProfilePicture(pickerImage);
        }
      };

      changeSourceHandle();
    }, [pickerImage]);

    // Expose the clearHandle function to the parent via ref
    useImperativeHandle(ref, () => ({
      clear: clearHandle,
    }));

    return (
      <>
        <TouchableOpacity
          onPress={() => setIsImagePreviewVisible(true)}
          onLongPress={pickImagehandle}
          className={`${containerStyle}`}
        >
          <Image className={imageStyle} source={{ uri: imageSource }} />
        </TouchableOpacity>
        {isImagePreviewVisible && (
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
                source={{
                  html: getHTMLImageRender(imageSource!),
                }}
                scalesPageToFit={true}
                bounces={true}
                showsVerticalScrollIndicator={false}
              />
              <View className="absolute top-0 w-full h-16 bg-black opacity-70" />
              <CustomButton
                handlePress={() => setIsImagePreviewVisible(false)}
                containerStyles="absolute top-5 left-0 bg-transparent"
              >
                <Image
                  source={icons.back}
                  className="h-6 w-6"
                  tintColor={"#fff"}
                />
              </CustomButton>
            </View>
          </Modal>
        )}

        {!!newProfilePicture && (
          <TouchableOpacity
            className="absolute top-2 -right-2 bg-gray-400 border-2 border-gray-400 rounded-full overflow-hidden"
            onPress={clearHandle}
          >
            <Image
              source={icons.close}
              className="h-6 w-6"
              tintColor={"#d1d5db"}
            />
          </TouchableOpacity>
        )}
      </>
    );
  }
);

export default ProfilePicturePicker;
