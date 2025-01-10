import { Text } from "react-native";
import React from "react";
import { formatDateToLocal, getTimeAgo } from "@/lib/commonUtil";

interface IAdaptiveTimeType {
  isoDate: string;
  textStyles?: string;
  isFullDate?: boolean;
  isIntervalShort?: boolean;
}

const AdaptiveTime = ({
  isoDate,
  textStyles,
  isFullDate,
  isIntervalShort,
}: IAdaptiveTimeType) => {
  return (
    <Text className={`${textStyles}`}>
      {isFullDate
        ? formatDateToLocal(isoDate)
        : getTimeAgo(isoDate, isIntervalShort)}
    </Text>
  );
};

export default AdaptiveTime;
