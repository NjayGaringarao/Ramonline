import { useEffect, useState } from "react";
import { Text, View } from "react-native";
export default function Index() {
  const [variable, setVariable] = useState("");

  useEffect(() => {
    setVariable(process.env.APPWRITE_ENDPOINT!);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text className="text-xl">APPWRITE ENDPOINT :{` ${variable}`}</Text>
    </View>
  );
}
