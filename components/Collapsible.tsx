import Ionicons from "@expo/vector-icons/Ionicons";
import { PropsWithChildren, ReactNode, useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";

interface ICollapsibleType {
  children: ReactNode;
  title: string;
  titleStyle?: string;
  containerStyle?: string;
  childrenContainerStyle?: string;
}

const Collapsible = ({
  children,
  title,
  titleStyle,
  containerStyle,
  childrenContainerStyle,
}: ICollapsibleType) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View className={`my-1 ${containerStyle}`}>
      <TouchableOpacity
        className="flex-row items-center"
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}
      >
        <Ionicons
          name={isOpen ? "chevron-down" : "chevron-forward-outline"}
          size={18}
          color={"light"}
        />
        <Text className={`text-uGray text-lg font-semibold ${titleStyle}`}>
          {title}
        </Text>
      </TouchableOpacity>
      {isOpen && (
        <View className={`ml-5 mt-2 ${childrenContainerStyle}`}>
          {children}
        </View>
      )}
    </View>
  );
};

export default Collapsible;
