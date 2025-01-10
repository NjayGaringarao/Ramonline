import { View, Text } from "react-native";
import React, { useState } from "react";
import TextBox from "../TextBox";
import CustomButton from "../CustomButton";
import { UserType } from "@/types/models";
import { regex } from "@/constants/regex";
import { Link } from "expo-router";
import Loading from "../Loading";
import { changePassword } from "@/services/userServices";
import Toast from "react-native-root-toast";
import { confirmAction } from "@/lib/commonUtil";
import { Models } from "react-native-appwrite";

interface ICredentialSectionType {
  user: Models.User<Models.Preferences>;
  userInfo: UserType.Info;
}

const CredentialSection = ({ user, userInfo }: ICredentialSectionType) => {
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confPassword: "",
  });

  const [inputValidity, setInputValidity] = useState({
    newPassword: false,
    confPassword: true,
  });

  const [promptVisibility, setPromptVisibility] = useState({
    newPassword: false,
    confPassword: true,
  });

  const oldPasswordTextChangeHandle = (password: string) => {
    setForm({ ...form, oldPassword: password });

    setInputValidity((prev) => ({
      ...prev,
      newPassword:
        regex.password.test(password) && form.oldPassword != password,
    }));
  };

  const newPasswordTextChangeHandle = (password: string) => {
    !promptVisibility.newPassword &&
      setPromptVisibility({ ...promptVisibility, newPassword: true });

    setForm({ ...form, newPassword: password });

    setInputValidity((prev) => ({
      ...prev,
      newPassword:
        regex.password.test(password) && form.oldPassword != password,
      confPassword: password === form.confPassword,
    }));
  };

  const confTextChangeHandle = (text: string) => {
    setForm({ ...form, confPassword: text });
    setInputValidity({
      ...inputValidity,
      confPassword: text === form.newPassword,
    });
  };

  const handleUpdate = async () => {
    if (!(await confirmAction("Confirm Changes", "Update your password?")))
      return;
    try {
      setIsLoading(true);
      await changePassword(form.oldPassword, form.newPassword);
      Toast.show(`Succesfully update password.`, {
        duration: Toast.durations.LONG,
      });
    } catch (error: any) {
      Toast.show(`Failed : ${error.message}`, {
        duration: Toast.durations.LONG,
      });
    } finally {
      setIsLoading(false);
      setForm(Object);
    }
  };

  return (
    <View className="space-y-2 w-full mb-4">
      <TextBox
        title="Email (can't be change)"
        titleTextStyles="text-uGray text-sm font-semibold"
        textValue={user.email}
        placeholder="ramonian@gmail.com"
        textInputStyles="text-base"
        handleChangeText={() => {}}
        boxStyles="w-full py-1 bg-panel rounded-lg px-4 border border-primary"
        containerStyles="pb-1"
        isDisabled
        isPassword
      />
      <View className="items-end w-full">
        <TextBox
          title="Old Password"
          titleTextStyles="text-uGray text-sm font-semibold"
          textValue={form.oldPassword}
          placeholder="#ramonianAsOne!"
          textInputStyles="text-base"
          handleChangeText={oldPasswordTextChangeHandle}
          boxStyles="w-full py-1 bg-panel rounded-lg px-4 border border-primary"
          containerStyles="pb-1"
          isPassword
        />
        {!isLoading && (
          <Link
            href={{
              pathname: "/(auth)/recovery/[email]",
              params: {
                email: user.email,
                isFormDisabled: "true",
              },
            }}
          >
            <Text className="text-primary text-sm font-semibold mt-1">
              Forget Password?
            </Text>
          </Link>
        )}
      </View>

      <View className="items-end w-full">
        <TextBox
          title="New Password"
          titleTextStyles="text-uGray text-sm font-semibold"
          textValue={form.newPassword}
          placeholder="#myPRMSU@Casti"
          textInputStyles="text-base"
          handleChangeText={newPasswordTextChangeHandle}
          boxStyles="w-full py-1 bg-panel rounded-lg px-4 border border-primary"
          containerStyles="pb-1"
          isPassword
        />
        <Text
          className={`mt-1 text-xs text-red-600 font-semibold text-right ${
            !(!inputValidity.newPassword && promptVisibility.newPassword)
              ? "hidden"
              : "visible"
          }`}
          style={{ lineHeight: 12 }}
        >
          *Password should be more than 8 characters long containing
          alphanumeric and other special characters{" (_!@#$%^&.,) "}. It should
          also not be the same with the old password
        </Text>
      </View>
      <View className="w-full items-end">
        <TextBox
          title="Confirm Password"
          textValue={form.confPassword}
          placeholder="#myPRMSU@Casti"
          handleChangeText={confTextChangeHandle}
          isPassword={true}
          titleTextStyles="text-uGray text-sm font-semibold"
          textInputStyles="text-base text-uBlack"
          boxStyles="w-full py-1 bg-panel rounded-lg border border-primary"
        />
        <Text
          className={`mt-1 text-xs text-red-600 font-semibold text-right ${
            inputValidity.confPassword ? "hidden" : "visible"
          }`}
          style={{ lineHeight: 12 }}
        >
          *Password does not match.
        </Text>
      </View>
      {Object.values(form).some((value) => value.trim().length > 0) && (
        <CustomButton
          title="Update"
          handlePress={handleUpdate}
          containerStyles={`py-1 self-end mt-3 `}
          isLoading={isLoading || !Object.values(inputValidity).every(Boolean)}
        />
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

export default CredentialSection;
