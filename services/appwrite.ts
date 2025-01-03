import {
  API_ENDPOINT,
  BUCKET_MULTIMEDIA_ID,
  DATABASE_ID,
  PROJECT_ID,
} from "@/constants/variables";
import { compressIds } from "@/lib/definedAlgo";
import {
  ID,
  Account,
  Client,
  Avatars,
  Databases,
  Storage,
  Functions,
  Messaging,
  ExecutionMethod,
  Permission,
} from "react-native-appwrite";

const client = new Client();

class AppwriteService {
  account;
  avatars;
  databases;
  functions;
  storage;
  messaging;
  constructor() {
    client.setEndpoint(API_ENDPOINT).setProject(PROJECT_ID);

    this.account = new Account(client);
    this.avatars = new Avatars(client);
    this.databases = new Databases(client);
    this.storage = new Storage(client);
    this.functions = new Functions(client);
    this.messaging = new Messaging(client);
  }
}

const appwriteService = new AppwriteService();

//#region Authentication
export const _createAccount = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    const userAccount = await appwriteService.account.create(
      ID.unique(),
      email,
      password,
      username
    );

    return userAccount;
  } catch (error) {
    console.log(`ERROR (appwrite.ts => createAccount) :: ${error}`);
    throw error;
  }
};

export const _generateAvatar = (username: string) => {
  return appwriteService.avatars.getInitials(username);
};

export const _loginUser = async (email: string, password: string) => {
  try {
    const session = await appwriteService.account.createEmailPasswordSession(
      email,
      password
    );
    return session;
  } catch (error) {
    console.log(`ERROR (appwrite.ts => loginUser) :: ${error}`);
    throw error;
  }
};

export const _createEmailVerification = async (
  verificationPageLink: string
) => {
  try {
    return await appwriteService.account.createVerification(
      verificationPageLink
    );
  } catch (error) {
    console.log(`ERROR (appwrite.ts => _createEmailVerification) :: ${error}`);
    throw error;
  }
};

export const _createRecovery = async (
  email: string,
  recoveryPageLink: string
) => {
  try {
    return await appwriteService.account.createRecovery(
      email,
      recoveryPageLink
    );
  } catch (error) {
    console.log(`ERROR (appwrite.ts => _createRecovery) :: ${error}`);
    throw error;
  }
};

export const _updatePassword = async (
  oldPassword: string,
  newPassword: string
) => {
  try {
    return await appwriteService.account.updatePassword(
      newPassword,
      oldPassword
    );
  } catch (error) {
    console.log(`ERROR (appwrite.ts => _updatePassword) :: ${error}`);
    throw error;
  }
};

export const _logoutUser = async (session_id?: string) => {
  try {
    if (session_id) {
      return await appwriteService.account.deleteSession(session_id);
    } else {
      return await appwriteService.account.deleteSession("current");
    }
  } catch (error) {
    console.log(`ERROR (appwrite.ts => logoutUser) :: ${error}`);
    throw error;
  }
};

export const _getCurrentUser = async () => {
  try {
    const res = await appwriteService.account.get();
    return res;
  } catch (error) {
    console.log(`ERROR (appwrite.ts => getCurrentUser) :: ${error}`);
    throw error;
  }
};

export const _getSession = async () => {
  try {
    const res = await appwriteService.account.getSession("current");
    return res;
  } catch (error) {
    console.log(`ERROR (appwrite.ts => getSession) :: ${error}`);
    throw error;
  }
};

export const _listSession = async () => {
  try {
    const res = await appwriteService.account.listSessions();
    return res;
  } catch (error) {
    console.log(`ERROR (appwrite.ts => listSession) :: ${error}`);
    throw error;
  }
};

export const _createTarget = async (sessionId: string, fcmToken: string) => {
  try {
    const target = await appwriteService.account.createPushTarget(
      sessionId,
      fcmToken
    );
    return target;
  } catch (error) {
    console.log(`ERROR (appwrite.ts => createTarget) :: ${error}`);
    throw error;
  }
};

export const _deleteTarget = async (targetId: string) => {
  try {
    return appwriteService.account.deletePushTarget(targetId);
  } catch (error) {
    console.log(`ERROR (appwrite.ts => deleteTarget) :: ${error}`);
    throw error;
  }
};

export const _updateTarget = async (targetId: string, fcmToken: string) => {
  try {
    return await appwriteService.account.updatePushTarget(targetId, fcmToken);
  } catch (error) {
    console.log(`ERROR (appwrite.ts => updateTarget) :: ${error}`);
    throw error;
  }
};

//#endregion

//#region Notification

export const _subscribeTopic = async (lineId: string, targetId: string) => {
  try {
    return await appwriteService.messaging.createSubscriber(
      lineId,
      compressIds(lineId, targetId), // subscriberId
      targetId
    );
  } catch (error) {
    if (
      error !=
      "AppwriteException: Subscriber with the request ID already exists."
    ) {
      console.log(`ERROR (appwrite.ts => subscribeLine) :: ${error}`);
      throw error;
    }
  }
};

export const _unsubscribeTopic = async (lineId: string, targetId: string) => {
  try {
    return await appwriteService.messaging.deleteSubscriber(
      lineId,
      compressIds(lineId, targetId) // subscriberId
    );
  } catch (error) {
    console.log(`ERROR (appwrite.ts => unsubscribeLine) :: ${error}`);
    throw error;
  }
};

//#endregion

//#region File
export const _uploadFile = async (asset: {
  name: string;
  type: string;
  size: number;
  uri: string;
}) => {
  console.log(asset.uri);
  try {
    const uploadedImage = await appwriteService.storage.createFile(
      BUCKET_MULTIMEDIA_ID,
      ID.unique(),
      asset
    );

    return uploadedImage;
  } catch (error) {
    console.log(`ERROR (appwrite.ts => uploadImage) :: ${error}`);
    throw error;
  }
};

export const _updateFile = async (
  file_ID: string,
  name?: string,
  permissions?: string[]
) => {
  try {
    await appwriteService.storage.updateFile(
      BUCKET_MULTIMEDIA_ID,
      file_ID,
      name,
      permissions
    );
  } catch (error) {
    console.log(`ERROR (appwrite.ts => updateFile) :: ${error}`);
  }
};

export const _getFilePreview = (fileId: string) => {
  try {
    const fileUrl = appwriteService.storage.getFilePreview(
      BUCKET_MULTIMEDIA_ID,
      fileId
    );
    return fileUrl;
  } catch (error) {
    console.log(`ERROR (appwrite.ts => getImagePreview) :: ${error}`);
    throw error;
  }
};

export const _deleteFile = async (fileId: string) => {
  try {
    await appwriteService.storage.deleteFile(BUCKET_MULTIMEDIA_ID, fileId);
  } catch (error) {
    console.log(`ERROR (appwrite.ts => deleteFile) :: ${error}`);
    throw error;
  }
};

//#endregion

//#region Document

export const _createDocument = async (
  COLLECTION_ID: string,
  id: string,
  data: object
) => {
  try {
    const result = await appwriteService.databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      id,
      data
    );
    return result;
  } catch (error) {
    console.log(`ERROR (appwrite.ts => createDocument) :: ${error}`);
    throw error;
  }
};

export const _getDocument = async (
  COLLECTION_ID: string,
  document_id: string
) => {
  try {
    const userDocument = await appwriteService.databases.getDocument(
      DATABASE_ID,
      COLLECTION_ID,
      document_id
    );
    return userDocument;
  } catch (error) {
    console.log(`ERROR (appwrite.ts => getDocument) :: ${error}`);
    throw error;
  }
};

export const _listDocuments = async (
  COLLECTION_ID: string,
  query?: string[]
) => {
  try {
    const userDocument = await appwriteService.databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      query
    );
    return userDocument;
  } catch (error) {
    console.log(`ERROR (appwrite.ts => listDocuments) :: ${error}`);
    throw error;
  }
};

export const _updateDocument = async (
  COLLECTION_ID: string,
  document_id: string,
  data: object
) => {
  try {
    const result = await appwriteService.databases.updateDocument(
      DATABASE_ID,
      COLLECTION_ID,
      document_id,
      data
    );
    return result;
  } catch (error) {
    console.log(`ERROR (appwrite.ts => updateDocument) :: ${error}`);
    throw error;
  }
};

export const _deleteDocument = async (
  COLLECTION_ID: string,
  document_id: string
) => {
  try {
    return await appwriteService.databases.deleteDocument(
      DATABASE_ID,
      COLLECTION_ID,
      document_id
    );
  } catch (error) {
    console.log(`ERROR (appwrite.ts => deleteDocument) :: ${error}`);
    throw error;
  }
};
//#endregion

//#region Function

export const _executeFunction = async (
  APPWRITE_FUNCTION_ID: string,
  functionName: string,
  parameter: object
) => {
  const bodyRequest = {
    function: functionName,
    parameter: parameter,
  };

  const result = await appwriteService.functions.createExecution(
    APPWRITE_FUNCTION_ID,
    JSON.stringify(bodyRequest),
    false,
    undefined,
    ExecutionMethod.POST
  );

  return result;
};

//#endregion
