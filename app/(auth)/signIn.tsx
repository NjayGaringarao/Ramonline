import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import { Text, View, Image } from "react-native";
import React, { useState } from "react";
import {
  getCurrentUser,
  getUserInfo,
  loginAccount,
} from "@/services/userServices";
import { useGlobalContext } from "@/context/GlobalContext";
import Loading from "@/components/Loading";
import { getFCMToken, setupPushTarget } from "@/services/notificationServices";
import { StatusBar } from "expo-status-bar";
import { colors, images } from "@/constants";
import TextBox from "@/components/TextBox";

const signIn = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setUser, refreshUserRecord } = useGlobalContext();
  const [form, setform] = useState({
    email: "",
    password: "",
  });

  const loginHandle = async () => {
    setIsSubmitting(true);

    try {
      const isLoginSuccess = await loginAccount(form.email, form.password);

      if (isLoginSuccess) {
        const user = await getCurrentUser();
        if (!user) throw Error;
        setUser(user);
        refreshUserRecord({
          info: true,
          activity: true,
          line: true,
          post: true,
          notification: true,
        });
        const fcmToken = await getFCMToken();
        await setupPushTarget(user, fcmToken!);
        if (!user.emailVerification) {
          router.replace("/(auth)/verification");
        } else {
          router.replace("/home");
        }
      }
    } catch (error) {
      console.log(`ERROR : (login.tsx => loginHandle) :: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <View className="h-full w-full bg-background">
        {isSubmitting ? (
          <Loading
            loadingPrompt="Logging In"
            containerStyles="items-center absolute bottom-0 left-0 right-0 top-0"
          />
        ) : (
          <Image
            source={images.gate}
            className="absolute h-full w-full opacity-20"
          />
        )}

        <View
          className={`${
            isSubmitting ? "opacity-10" : ""
          } items-start flex-1 justify-center gap-2 px-8`}
        >
          <View className="w-full items-center">
            <Image source={images.logo} className="h-64 w-64" />
          </View>
          <Text className="text-5xl text-primary font-bold mb-2 mt-2">
            Login
          </Text>
          <View className="w-full">
            <TextBox
              title="Email"
              textValue={form.email}
              placeholder="ramonian@gmail.com"
              handleChangeText={(e) => setform({ ...form, email: e })}
              titleTextStyles="text-uGray text-base font-semibold"
              textInputStyles="text-base text-uBlack"
              boxStyles="w-full bg-panel rounded-lg border-primary border-[1px]"
            />
          </View>
          <View className="w-full items-end">
            <TextBox
              title="Password"
              textValue={form.password}
              placeholder="#ramonianAsOne!"
              handleChangeText={(e) => setform({ ...form, password: e })}
              isPassword={true}
              titleTextStyles="text-uGray text-base font-semibold"
              textInputStyles="text-base text-uBlack"
              boxStyles="w-full bg-panel rounded-lg border-primary border-[1px]"
            />

            <Link
              href={{
                pathname: "/(auth)/recovery/[email]",
                params: {
                  email: form.email.length ? form.email : "null",
                  isFormDisabled: "false",
                },
              }}
            >
              <Text className="text-primary text-base font-semibold mt-1">
                Forget Password?
              </Text>
            </Link>
          </View>
          <View className="w-full items-center">
            <CustomButton
              title="Login"
              handlePress={loginHandle}
              containerStyles="mt-2 w-full "
              isLoading={isSubmitting}
            />
            <Text
              className="py-2 text-primary text-lg font-bold"
              onPress={() => router.navigate("/signUp")}
            >
              No account? Create One!
            </Text>
          </View>

          <View className="w-full items-center"></View>
        </View>
      </View>
      <StatusBar backgroundColor={colors.background} style="auto" />
    </>
  );
};

export default signIn;
