import React, { useState } from "react";
import { Text, TouchableOpacity, View, ScrollView } from "react-native";
import { LineType } from "@/types/models";

type IDescriptionProps = {
  line: LineType.Info;
  isInModal?: boolean;
};

const DescriptionView: React.FC<IDescriptionProps> = ({ line, isInModal }) => {
  if (!line.description) return null;

  // Handling long captions
  const isLongCaption = line.description.length > 150;
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  // Logic for displaying the description
  if (!isLongCaption) {
    return (
      <View className="mx-4 py-2 mb-2">
        <Text className="text-base text-justify">{line.description}</Text>
      </View>
    );
  } else if (isLongCaption && isInModal) {
    const displayedCaption = isExpanded
      ? line.description
      : `${line.description.slice(0, 100)}...`;

    return (
      <TouchableOpacity onPress={toggleExpand} className="mx-4 py-2 mb-2">
        <Text className="text-base text-left font-normal border-t border-primary">
          {displayedCaption}
          <Text className="font-semibold">
            {isExpanded ? " Show Less" : " Show More"}
          </Text>
        </Text>
      </TouchableOpacity>
    );
  } else if (isLongCaption && !isInModal) {
    const displayedCaption = isExpanded
      ? line.description
      : `${line.description.slice(0, 150)}...`;

    return (
      <TouchableOpacity
        onPress={toggleExpand}
        className="mx-4 rounded-lg py-2 mb-2"
      >
        <Text className="text-base text-left font-normal border-t border-primary">
          {displayedCaption}
          <Text className="font-semibold">
            {isExpanded ? " Show Less" : " Show More"}
          </Text>
        </Text>
      </TouchableOpacity>
    );
  } else if (!isLongCaption && isInModal) {
    return (
      <ScrollView
        showsVerticalScrollIndicator={true}
        className="mx-4 py-2 mb-2"
      >
        <Text className="text-base text-left font-normal">
          {line.description}
        </Text>
      </ScrollView>
    );
  } else {
    return (
      <View className="mx-4 max-h-32">
        <Text className="pl-4 text-base">{line.description}</Text>
      </View>
    );
  }
};

export default DescriptionView;
