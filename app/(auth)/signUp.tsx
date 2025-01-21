import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import { Alert, Text, View, Image } from "react-native";
import { useState } from "react";
import { createAccount, getCurrentUser } from "@/services/userServices";
import { useGlobalContext } from "@/context/GlobalProvider";
import Loading from "@/components/Loading";
import { getFCMToken, setupPushTarget } from "@/services/notificationServices";
import { StatusBar } from "expo-status-bar";
import { colors, images } from "@/constants";
import TextBox from "@/components/TextBox";
import { regex } from "@/constants/regex";

const signUp = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setUser, refreshUserRecord, isInternetConnection } =
    useGlobalContext();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confPassword: "",
  });

  const [inputValidity, setInputValidity] = useState({
    username: false,
    email: false,
    password: false,
    confPassword: true,
  });

  const [promptVisibility, setPromptVisibility] = useState({
    username: false,
    email: false,
    password: false,
  });

  const signUpHandle = async () => {
    setIsSubmitting(true);

    try {
      const isSuccess = await createAccount(
        form.username,
        form.email,
        form.password
      );

      if (isSuccess) {
        const user = await getCurrentUser();

        if (user == undefined) throw Error;

        setUser(user);
        refreshUserRecord({
          info: true,
          line: true,
          post: true,
          notification: true,
        });

        router.replace("/(auth)/verification");
      }
    } catch (error) {
      Alert.alert("Failed", `${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const usernameTextChangeHandle = (text: string) => {
    !promptVisibility.username &&
      setPromptVisibility({ ...promptVisibility, username: true });
    const username = text.trim().replace(" ", "");
    setForm({ ...form, username: username });
    setInputValidity({
      ...inputValidity,
      username: regex.username.test(username),
    });
  };

  const emailTextChangeHandle = (text: string) => {
    !promptVisibility.email &&
      setPromptVisibility({ ...promptVisibility, email: true });
    const email = text.trim().replace(" ", "");
    setForm({ ...form, email: email });
    setInputValidity({ ...inputValidity, email: regex.email.test(email) });
  };

  const passwordTextChangeHandle = (password: string) => {
    !promptVisibility.password &&
      setPromptVisibility({ ...promptVisibility, password: true });

    setForm({ ...form, password: password });

    setInputValidity((prev) => ({
      ...prev,
      password: regex.password.test(password),
      confPassword: password === form.confPassword,
    }));
  };

  const confTextChangeHandle = (text: string) => {
    setForm({ ...form, confPassword: text });
    setInputValidity({
      ...inputValidity,
      confPassword: text === form.password,
    });
  };

  return (
    <View className="flex-1 h-full w-full justify-center bg-background dark:bg-darkBackground">
      {isSubmitting ? (
        <Loading
          loadingPrompt="Verifying Everything"
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
          isSubmitting ? "opacity-10 blur-3xl" : ""
        } px-8 items-start flex-1 justify-center gap-2`}
      >
        <View className="w-full items-center">
          <Image source={images.logo} className="h-64 w-64" />
        </View>
        <Text className="text-4xl text-primary font-bold mb-2 mt-2">
          Create Account
        </Text>

        <View className="w-full items-end">
          <TextBox
            title="Username"
            textValue={form.username}
            placeholder="user@123"
            handleChangeText={usernameTextChangeHandle}
            titleTextStyles="text-uGray text-base font-semibold"
            textInputStyles="text-base text-uBlack"
            boxStyles="w-full py-1 bg-panel rounded-lg border-primary border-[1px]"
          />
          <Text
            className={`mt-1 text-xs text-red-600 font-semibold text-right ${
              !(!inputValidity.username && promptVisibility.username)
                ? "hidden"
                : "visible"
            }`}
            style={{ lineHeight: 12 }}
          >
            *Username should be 5 to 20 characters long. It can be a mix of
            alphanumeric and other special characters{" (_!@#$%^&) "}.
          </Text>
        </View>

        <View className="w-full items-end">
          <TextBox
            title="Email"
            textValue={form.email}
            placeholder="ramonian@gmail.com"
            handleChangeText={emailTextChangeHandle}
            titleTextStyles="text-uGray text-base font-semibold"
            textInputStyles="text-base text-uBlack"
            boxStyles="w-full py-1 bg-panel rounded-lg border-primary border-[1px]"
          />
          <Text
            className={`mt-1 text-xs text-red-600 font-semibold text-right ${
              !(!inputValidity.email && promptVisibility.email)
                ? "hidden"
                : "visible"
            }`}
            style={{ lineHeight: 12 }}
          >
            *Email should be a valid email address.
          </Text>
        </View>

        <View className="w-full items-end">
          <TextBox
            title="Password"
            textValue={form.password}
            placeholder="#ramonianAsOne!"
            handleChangeText={passwordTextChangeHandle}
            isPassword={true}
            titleTextStyles="text-uGray text-base font-semibold"
            textInputStyles="text-base text-uBlack"
            boxStyles="w-full py-1 bg-panel rounded-lg border-primary border-[1px]"
          />
          <Text
            className={`mt-1 text-xs text-red-600 font-semibold text-right ${
              !(!inputValidity.password && promptVisibility.password)
                ? "hidden"
                : "visible"
            }`}
            style={{ lineHeight: 12 }}
          >
            *Password should be more than 8 characters long containing
            alphanumeric and other special characters{" (_!@#$%^&.,) "}.
          </Text>
        </View>

        <View className="w-full items-end">
          <TextBox
            title="Confirm Password"
            textValue={form.confPassword}
            placeholder="#ramonianAsOne!"
            handleChangeText={confTextChangeHandle}
            isPassword={true}
            titleTextStyles="text-uGray text-base font-semibold"
            textInputStyles="text-base text-uBlack"
            boxStyles="w-full py-1 bg-panel rounded-lg border-primary border-[1px]"
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

        <View className="w-full items-center">
          <CustomButton
            title="Continue"
            handlePress={signUpHandle}
            containerStyles="mt-2 w-full "
            isLoading={
              isSubmitting ||
              !Object.values(inputValidity).every(Boolean) ||
              !isInternetConnection
            }
          />
          <Text
            className="py-2 text-primary text-lg font-bold"
            onPress={() => router.navigate("/signIn")}
          >
            Have an account? Login.
          </Text>
        </View>
      </View>
      <StatusBar backgroundColor={colors.background} style="auto" />
    </View>
  );
};

export default signUp;
