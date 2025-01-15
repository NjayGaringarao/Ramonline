import { View, Text, FlatList } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useGlobalContext } from "@/context/GlobalProvider";
import PostView from "@/components/PostView/PostView";
import { LineType, PostType } from "@/types/models";
import Loading from "@/components/Loading";
import ProfileView from "@/components/ProfileView";
import LineView from "@/components/LineView/LineView";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import { sortByDate } from "@/lib/commonUtil";

const profile = () => {
  const { userInfo, userPost, userLine, refreshUserRecord } =
    useGlobalContext();
  const [activeTab, setActiveTab] = useState("post");
  const [postList, setPostList] = useState<PostType.Info[]>([]);
  const [lineList, setLineList] = useState<LineType.Info[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const updateUI = async () => {
      setPostList(sortByDate(userPost));
      setLineList(sortByDate(userLine));
      setIsRefreshing(false);
    };
    updateUI();
  }, [userInfo]);

  useEffect(() => {
    setLineList(sortByDate(userLine));
  }, [userLine]);

  useEffect(() => {
    setPostList(sortByDate(userPost));
  }, [userPost]);

  const onRefreshHandle = useCallback(async () => {
    setIsRefreshing(true);
    refreshUserRecord({
      info: false,
      activity: false,
      line: true,
      post: true,
    });
  }, []);

  return (
    <View className="h-full bg-background justify-center space-y-2 mt-12">
      {activeTab == "post" ? (
        <FlatList
          data={postList}
          keyExtractor={(item, index) => index.toString()}
          horizontal={false}
          className="flex-1"
          renderItem={({ item, index }) => {
            return <PostView post={item} isModifyable={true} />;
          }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={<ProfileView setActiveTab={setActiveTab} />}
          ListFooterComponent={
            isRefreshing ? null : postList.length == 0 ? null : (
              <Text className="text-lg text-primary text-center py-16">
                Nothing Follows.
              </Text>
            )
          }
          ListEmptyComponent={
            isRefreshing ? (
              <Loading
                loadingPrompt="Fetching all your post"
                containerStyles="pt-16"
              />
            ) : (
              <View className="py-16 w-2/3 self-center">
                <Text className="text-lg text-primary text-center pb-2 ">
                  You haven't posted anything yet.
                </Text>
                <CustomButton
                  handlePress={() => {
                    router.push("/createPostPage");
                  }}
                  title="Create a Post"
                  containerStyles="h-12 w-30"
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
            return <LineView line={item} isModifyable={true} />;
          }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={<ProfileView setActiveTab={setActiveTab} />}
          ListFooterComponent={
            isRefreshing ? null : lineList.length == 0 ? null : (
              <Text className="text-lg text-primary text-center py-16">
                Nothing Follows.
              </Text>
            )
          }
          ListEmptyComponent={
            isRefreshing ? (
              <Loading
                loadingPrompt="Fetching all your lines"
                containerStyles="pt-16"
              />
            ) : (
              <View className="py-16 w-2/3 self-center">
                <Text className="text-lg text-primary text-center pb-2 ">
                  You haven't created any Line yet.
                </Text>
                <CustomButton
                  handlePress={() => {
                    router.push("/createLinePage");
                  }}
                  title="Create a Line"
                  containerStyles="h-12 w-30"
                />
              </View>
            )
          }
          onRefresh={onRefreshHandle}
          refreshing={isRefreshing}
        />
      )}
    </View>
  );
};

export default profile;
