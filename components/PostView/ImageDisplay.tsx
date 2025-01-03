import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { getImagePreview } from "@/services/commonServices"; // Assuming this utility is available.

type ImageDisplayProps = {
  imageIds: string[];
  onImagePress?: () => void;
};

const ImageDisplay = ({ imageIds, onImagePress }: ImageDisplayProps) => {
  if (imageIds.length === 1) {
    return (
      <TouchableOpacity onPress={onImagePress}>
        <Image
          source={{ uri: getImagePreview(imageIds[0]) }}
          className="w-full h-64 bg-panel"
          contentFit="cover"
        />
      </TouchableOpacity>
    );
  }

  if (imageIds.length === 2) {
    return (
      <TouchableOpacity onPress={onImagePress}>
        <View className="h-auto w-full flex-row">
          {imageIds.map((imageId, key) => (
            <Image
              key={key}
              source={{ uri: getImagePreview(imageId) }}
              className="w-1/2 h-64 bg-panel"
              contentFit="cover"
            />
          ))}
        </View>
      </TouchableOpacity>
    );
  }

  if (imageIds.length === 3) {
    return (
      <TouchableOpacity onPress={onImagePress}>
        <View className="relative h-auto w-full flex-row">
          {imageIds.slice(0, 2).map((imageId, key) => (
            <Image
              key={key}
              source={{ uri: getImagePreview(imageId) }}
              className="w-1/2 h-64 bg-panel"
              contentFit="cover"
            />
          ))}
          <View className="absolute right-0 h-64 w-1/2 justify-center items-center">
            <View className="absolute bg-primary h-full w-full opacity-50" />
            <Text className="text-white text-6xl font-black">+1</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  if (imageIds.length === 4) {
    return (
      <TouchableOpacity onPress={onImagePress}>
        <View className="relative h-auto w-full flex-row flex-wrap">
          {imageIds.map((imageId, key) => (
            <Image
              key={key}
              source={{ uri: getImagePreview(imageId) }}
              className="w-1/2 h-32 bg-panel"
              contentFit="cover"
            />
          ))}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onImagePress}>
      <View className="relative h-auto w-full flex-row flex-wrap">
        {imageIds.slice(0, 4).map((imageId, key) => (
          <Image
            key={key}
            source={{ uri: getImagePreview(imageId) }}
            className="w-1/2 h-32 bg-panel"
            contentFit="cover"
          />
        ))}
        {imageIds.length > 4 && (
          <View className="absolute right-0 bottom-0 h-32 w-1/2 justify-center items-center">
            <View className="absolute bg-primary h-full w-full opacity-50" />
            <Text className="text-white text-6xl font-black">
              +{imageIds.length - 4}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ImageDisplay;
