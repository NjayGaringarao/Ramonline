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
  const { userRecord, refreshUserRecord } = useGlobalContext();
  const [activeTab, setActiveTab] = useState("post");
  const [userPosts, setUserPosts] = useState<PostType.Info[]>([]);
  const [userLines, setUserLines] = useState<LineType.Info[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const updateUI = async () => {
      setUserPosts([]);
      setUserLines([]);
      setUserPosts(await sortByDate(userRecord.post.post_info));
      setUserLines(await sortByDate(userRecord.line.line_info));
      setIsRefreshing(false);
    };
    updateUI();
  }, [userRecord.post, userRecord.post]);

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
    <View className="h-full bg-background justify-center space-y-2">
      <Text className="text-3xl font-black">Profile</Text>
      {activeTab == "post" ? (
        <FlatList
          data={userPosts}
          keyExtractor={(item, index) => index.toString()}
          horizontal={false}
          className="flex-1"
          renderItem={({ item, index }) => {
            return <PostView post={item} isModifyable={true} />;
          }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <ProfileView
              userInfo={userRecord.info}
              setActiveTab={setActiveTab}
              userPostTotal={userPosts.length}
              userLineTotal={userLines.length}
            />
          }
          ListFooterComponent={
            isRefreshing ? null : userPosts.length == 0 ? null : (
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
          data={userLines}
          keyExtractor={(item, index) => index.toString()}
          horizontal={false}
          className="flex-1"
          renderItem={({ item, index }) => {
            return <LineView line={item} isModifyable={true} />;
          }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <ProfileView
              userInfo={userRecord.info}
              setActiveTab={setActiveTab}
              userPostTotal={userRecord.post.total}
              userLineTotal={userRecord.line.total}
            />
          }
          ListFooterComponent={
            isRefreshing ? null : userLines.length == 0 ? null : (
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
