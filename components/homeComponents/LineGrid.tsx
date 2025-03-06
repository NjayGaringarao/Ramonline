import { View, FlatList, Alert, Text, Image } from "react-native";
import React, { useEffect, useState, useCallback, useRef } from "react";
import LineCard from "../LineView/LineCard";
import { LineType } from "@/types/models";
import { getFeedLines } from "@/services/lineServices";
import { useGlobalContext } from "@/context/GlobalProvider";
import Loading from "../Loading";
import CustomButton from "../CustomButton";
import { icons } from "@/constants";

interface ILineGridType {
  isInternetConnection: boolean;
}

const LineGrid = ({ isInternetConnection }: ILineGridType) => {
  const {
    isRefreshLineFeed,
    setIsRefreshLineFeed,
    userSubscription,
    refreshUserRecord,
  } = useGlobalContext();
  const [lineList, setLineList] = useState<LineType.Info[]>([]);
  const [isLinesLoading, setIsLinesLoading] = useState(false);
  const [hasMoreLines, setHasMoreLines] = useState(true);
  const [lastId, setLastId] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const queryLineFeed = async () => {
    if (!isInternetConnection) return;
    try {
      setIsLinesLoading(true);
      const lines = lastId ? await getFeedLines(lastId) : await getFeedLines();

      if (lines.length > 0) {
        setLineList((prevLines) => [...prevLines, ...lines]);
        setLastId(lines[lines.length - 1].id);
      } else {
        setHasMoreLines(false);
      }
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

  useEffect(() => {
    refreshUserRecord({ subscription: true });
  }, [lineList]);

  const formatToDisplayList = (lines: LineType.Info[]) => {
    return Array.from({ length: Math.ceil(lines.length / 4) }, (_, i) =>
      lines.slice(i * 4, i * 4 + 4)
    );
  };

  const onRefreshFeedHandle = useCallback(async () => {
    if (!isInternetConnection) return;
    scrollToLeft();
    setLineList([]);
    setHasMoreLines(true);
    setLastId(null);
    await queryLineFeed();
  }, []);

  const onEndReachedHandle = useCallback(async () => {
    if (!isLinesLoading && hasMoreLines) {
      await queryLineFeed();
    }
  }, [isLinesLoading, hasMoreLines]);

  const scrollToLeft = () => {
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
  };

  useEffect(() => {
    queryLineFeed();
  }, []);

  useEffect(() => {
    if (isRefreshLineFeed) {
      onRefreshFeedHandle();
      setIsRefreshLineFeed(false);
    }
  }, [isRefreshLineFeed]);

  return (
    <View className="bg-primary w-full h-72">
      <FlatList
        data={formatToDisplayList(
          [...lineList].sort((a, b) => {
            const subscribedLineIds = new Set(
              userSubscription.map((sub) => sub.line_id)
            );
            return (
              (subscribedLineIds.has(b.id) ? 1 : 0) -
              (subscribedLineIds.has(a.id) ? 1 : 0)
            );
          })
        )}
        horizontal
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item: column, index: colIndex }) => (
          <View key={colIndex} className="flex flex-col w-[50vw]">
            {column.map((line: LineType.Info, rowIndex: number) => (
              <LineCard
                key={rowIndex}
                line={line}
                isSubscribe={userSubscription.some(
                  (sub) => sub.line_id === line.id
                )}
              />
            ))}
          </View>
        )}
        showsHorizontalScrollIndicator={true}
        onEndReached={onEndReachedHandle}
        onEndReachedThreshold={0.5}
        refreshing={isLinesLoading}
        onRefresh={onRefreshFeedHandle}
        ref={flatListRef}
        ListFooterComponent={
          isLinesLoading ? (
            <View className="text-lg text-gray-700 text-center py-24">
              <Loading loadingPrompt="Querying RamonLine" />
            </View>
          ) : (
            <View className="w-[100vw] flex-1">
              <View className="bg-panel mx-2 my-12 py-12 items-center rounded-lg overflow-hidden shadow-primary shadow-lg">
                <Text className="text-xl text-primary font-semibold text-center pb-2 ">
                  ℹ️ NO MORE LINES TO SHOW ℹ️
                </Text>
                <CustomButton
                  handlePress={() => {
                    onRefreshFeedHandle();
                  }}
                  title="Refresh"
                  containerStyles=" w-2/3"
                  isLoading={!isInternetConnection}
                >
                  <Image
                    source={icons.refresh}
                    className="w-6 h-6 mr-2"
                    tintColor={"#fff"}
                  />
                </CustomButton>
              </View>
            </View>
          )
        }
      />
    </View>
  );
};

export default LineGrid;
