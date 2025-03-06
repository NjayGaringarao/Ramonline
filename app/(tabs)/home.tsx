import {
  View,
  Text,
  FlatList,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { PostType } from "@/types/models";
import { getFeedPosts } from "@/services/postServices";
import Loading from "@/components/Loading";
import CustomButton from "@/components/CustomButton";
import { colors, icons } from "@/constants";
import { useGlobalContext } from "@/context/GlobalProvider";
import LineGrid from "@/components/homeComponents/LineGrid";
import FeedPostView from "@/components/PostView/FeedPostView";

const Home = () => {
  const {
    isRefreshPostFeed,
    setIsRefreshPostFeed,
    isInternetConnection,
    setIsRefreshLineFeed,
  } = useGlobalContext();
  const [postList, setPostList] = useState<PostType.Info[]>([]);
  const [isPostsLoading, setIsPostsLoading] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  const queryPostFeed = async () => {
    if (!isInternetConnection) return;
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

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
  };

  const onRefreshFeedHandle = useCallback(async () => {
    if (!isInternetConnection) return;
    scrollToTop();
    setIsPostsLoading(true);
    setPostList([]);
    setHasMorePosts(true);
    setIsRefreshLineFeed(true);
    await queryPostFeed();
    setIsPostsLoading(false);
  }, []);

  const onEndReachedPostFeedHandle = useCallback(async () => {
    if (
      !isPostsLoading &&
      hasMorePosts &&
      postList.length != 0 &&
      isInternetConnection
    ) {
      await queryPostFeed();
    }
  }, [isPostsLoading, hasMorePosts]);

  const onRefreshPostFeedHandle = async () => {
    if (!isInternetConnection) return;
    scrollToTop();
    setIsPostsLoading(true);
    setPostList([]);
    setHasMorePosts(true);
    await queryPostFeed();
    setIsPostsLoading(false);
  };

  useEffect(() => {
    onRefreshPostFeedHandle();
  }, []);

  useEffect(() => {
    if (setIsRefreshPostFeed) {
      onRefreshPostFeedHandle();
      setIsRefreshPostFeed(false);
    }
  }, [isRefreshPostFeed]);

  return (
    <View className="relative flex-1 bg-background mt-14 overflow-visible">
      <FlatList
        data={postList}
        keyExtractor={(item, index) => index.toString()}
        horizontal={false}
        renderItem={({ item }) => <FeedPostView post={item} />}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View className="w-full h-auto">
            <LineGrid isInternetConnection={!!isInternetConnection} />
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
          )
        }
        onRefresh={onRefreshFeedHandle}
        refreshing={isPostsLoading}
        onEndReached={onEndReachedPostFeedHandle}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

export default Home;
