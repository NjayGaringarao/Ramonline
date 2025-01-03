import { ImagePickerAsset } from "expo-image-picker";
import {
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
import {
  COLLECTION_LINE_ID,
  COLLECTION_USER_ID,
  FUNCTION_NOTIFICATION_ID,
} from "@/constants/variables";
import { toLine, toLineList, toPushTargetList } from "@/lib/typeConverter";
import { LineType, PostType, UserType } from "@/constants/types";

export const uploadBanner = async (ImagePickerResults: ImagePickerAsset) => {
  try {
    return await _uploadFile({
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
    return await _executeFunction(FUNCTION_NOTIFICATION_ID, "createLine", {
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
    return await _executeFunction(FUNCTION_NOTIFICATION_ID, "deleteLine", {
      line_id,
    });
  } catch (error) {
    console.log(`lineServices.ts => deleteLine :: ERROR : ${error}`);
  }
};

export const getFeedLines = async (lastId?: string, searchArgs?: string) => {
  try {
    if (searchArgs) {
      const lines = await _listDocuments(COLLECTION_LINE_ID, [
        Query.contains("name", searchArgs),
        Query.limit(5),
      ]);
      return toLineList(lines.documents);
    } else if (searchArgs && lastId) {
      const lines = await _listDocuments(COLLECTION_LINE_ID, [
        Query.contains("name", searchArgs),
        Query.limit(5),
        Query.cursorAfter(lastId),
      ]);
      return toLineList(lines.documents);
    } else if (lastId && !searchArgs) {
      const lines = await _listDocuments(COLLECTION_LINE_ID, [
        Query.orderDesc("created_at"),
        Query.limit(5),
        Query.cursorAfter(lastId),
      ]);
      return toLineList(lines.documents);
    } else {
      const line = await _listDocuments(COLLECTION_LINE_ID, [
        Query.orderDesc("created_at"),
        Query.limit(5),
      ]);
      return toLineList(line.documents);
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
    return await _updateDocument(COLLECTION_LINE_ID, line_id, {
      description: newDescription,
    });
  } catch (error) {
    console.log(`ERROR (lineServices.ts => updateDescription) :: ${error}`);
    throw error;
  }
};

export const getUserLines = async (
  lines: LineType[],
  sortDateAsc?: boolean
): Promise<LineType[]> => {
  try {
    if (sortDateAsc) {
      lines.sort((a, b) => {
        return a.created_at && b.created_at
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : 0;
      });
    } else {
      lines.sort((a, b) => {
        return a.created_at && b.created_at
          ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          : 0;
      });
    }

    return lines;
  } catch (error) {
    console.log(`ERROR (lineServices.ts => getUserLines) :: ${error}`);
    throw error;
  }
};

export const isUserSubscribed = async (user: UserType, line: LineType) => {
  try {
    const userDocs = await _getDocument(COLLECTION_USER_ID, user.id);

    const userSubscriptions: Models.Document[] = userDocs.subscriptions;

    for (let i = 0; userSubscriptions.length > i; i++) {
      if (userSubscriptions[i].$id == line.id) {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.log(`ERROR (lineServices.ts => isUserSubscribed) :: ${error}`);
    throw error;
  }
};

export const subscribeLine = async (user: UserType, line: LineType) => {
  try {
    const userDocs = await _getDocument(COLLECTION_USER_ID, user.id);
    const userSubscriptions: Models.Document[] = userDocs.subscriptions;
    const newUser = await _getCurrentUser();
    const pushTargets: Models.Target[] = toPushTargetList(newUser.targets);

    pushTargets.forEach(async (target) => {
      try {
        await _subscribeTopic(line.id, target.$id);
      } catch (error) {
        console.log("Error subscribing topic");
      }
    });

    return await _updateDocument(COLLECTION_USER_ID, user.id, {
      subscriptions: [...userSubscriptions, line.id],
    });
  } catch (error) {
    console.log(`ERROR (lineServices.ts => subscribeLine) :: ${error}`);
    throw error;
  }
};

export const unsubscribeLine = async (user: UserType, line: LineType) => {
  try {
    const userDocs = await _getDocument(COLLECTION_USER_ID, user.id);
    const userSubscriptions: Models.Document[] = userDocs.subscriptions;
    const result = await _updateDocument(COLLECTION_USER_ID, user.id, {
      subscriptions: userSubscriptions.filter(
        (subscription) => subscription.$id !== line.id
      ),
    });

    const newUser = await _getCurrentUser();
    const pushTargets: Models.Target[] = toPushTargetList(newUser.targets);

    pushTargets.forEach(async (target) => {
      try {
        await _unsubscribeTopic(line.id, target.$id);
      } catch (error) {
        console.log("Error unsubscribing topic");
      }
    });

    return result;
  } catch (error) {
    console.log(`ERROR (lineServices.ts => unsubscribeLine) :: ${error}`);
    throw error;
  }
};

export const notifyLine = async (
  title: string,
  line_id: string,
  post: PostType
) => {
  try {
    return await _executeFunction(
      FUNCTION_NOTIFICATION_ID,
      "sendNotification",
      {
        title: title,
        line_id: line_id,
        post: post,
      }
    );
  } catch (error) {
    console.log(`lineServices.ts => notifyLine :: ERROR : ${error}`);
  }
};

export const getLine = async (line_id: string) => {
  try {
    const lineDocs = await _getDocument(COLLECTION_LINE_ID, line_id);
    return toLine(lineDocs);
  } catch (error) {
    console.log(`lineServices.ts => getLine :: ERROR : ${error}`);
    throw error;
  }
};
