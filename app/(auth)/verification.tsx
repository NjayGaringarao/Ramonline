import React, { useEffect, useState } from "react";
import { View, Text, Alert, ScrollView, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import CustomButton from "@/components/CustomButton";
import { colors, icons, images } from "@/constants";
import { useGlobalContext } from "@/context/GlobalContext";
import { confirmAction } from "@/lib/commonUtil";
import { deletePushTarget } from "@/services/notificationServices";
import {
  getCurrentUser,
  logoutUser,
  requestVerification,
} from "@/services/userServices";
import * as Linking from "expo-linking";
import Collapsible from "@/components/Collapsible";
import { Models } from "react-native-appwrite";
import { router } from "expo-router";

const Verification = () => {
  const { setUser, user, refreshUserRecord } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [prompt, setPrompt] = useState(
    `Request verification to your email: ${user?.email}`
  );

  const url = Linking.useURL();

  const checkUserVerificationHandle = async () => {
    let user: Models.User<Models.Preferences> | undefined;

    try {
      setIsLoading(true);
      user = await getCurrentUser();
    } catch (error) {
      Alert.alert(
        "Error",
        "There was an error checking your verification status."
      );
      setIsLoading(false);
      return;
    }

    if (user && user.emailVerification) {
      setUser(user);
      refreshUserRecord({
        info: true,
        line: true,
        post: true,
        notification: true,
      });
      router.replace("/(tabs)/home");
    } else {
      Alert.alert(
        "Not Verified",
        `Verify your account through the email we sent to you`
      );
      setIsLoading(false);
    }
  };

  const requestVerificationHandle = async () => {
    if (cooldown > 0) return;

    try {
      setIsLoading(true);
      await requestVerification();
      setPrompt(`We've sent a verification link to your email: ${user?.email}`);
      setIsVerificationSent(true);
      console.log("Verification email sent!");

      setCooldown(300); // 5 minutes in seconds
    } catch (error) {
      setPrompt(
        `There was an error sending verification link to your email: ${user?.email}. Please try again later or contact support.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const logoutHandle = async () => {
    try {
      setIsLoading(true);
      const isConfirmed = await confirmAction(
        "Confirm Logout",
        "Logging out will not affect the verification process."
      );

      if (!isConfirmed) throw Error;
      await deletePushTarget();
      const isLoggedOut = await logoutUser();
      if (isLoggedOut) {
        setUser(null);
        router.replace("/signIn");
      } else {
        Alert.alert(
          "Error",
          "Logout was unsuccessful. Please check your connection and restart the app."
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleDeepLink = async () => {
      if (!url) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      const { queryParams } = Linking.parse(url);
      if (queryParams?.userId && queryParams.userId === user?.$id.toString()) {
        console.log("Deep link matched. Checking verification status...");
        await checkUserVerificationHandle();
      } else {
        setPrompt("Invalid or mismatched verification link.");
      }

      setIsLoading(false);
    };

    handleDeepLink();
  }, [url]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  return (
    <>
      <View className="flex-1 items-center justify-center bg-background">
        <Image
          source={images.prmsu}
          className="absolute top-10 right-4 h-36 w-36 opacity-10"
        />
        <Image
          source={images.gate}
          className="absolute h-full w-full opacity-10"
        />
        <View className="w-full px-4 flex-1 justify-center">
          <View className="mb-8 space-y-3">
            <Text className="text-5xl text-primary font-bold">
              Verify Your Account
            </Text>

            <Text
              className="text-lg text-uBlack mb-1"
              style={{
                lineHeight: 25,
              }}
            >
              {prompt}
            </Text>

            <View className="w-full items-end">
              <CustomButton
                title={
                  cooldown > 0
                    ? `Resend in ${cooldown}s`
                    : isVerificationSent
                    ? "Resend Verification"
                    : "Send Verification"
                }
                handlePress={requestVerificationHandle}
                containerStyles="h-10"
                isLoading={isLoading || cooldown > 0}
              />
            </View>
          </View>

          <View>
            <Text className="text-uBlack text-2xl font-semibold mb-3">
              Frequently Asked Questions
            </Text>
            <ScrollView className="max-h-80">
              <Collapsible
                title="1. Why do I need to verify my account?"
                childrenContainerStyle="ml-10"
              >
                <Text
                  className="text-base font-mono text-uBlack"
                  style={{ lineHeight: 22 }}
                >
                  Verifying your account will verify your email. Verified email
                  can be used to recover forgotten passwords. This also helps in
                  maintaining system integrity by deleting unverified accounts.
                </Text>
              </Collapsible>

              <Collapsible
                title="2. How does this work?"
                childrenContainerStyle="ml-10"
              >
                <Text
                  className="text-base font-mono text-uBlack text-justify"
                  style={{ lineHeight: 22 }}
                >
                  Upon pressing "Send Verification" an email with verification
                  link will be sent to your email. Open the link to your browser
                  to verify your account.
                </Text>
              </Collapsible>

              <Collapsible
                title="3. What if I didn’t receive the email?"
                childrenContainerStyle="ml-10"
              >
                <Text
                  className="text-base font-mono text-uBlack"
                  style={{ lineHeight: 22 }}
                >
                  Please check your spam or junk folder for the missing email.
                  If you still can't find it, resend the verification to have a
                  new one sent to you. Note: Only the most recent email is
                  valid, so make sure to use the latest one.
                </Text>
              </Collapsible>

              <Collapsible
                title="4. Can I change my email?"
                childrenContainerStyle="ml-10"
              >
                <Text
                  className="text-base font-mono text-uBlack"
                  style={{ lineHeight: 22 }}
                >
                  Unfortunately, you cannot change your email after creating an
                  account. To use a different email, create a new account. This
                  account will be automatically deleted on Friday at midnight if
                  it remains unverified.
                </Text>
              </Collapsible>
            </ScrollView>
          </View>
        </View>

        <View className="absolute bottom-0 w-full justify-between items-center flex-row px-4 py-2 bg-panel">
          <CustomButton
            handlePress={logoutHandle}
            containerStyles="h-10 w-10 rounded-full"
            isLoading={isLoading}
          >
            <Image
              source={icons.logout}
              className="h-7 w-7"
              tintColor={"#fff"}
            />
          </CustomButton>
          <CustomButton
            title="Done"
            handlePress={checkUserVerificationHandle}
            containerStyles="w-24 h-10"
            isLoading={isLoading || !isVerificationSent}
          />
        </View>
      </View>

      <StatusBar backgroundColor={colors.background} style="auto" />
    </>
  );
};

export default Verification;
