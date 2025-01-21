import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import CustomButton from "../CustomButton";
import { UserType } from "@/types/models";
import { AffiliationType } from "@/types/utils";
import { Picker } from "@react-native-picker/picker";
import RenderPicker from "./RenderPicker";
import { confirmAction } from "@/lib/commonUtil";
import Toast from "react-native-root-toast";
import Loading from "../Loading";
import { updateRole } from "@/services/userServices";
import { useGlobalContext } from "@/context/GlobalProvider";

interface IAffiliationSectionType {
  isInternetConnection: boolean;
}

const AffliationSection = ({
  isInternetConnection,
}: IAffiliationSectionType) => {
  const { userInfo, refreshUserRecord } = useGlobalContext();
  const [dimensions, setDimensions] = useState<AffiliationType>(Object);
  const [isLoading, setIsLoading] = useState(false);

  const resetHandle = () => {
    setDimensions({
      first: userInfo.role[0] || null,
      second: userInfo.role[1] || null,
      third: userInfo.role[2] || null,
      year: userInfo.role[3] || null,
    });
  };

  useEffect(() => {
    resetHandle();
  }, [userInfo]);

  const handleUpdate = async () => {
    if (
      !(await confirmAction(
        "Confirm Changes",
        "Save changes that you've made?"
      ))
    )
      return;

    try {
      setIsLoading(true);
      if (!(await updateRole(userInfo.id, dimensions))) {
        throw Error;
      }

      Toast.show(`Succesfully applied changes.`, {
        duration: Toast.durations.LONG,
      });
      refreshUserRecord({
        info: true,
      });
    } catch (error) {
      Toast.show(`Failed to save changes.`, {
        duration: Toast.durations.LONG,
      });
      resetHandle();
    }
  };

  useEffect(() => {
    setIsLoading(false);
  }, [userInfo]);

  return (
    <View className="mb-4">
      <View>
        {/* First-Level Picker */}
        <Text className="text-uGray text-sm font-bold">Select Role</Text>
        <View className="h-9 rounded-lg justify-center bg-panel">
          <Picker
            selectedValue={dimensions.first}
            onValueChange={(itemValue) =>
              setDimensions({
                first: itemValue,
                second: null,
                third: null,
                year: null,
              })
            }
            mode="dropdown"
          >
            <Picker.Item label="Insider" value={null} />
            <Picker.Item label="Teaching Staff" value="Teaching Staff" />
            <Picker.Item
              label="Non-Teaching Staff"
              value="Non-Teaching Staff"
            />
            <Picker.Item label="Student" value="Student" />
          </Picker>
        </View>
      </View>
      {/* Render the second, third, and fourth levels */}
      {dimensions.first && (
        <RenderPicker dimensions={dimensions} setDimensions={setDimensions} />
      )}

      {!(
        dimensions.first === (userInfo.role[0] || null) &&
        dimensions.second === (userInfo.role[1] || null) &&
        dimensions.third === (userInfo.role[2] || null) &&
        dimensions.year === (userInfo.role[3] || null)
      ) && (
        <View className="self-end mt-2 flex-row">
          <CustomButton
            title="Update"
            handlePress={handleUpdate}
            containerStyles="py-1"
            isLoading={isInternetConnection}
          />
          <CustomButton
            title="Reset"
            handlePress={resetHandle}
            containerStyles="ml-2 py-1 border-2 border-primary bg-transparent"
            textStyles="text-primary"
          />
        </View>
      )}

      {isLoading && (
        <View className="absolute items-center justify-center h-full w-full">
          <View className="absolute h-full w-full bg-panel opacity-90"></View>
          <Loading
            loadingPrompt="Applying Changes"
            containerStyles="absolute"
          />
        </View>
      )}
    </View>
  );
};

export default AffliationSection;
