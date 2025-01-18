import { View, Text, FlatList, Alert, Image } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { LineType, PostType } from "@/types/models";
import PostView from "@/components/PostView/PostView";
import { getFeedPosts } from "@/services/postServices";
import Loading from "@/components/Loading";
import CustomButton from "@/components/CustomButton";
import { colors, icons, images } from "@/constants";
import { router } from "expo-router";
import { getFeedLines } from "@/services/lineServices";
import LineCard from "@/components/LineView/LineCard";
import { useGlobalContext } from "@/context/GlobalProvider";

const Home = () => {
  const { isRefreshFeeds, setIsRefreshFeeds } = useGlobalContext();
  const [postList, setPostList] = useState<PostType.Info[]>([]);
  const [lineList, setLineList] = useState<LineType.Info[]>([]);
  const [isLinesLoading, setIsLinesLoading] = useState(false);
  const [isPostsLoading, setIsPostsLoading] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true);

  const queryLineFeed = async () => {
    try {
      setIsLinesLoading(true);
      setLineList([]);
      setLineList(await getFeedLines());
    } catch (error) {
      Alert.alert(
        "Fetch Failed",
        "There is a problem getting lines right now."
      );
      console.log(error);
    } finally {
      setIsLinesLoading(false);
    }
  };

  const queryPostFeed = async () => {
    let posts: PostType.Info[] = [];
    try {
      setIsPostsLoading(true);

      if (hasMorePosts) {
        if (postList.length !== 0) {
          const lastPostId = postList[postList.length - 1].id;
          posts = await getFeedPosts(lastPostId);
        } else {
          posts = await getFeedPosts();
        }

        if (posts.length > 0) {
          setPostList((prevPosts) => [...prevPosts, ...posts]);
        } else {
          setHasMorePosts(false);
        }
      }
    } catch (error) {
      Alert.alert(
        "Fetch Failed",
        "There is a problem getting posts right now."
      );
      console.log(error);
    } finally {
      setIsPostsLoading(false);
    }
  };

  const onRefreshFeedHandle = useCallback(async () => {
    setIsPostsLoading(true);
    setPostList([]);
    setHasMorePosts(true);
    queryLineFeed();
    await queryPostFeed();
    setIsPostsLoading(false);
  }, []);

  const onEndReachedPostFeedHandle = useCallback(async () => {
    if (!isPostsLoading && hasMorePosts && postList.length != 0) {
      await queryPostFeed();
    }
  }, [isPostsLoading, hasMorePosts]);

  useEffect(() => {
    onRefreshFeedHandle();
  }, []);

  useEffect(() => {
    if (isRefreshFeeds) {
      onRefreshFeedHandle();
      setIsRefreshFeeds(false);
    }
  }, [isRefreshFeeds]);

  return (
    <View className="flex-1 bg-background mt-12">
      <FlatList
        data={postList}
        keyExtractor={(item, index) => index.toString()}
        horizontal={false}
        renderItem={({ item }) => <PostView post={item} />}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View className="w-full h-auto">
            <View className="bg-primary w-full h-72 justify-items-center">
              <FlatList
                data={lineList}
                className="h-64 pt-4"
                keyExtractor={(item, index) => index.toString()}
                horizontal={true}
                renderItem={({ item }) => <LineCard line={item} />}
                showsHorizontalScrollIndicator={true}
                ListHeaderComponent={
                  <LineCard
                    userInterface={{
                      onPress: () => router.push("/createLinePage"),
                      text: "Create Line",
                    }}
                  >
                    <Image
                      source={icons.add}
                      tintColor={colors.background}
                      className="h-36 w-36 opacity-100"
                    />
                  </LineCard>
                }
                ListFooterComponent={
                  isLinesLoading ? (
                    <View className="ml-2 h-64 w-48 rounded-lg overflow-hidden">
                      <Loading
                        loadingPrompt="Querying RamonLine"
                        color={colors.background}
                      />
                    </View>
                  ) : (
                    <View className="mr-2">
                      <LineCard
                        userInterface={{
                          onPress: () => router.push("/line"),
                          text: "See More",
                        }}
                      >
                        <Image
                          source={images.prmsu}
                          className="absolute right-3 top-3 h-20 w-20 opacity-100"
                        />
                        <Image
                          source={icons.line}
                          tintColor={colors.background}
                          className="h-full w-full opacity-100"
                        />
                      </LineCard>
                    </View>
                  )
                }
              />
            </View>
            <View className="mx-2 mt-4 flex-row w-full justify-between items-center">
              <Text className="text-start font-extrabold text-3xl text-primary ">
                Latest in PRMSU
              </Text>
              <CustomButton
                handlePress={onRefreshFeedHandle}
                containerStyles="bg-transparent"
              >
                <Image
                  source={icons.refresh}
                  className="h-6 w-6"
                  tintColor={colors.primary}
                />
              </CustomButton>
            </View>
          </View>
        }
        ListFooterComponent={
          isPostsLoading ? (
            <View className="text-lg text-gray-700 text-center py-24">
              <Loading loadingPrompt="Querying RamonLine" />
            </View>
          ) : (
            <View className="flex-1 bg-panel mx-2 my-12 py-12 items-center rounded-lg overflow-hidden shadow-primary shadow-lg">
              <Text className="text-xl text-primary font-semibold text-center pb-2 ">
                ℹ️ YOU'VE REACHED THE BEGINNING ℹ️
              </Text>
              <CustomButton
                handlePress={() => {
                  onRefreshFeedHandle();
                }}
                title="Back to top"
                containerStyles=" w-2/3"
              />
            </View>
            // <Text className="text-lg text-primary text-center py-24">
            //   {hasMorePosts
            //     ? "Nothing Follows"
            //     : "You've Reached the Beginning"}
            // </Text>
          )
        }
        onRefresh={onRefreshFeedHandle}
        refreshing={isPostsLoading}
        onEndReached={onEndReachedPostFeedHandle}
        onEndReachedThreshold={0.5}
      />
      <CustomButton
        containerStyles="w-16 h-16 absolute rounded-2xl bottom-24 right-8"
        handlePress={() => {
          router.push("/createPostPage");
        }}
        textStyles="text-4xl text-white"
      >
        <Image
          source={icons.create}
          tintColor={colors.background}
          className="h-16 w-16"
        />
      </CustomButton>
    </View>
  );
};

export default Home;
