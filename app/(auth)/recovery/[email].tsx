import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import CustomButton from "@/components/CustomButton";
import TextBox from "@/components/TextBox";
import { colors, images } from "@/constants";
import * as Linking from "expo-linking";
import { router, useGlobalSearchParams } from "expo-router";
import { regex } from "@/constants/regex";
import { requestRecovery } from "@/services/userServices";
import Collapsible from "@/components/Collapsible";
import { useGlobalContext } from "@/context/GlobalProvider";

const Recovery = () => {
  const { isInternetConnection } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [form, setForm] = useState({ email: "" });
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [inputValidity, setInputValidity] = useState({ email: false });
  const [promptVisibility, setPromptVisibility] = useState({ email: false });
  const [prompt, setPrompt] = useState(
    "Enter the email that is associated with the account you would want to recover."
  );
  const url = Linking.useURL();
  const searchParams = useGlobalSearchParams();

  const emailTextChangeHandle = (text: string) => {
    !promptVisibility.email &&
      setPromptVisibility({ ...promptVisibility, email: true });
    const email = text.trim().replace(" ", "");
    setForm({ ...form, email });
    setInputValidity({ email: regex.email.test(email) });
  };

  const requestVerificationHandle = async () => {
    try {
      setIsLoading(true);

      await requestRecovery(form.email);

      setCooldown(300);
      setIsVerificationSent(true);
      setPrompt(`We've sent a verification link to your email:`);
      console.log(`Password recovery link sent`);
    } catch (error) {
      setPrompt(
        "There was an error sending recovery to the email. Please try again later or contact support."
      );
      console.error("Error sending recovery email:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Handle cooldown timer
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }

    if (cooldown == 0 && isVerificationSent) {
      setPrompt("Didn't receive the email? Resend Recovery.");
    }

    return () => clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    if (url) {
      const { queryParams } = Linking.parse(url);

      console.log(queryParams);
      if (queryParams?.email?.toString() == form.email) {
        router.back();
      }
    } else if (searchParams) {
      if (searchParams.email === "null") {
        emailTextChangeHandle("");
      } else {
        emailTextChangeHandle(searchParams.email.toString());
      }

      if (searchParams.isFormDisabled.toString() == "true") {
        setIsFormDisabled(true);
      }
    }
  }, [url, searchParams]);

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
          <View className="space-y-3">
            <Text className="text-5xl text-primary font-bold">
              Recover Your Account
            </Text>

            <Text
              className="text-lg text-uBlack mb-1"
              style={{ lineHeight: 25 }}
            >
              {prompt}
            </Text>

            <View className="w-full">
              <TextBox
                textValue={form.email}
                placeholder="ramonian@gmail.com"
                handleChangeText={emailTextChangeHandle}
                titleTextStyles="text-uGray text-base font-semibold"
                textInputStyles="text-base text-uBlack"
                boxStyles="w-full bg-panel rounded-lg border-primary border-[1px]"
                isDisabled={cooldown > 0 || isFormDisabled}
              />
              <Text
                className={`mt-1 text-sm text-red-600 font-semibold text-right ${
                  !(!inputValidity.email && promptVisibility.email)
                    ? "hidden"
                    : "visible"
                }`}
                style={{ lineHeight: 14 }}
              >
                *Email should be a valid email address.
              </Text>
            </View>

            <View className="w-full items-end my-4">
              <CustomButton
                title={
                  cooldown > 0
                    ? `Resend in ${cooldown}s`
                    : isVerificationSent
                    ? "Resend Password Reset"
                    : "Send Password Reset"
                }
                handlePress={requestVerificationHandle}
                containerStyles="h-10"
                isLoading={
                  isLoading ||
                  cooldown > 0 ||
                  !inputValidity.email ||
                  !isInternetConnection
                }
              />
            </View>
          </View>
          <View>
            <Text className="text-uBlack text-2xl font-semibold mb-3">
              Frequently Asked Questions
            </Text>
            <ScrollView className="max-h-80">
              <Collapsible
                title="1. How do I recover my account?"
                childrenContainerStyle="ml-10"
              >
                <Text
                  className="text-base font-mono text-uBlack"
                  style={{ lineHeight: 22 }}
                >
                  To recover your account, you need to request a password reset.
                  Click on "Send Password Reset", and we'll send a link to the
                  given email. Follow the instructions in the email to reset
                  your password and regain access to your account.
                </Text>
              </Collapsible>

              <Collapsible
                title="2. What if I didn’t receive the email?"
                childrenContainerStyle="ml-10"
              >
                <Text
                  className="text-base font-mono text-uBlack"
                  style={{ lineHeight: 22 }}
                >
                  If you don’t see the recovery email, please check your spam or
                  junk folder. If you still can't find it, try resending the
                  recovery email. Note: Only the most recent recovery email is
                  valid, so ensure you use the latest one.
                </Text>
              </Collapsible>

              <Collapsible
                title="3. I can’t remember which email I used. What should I do?"
                childrenContainerStyle="ml-10"
              >
                <Text
                  className="text-base font-mono text-uBlack"
                  style={{ lineHeight: 22 }}
                >
                  Unfortunately, you cannot recover your account alone without
                  your email address. If you can't remember which email you
                  used, Contact the developer for assistance.
                </Text>
              </Collapsible>

              <Collapsible
                title="4. How do I ensure my account stays secure after recovery?"
                childrenContainerStyle="ml-10"
              >
                <Text
                  className="text-base font-mono text-uBlack"
                  style={{ lineHeight: 22 }}
                >
                  After recovering your account through password reset link,
                  make sure to update your password with a strong, unique one.
                </Text>
              </Collapsible>

              <Collapsible
                title="5. Is there other way to login?"
                childrenContainerStyle="ml-10"
              >
                <Text
                  className="text-base font-mono text-uBlack"
                  style={{ lineHeight: 22 }}
                >
                  You can also login password less via email OTP. You will find
                  this on login page.
                </Text>
              </Collapsible>
            </ScrollView>
          </View>
        </View>

        <View className="absolute bottom-0 w-full justify-end items-center flex-row px-4 py-2 bg-panel">
          <CustomButton
            title={isFormDisabled ? "Done" : "Login"}
            handlePress={() => {
              router.back();
            }}
            containerStyles="w-24 h-10"
            isLoading={
              isLoading || !isVerificationSent || !isInternetConnection
            }
          />
        </View>
      </View>

      <StatusBar backgroundColor={colors.background} style="auto" />
    </>
  );
};

export default Recovery;

/*
* The Recommended way of mounting Recovery Page:
*
* import { Link } from 'expo-router';
*
// <Link
//   href={{
//     pathname: "/(auth)/recovery/[email]",
//     params: {
//       email: form.email.length ? form.email : "null",
//       isFormDisabled: "false",
//     },
//   }}
// >
//   <Text className="text-primary text-base font-semibold mt-1">
//     Forget Password?
//   </Text>
// </Link>
*
*/
