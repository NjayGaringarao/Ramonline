import {
  _createAccount,
  _createDocument,
  _createEmailVerification,
  _createRecovery,
  _createTarget,
  _deleteFile,
  _generateAvatar,
  _getCurrentUser,
  _getDocument,
  _getFilePreview,
  _getSession,
  _listDocuments,
  _listSession,
  _loginUser,
  _logoutUser,
  _updateDocument,
  _updateFile,
  _updatePassword,
  _uploadFile,
} from "./appwrite";
import { toSessionList, toUserInfo } from "@/lib/typeConverter";
import { env } from "@/constants/env";
import { Models, Query } from "react-native-appwrite";
import { AffiliationType } from "@/types/utils";
import { ImagePickerAsset } from "expo-image-picker";

export const loginAccount = async (email: string, password: string) => {
  try {
    const token = await _loginUser(email, password);
    return token;
  } catch (error: any) {
    console.log(`ERROR : (service.ts => loginAccount) :: ${error}`);

    switch (error) {
      case "AppwriteException: Invalid `password` param: Password must be between 8 and 256 characters":
        throw Error("INVALID PASSWORD");
      case "AppwriteException: Invalid `email` param: Value must be a valid email address":
        throw Error("INVALID EMAIL");
      case "AppwriteException: Invalid credentials. Please check the email and password.":
        throw Error("WRONG EMAIL OR PASSWORD");
      case "AppwriteException: Rate limit for the current endpoint has been exceeded. Please try again after some time.":
        throw Error(
          "You have reached the limit for logging in and out. \n Please try again later."
        );
      case "AppwriteException: Network request failed":
        throw Error("NO INTERNET");
      default:
        throw Error("Something went wrong. Please try again.");
    }
  }
};

export const createAccount = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    const userAccount = await _createAccount(username, email, password);

    await _loginUser(email, password);

    const avatar_url = _generateAvatar(username);

    await _createDocument(
      env.DATABASE_PRIMARY,
      env.COLLECTION_USER_INFO,
      userAccount.$id,
      {
        username: username,
        avatar_url: avatar_url.toString(),
        created_at: new Date(),
      }
    );

    return userAccount;
  } catch (error) {
    // TODO : improve error throwing prompt
    console.log(`ERROR : (userServices.ts => createAccount) :: ${error}`);
    throw error;
  }
};

export const searchUsername = async (username: string, isDocument: string) => {
  try {
    const userDocs = await _listDocuments(
      env.DATABASE_PRIMARY,
      env.COLLECTION_USER_INFO,
      [Query.equal("username", username)]
    );
    if (isDocument) {
      return userDocs.documents;
    } else {
      return userDocs.total;
    }
  } catch (error) {
    // TODO : improve error throwing prompt
    console.log(`ERROR : (userServices.ts => searchUsername) :: ${error}`);
    throw error;
  }
};

export const requestVerification = async () => {
  try {
    return await _createEmailVerification(
      env.WEBAPP_ENDPOINT.concat("/emailVerification")
    );
  } catch (error) {
    // TODO : improve error throwing prompt
    console.log(`ERROR : (userServices.ts => requestVerification) :: ${error}`);
    throw error;
  }
};

export const requestRecovery = async (email: string) => {
  try {
    return await _createRecovery(
      email,
      env.WEBAPP_ENDPOINT.concat("/accountRecovery")
    );
  } catch (error) {
    // TODO : improve error throwing prompt
    console.log(`ERROR : (userServices.ts => requestRecovery) :: ${error}`);
    throw error;
  }
};

export const changePassword = async (
  oldPassword: string,
  newPassword: string
) => {
  try {
    return await _updatePassword(oldPassword, newPassword);
  } catch (error) {
    console.log(`ERROR : (userServices.ts => changePassword) :: ${error}`);
    if (
      error ==
      "AppwriteException: Invalid credentials. Please check the email and password."
    ) {
      throw Error("Incorrect Old Password.");
    } else if (
      error ==
      "AppwriteException: Rate limit for the current endpoint has been exceeded. Please try again after some time."
    ) {
      throw Error("Transcation limit reached. Please try again later.");
    } else {
      throw Error("There was a problem updating your password.");
    }
  }
};

export const getCurrentUser = async () => {
  try {
    return await _getCurrentUser();
  } catch (error) {
    if (
      error === "AppwriteException: User (role: guests) missing scope (account)"
    ) {
      console.log("NOT LOGGED IN");
    } else {
      console.log(error);
    }
  }
};

export const logoutUser = async (session_id?: string) => {
  try {
    const res = await _logoutUser(session_id);
    // also delete push target here
    return res;
  } catch (error) {
    console.log(`ERROR : (userServices.ts => logoutUser) :: ${error}`);
    throw error;
  }
};

export const getUserSessions = async () => {
  try {
    const sessions = await _listSession();

    return toSessionList(sessions);
  } catch (error) {
    console.log(`ERROR : (userServices.ts => getUserSessions) :: ${error}`);
    throw error;
  }
};

export const getUserInfo = async (user_id: string) => {
  try {
    const user = await _getDocument(
      env.DATABASE_PRIMARY,
      env.COLLECTION_USER_INFO,
      user_id
    );
    return toUserInfo(user);
  } catch (error) {
    console.log(`ERROR : (userServices.ts => getUserInfo) :: ${error}`);
    throw error;
  }
};

export const updateProfile = async (
  user_id: string,
  name: [string | undefined, string | undefined, string | undefined],
  newProfilePicture?: ImagePickerAsset
) => {
  let pictureFile: Models.File | undefined = undefined;
  try {
    if (newProfilePicture) {
      pictureFile = await _uploadFile(env.BUCKET_IMAGE, {
        name: newProfilePicture.fileName!,
        type: newProfilePicture.mimeType!,
        size: newProfilePicture.fileSize!,
        uri: newProfilePicture.uri!,
      });

      const execution = await _updateDocument(
        env.DATABASE_PRIMARY,
        env.COLLECTION_USER_INFO,
        user_id,
        {
          picture_id: pictureFile.$id,
          name: name,
        }
      );

      await _updateFile(env.BUCKET_IMAGE, pictureFile.$id, {
        name: `User Image ${user_id}`,
      });

      return execution;
    } else {
      return await _updateDocument(
        env.DATABASE_PRIMARY,
        env.COLLECTION_USER_INFO,
        user_id,
        {
          name: name,
        }
      );
    }
  } catch (error) {
    console.log(`ERROR : (userServices.ts => updateProfile) :: ${error}`);

    await _deleteFile(env.BUCKET_IMAGE, pictureFile?.$id!).catch();
    throw error;
  }
};

export const updateRole = async (user_id: string, role: AffiliationType) => {
  try {
    return await _updateDocument(
      env.DATABASE_PRIMARY,
      env.COLLECTION_USER_INFO,
      user_id,
      {
        role: [role.first, role.second, role.third, role.year],
      }
    );
  } catch (error) {
    console.log(`ERROR : (userServices.ts => updateRole) :: ${error}`);
    throw error;
  }
};
