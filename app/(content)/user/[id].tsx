import { View, Image, FlatList, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { router, useGlobalSearchParams } from "expo-router";
import { LineType, PostType, UserType } from "@/types/models";
import { getUserInfo } from "@/services/userServices";
import Toast from "react-native-root-toast";
import { getUserPostList } from "@/services/postServices";
import { getUserLineList } from "@/services/lineServices";
import CustomButton from "@/components/CustomButton";
import { icons } from "@/constants";
import Loading from "@/components/Loading";
import UserInfoView from "@/components/UserInfoView";
import FeedPostView from "@/components/PostView/FeedPostView";
import FeedLineView from "@/components/LineView/FeedLineView";
import { sortByDate } from "@/lib/commonUtil";

const user = () => {
  const searchParams = useGlobalSearchParams();
  const [user, setUser] = useState<UserType.Info>();
  const [postList, setPostList] = useState<PostType.Info[]>([]);
  const [lineList, setLineList] = useState<LineType.Info[]>([]);
  const [activeTab, setActiveTab] = useState("post");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const initialize = async (user_id: string) => {
    try {
      setIsRefreshing(true);
      const _user = await getUserInfo(user_id);
      setUser(_user);
      setPostList(sortByDate(await getUserPostList(_user.id)));
      setLineList(sortByDate(await getUserLineList(_user.id)));
    } catch (error) {
      Toast.show("There was an error loading user info");
    } finally {
      setIsRefreshing(false);
    }
  };
  const onRefreshHandle = () => {
    initialize(user?.id!);
  };

  useEffect(() => {
    if (searchParams.id) {
      initialize(searchParams.id.toString());
    }
  }, [searchParams]);

  if (user) {
    return (
      <View className="flex-1">
        <View className="h-14 w-full flex-row items-center bg-primary">
          <CustomButton
            handlePress={() => {
              router.back();
            }}
            containerStyles="bg-transparent"
          >
            <Image source={icons.back} className="h-6 w-6" tintColor={"#fff"} />
          </CustomButton>
        </View>

        <View className="h-full bg-background justify-center space-y-2">
          {activeTab == "post" ? (
            <FlatList
              data={postList}
              keyExtractor={(item, index) => index.toString()}
              horizontal={false}
              className="flex-1"
              renderItem={({ item, index }) => {
                return <FeedPostView post={item} />;
              }}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
                <UserInfoView
                  setActiveTab={setActiveTab}
                  userInfo={user}
                  userPostLength={postList.length}
                  userLineLength={lineList.length}
                />
              }
              ListFooterComponent={
                isRefreshing ? null : postList.length == 0 ? null : (
                  <View className="flex-1 bg-panel m-2 mb-16 rounded-lg overflow-hidden">
                    <Text className="text-xl text-primary font-semibold text-center py-12">
                      Nothing Follows.
                    </Text>
                  </View>
                )
              }
              ListEmptyComponent={
                isRefreshing ? (
                  <Loading
                    loadingPrompt="Fetching all your post"
                    containerStyles="pt-16"
                  />
                ) : (
                  <View className="flex-1 bg-panel m-2 mt-2 py-12 items-center rounded-lg overflow-hidden shadow-primary shadow-lg">
                    <Text className="text-xl text-primary font-semibold text-center pb-2 ">
                      ⚠️ YOU HAVE NO PUBLISHED POST ⚠️.
                    </Text>
                    <CustomButton
                      handlePress={() => {
                        router.push("/create/post");
                      }}
                      title="Post Something!"
                      containerStyles=" w-2/3"
                    />
                  </View>
                )
              }
              onRefresh={onRefreshHandle}
              refreshing={isRefreshing}
            />
          ) : (
            <FlatList
              data={lineList}
              keyExtractor={(item, index) => index.toString()}
              horizontal={false}
              className="flex-1"
              renderItem={({ item, index }) => {
                return <FeedLineView line={item} userInfo={user} />;
              }}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
                <UserInfoView
                  setActiveTab={setActiveTab}
                  userInfo={user}
                  userPostLength={postList.length}
                  userLineLength={lineList.length}
                />
              }
              ListFooterComponent={
                isRefreshing ? null : lineList.length == 0 ? null : (
                  <View className="flex-1 bg-panel m-2 mb-16 rounded-lg overflow-hidden">
                    <Text className="text-xl text-primary font-semibold text-center py-12">
                      Nothing Follows.
                    </Text>
                  </View>
                )
              }
              ListEmptyComponent={
                isRefreshing ? (
                  <Loading
                    loadingPrompt="Fetching all your lines"
                    containerStyles="pt-16"
                  />
                ) : (
                  <View className="flex-1 bg-panel m-2 mt-2 py-12 items-center rounded-lg overflow-hidden shadow-primary shadow-lg">
                    <Text className="text-xl text-primary font-semibold text-center pb-2 ">
                      ⚠️ YOU DO NOT OWN A SINGLE LINE ⚠️.
                    </Text>
                    <CustomButton
                      handlePress={() => {
                        router.push("/create/line");
                      }}
                      title="Create One!"
                      containerStyles=" w-2/3"
                    />
                  </View>
                )
              }
              onRefresh={onRefreshHandle}
              refreshing={isRefreshing}
            />
          )}
        </View>
      </View>
    );
  } else {
    return (
      <View className="flex-1 bg-black">
        <Loading loadingPrompt="Please wait" color="#fff" />
      </View>
    );
  }
};

export default user;
