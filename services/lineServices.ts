import { ImagePickerAsset } from "expo-image-picker";
import {
  _createDocument,
  _deleteDocument,
  _executeFunction,
  _getCurrentUser,
  _getDocument,
  _getFilePreview,
  _listDocuments,
  _subscribeTopic,
  _unsubscribeTopic,
  _updateDocument,
  _uploadFile,
} from "./appwrite";
import { Models, Query } from "react-native-appwrite";
import { env } from "@/constants/env";
import {
  toLineInfo,
  toLineInfoList,
  toPushTargetList,
} from "@/lib/typeConverter";
import { compressIds } from "@/lib/commonUtil";

export const uploadBanner = async (ImagePickerResults: ImagePickerAsset) => {
  try {
    return await _uploadFile(env.BUCKET_IMAGE, {
      name: ImagePickerResults.fileName!,
      type: ImagePickerResults.mimeType!,
      size: ImagePickerResults.fileSize!,
      uri: ImagePickerResults.uri!,
    });
  } catch (error) {
    console.log(`ERROR (lineServices.ts => uploadLogo) :: ${error}`);
    throw error;
  }
};

export const createLine = async (
  user_id: string,
  lineName: string,
  description: string,
  banner_id: string
) => {
  try {
    return await _executeFunction(env.FUNCTION_NOTIFICATION, "createLine", {
      lineName: lineName,
      description: description,
      user_id: user_id,
      banner_id: banner_id,
    });
  } catch (error) {
    console.log(`lineServices.ts => createLine :: ERROR : ${error}`);
  }
};

export const deleteLine = async (line_id: string) => {
  try {
    return await _executeFunction(env.FUNCTION_NOTIFICATION, "deleteLine", {
      line_id,
    });
  } catch (error) {
    console.log(`lineServices.ts => deleteLine :: ERROR : ${error}`);
  }
};

export const getFeedLines = async (lastId?: string, searchArgs?: string) => {
  try {
    if (searchArgs) {
      const lines = await _listDocuments(
        env.DATABASE_PRIMARY,
        env.COLLECTION_LINE_INFO,
        [Query.contains("name", searchArgs), Query.limit(5)]
      );
      return toLineInfoList(lines.documents);
    } else if (searchArgs && lastId) {
      const lines = await _listDocuments(
        env.DATABASE_PRIMARY,
        env.COLLECTION_LINE_INFO,
        [
          Query.contains("name", searchArgs),
          Query.limit(5),
          Query.cursorAfter(lastId),
        ]
      );
      return toLineInfoList(lines.documents);
    } else if (lastId && !searchArgs) {
      const lines = await _listDocuments(
        env.DATABASE_PRIMARY,
        env.COLLECTION_LINE_INFO,
        [
          Query.orderDesc("created_at"),
          Query.limit(5),
          Query.cursorAfter(lastId),
        ]
      );
      return toLineInfoList(lines.documents);
    } else {
      const line = await _listDocuments(
        env.DATABASE_PRIMARY,
        env.COLLECTION_LINE_INFO,
        [Query.orderDesc("created_at"), Query.limit(5)]
      );
      return toLineInfoList(line.documents);
    }
  } catch (error) {
    console.log(`ERROR (lineServices.ts => getLines) :: ${error}`);
    throw error;
  }
};

export const updateDescription = async (
  line_id: string,
  newDescription: string
) => {
  try {
    return await _updateDocument(
      env.DATABASE_PRIMARY,
      env.COLLECTION_LINE_INFO,
      line_id,
      {
        description: newDescription,
      }
    );
  } catch (error) {
    console.log(`ERROR (lineServices.ts => updateDescription) :: ${error}`);
    throw error;
  }
};

export const getUserLines = async (user_id: string, last_id?: string) => {
  try {
    if (last_id) {
      const line = await _listDocuments(
        env.DATABASE_PRIMARY,
        env.COLLECTION_LINE_INFO,
        [
          Query.contains("user_id", user_id),
          Query.limit(5),
          Query.cursorAfter(last_id),
        ]
      );

      return toLineInfoList(line.documents);
    } else {
      const line = await _listDocuments(
        env.DATABASE_PRIMARY,
        env.COLLECTION_LINE_INFO,
        [Query.contains("user_id", user_id), Query.limit(5)]
      );
      return toLineInfoList(line.documents);
    }
  } catch (error) {
    console.log(`ERROR (lineServices.ts => getUserLines) :: ${error}`);
    throw error;
  }
};

export const isUserSubscribed = async (user_id: string, line_id: string) => {
  try {
    const result = await _listDocuments(
      env.DATABASE_PRIMARY,
      env.COLLECTION_LINE_SUBSCRIPTION,
      [Query.contains("user_id", user_id), Query.contains("line_id", line_id)]
    );
    return !!result.total;
  } catch (error) {
    console.log(`ERROR (lineServices.ts => isUserSubscribed) :: ${error}`);
    throw error;
  }
};

export const subscribeLine = async (user_id: string, line_id: string) => {
  try {
    return await _createDocument(
      env.DATABASE_PRIMARY,
      env.COLLECTION_LINE_SUBSCRIPTION,
      compressIds(line_id, user_id),
      {
        user_id: user_id,
        line_id: line_id,
      }
    );
  } catch (error) {
    console.log(`ERROR (lineServices.ts => subscribeLine) :: ${error}`);
    throw error;
  }
};

export const unsubscribeLine = async (user_id: string, line_id: string) => {
  try {
    return await _deleteDocument(
      env.DATABASE_PRIMARY,
      env.COLLECTION_LINE_SUBSCRIPTION,
      compressIds(line_id, user_id)
    );
  } catch (error) {
    console.log(`ERROR (lineServices.ts => unsubscribeLine) :: ${error}`);
    throw error;
  }
};

export const notifyLine = async (
  title: string,
  line_id: string,
  post_id: string
) => {
  try {
    return await _executeFunction(
      env.FUNCTION_NOTIFICATION,
      "sendNotification",
      {
        title: title,
        line_id: line_id,
        post_id: post_id,
      }
    );
  } catch (error) {
    console.log(`lineServices.ts => notifyLine :: ERROR : ${error}`);
  }
};

export const getLine = async (line_id: string) => {
  try {
    const lineDocs = await _getDocument(
      env.DATABASE_PRIMARY,
      env.COLLECTION_LINE_INFO,
      line_id
    );
    return toLineInfo(lineDocs);
  } catch (error) {
    console.log(`lineServices.ts => getLine :: ERROR : ${error}`);
    throw error;
  }
};
