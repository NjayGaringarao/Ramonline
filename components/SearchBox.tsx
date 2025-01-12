import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TextInputProps,
  Image,
} from "react-native";
import React from "react";
import { colors, icons } from "../constants";

interface SearchBoxProps extends TextInputProps {
  title?: string;
  titleTextStyles?: string;
  textValue: string;
  textInputStyles?: string;
  handleChangeText: (text: string) => void;
  placeholderValue?: string;
  placeholderTextStyles?: string;
  containerStyles?: string;
  boxStyles?: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  title,
  titleTextStyles,
  textValue,
  textInputStyles,
  handleChangeText,
  placeholderValue,
  placeholderTextStyles,
  containerStyles = "",
  boxStyles = "",
  ...props
}) => {
  return (
    <View className={containerStyles}>
      {title && (
        <Text className={`${titleTextStyles} ${title ? "" : "hidden"}`}>
          {title}
        </Text>
      )}

      <View className={`${boxStyles} flex-row items-center justify-between`}>
        <TextInput
          className={`flex-1 ${textInputStyles}`}
          value={textValue}
          placeholder={placeholderValue}
          placeholderTextColor={placeholderTextStyles || "#374151"}
          onChangeText={handleChangeText}
          style={{ textAlignVertical: "center" }}
          {...props}
        />

        {textValue.length != 0 ? (
          <TouchableOpacity onPress={() => handleChangeText("")}>
            <Image
              source={icons.close}
              className="w-3 h-3"
              resizeMode="contain"
              tintColor={"#374151"}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

export default SearchBox;
