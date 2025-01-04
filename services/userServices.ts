// import { Alert } from "react-native";
// import {
//   _createAccount,
//   _createDocument,
//   _createEmailVerification,
//   _createRecovery,
//   _createTarget,
//   _generateAvatar,
//   _getCurrentUser,
//   _getDocument,
//   _getFilePreview,
//   _getSession,
//   _listDocuments,
//   _listSession,
//   _loginUser,
//   _logoutUser,
//   _updateDocument,
//   _updatePassword,
//   _uploadFile,
// } from "./appwrite";
// import {
//   toExtendedUser,
//   toLine,
//   toSessionList,
//   toUser,
// } from "@/lib/typeConverter";
// import {
//   COLLECTION_LINE_ID,
//   COLLECTION_USER_ID,
//   COLLECTION_USER_NOTIFICATION_ID,
//   RAMONLINE_WEB_ENDPOINT,
// } from "@/constants/variables";
// import { Query } from "react-native-appwrite";
// import {
//   AffiliationType,
//   ExtendedUserType,
//   LineType,
//   UserType,
// } from "@/constants/types";
// import { ImagePickerAsset } from "expo-image-picker";

// type CreateAccountType = {
//   username: string;
//   email: string;
//   password: string;
// };

// type LoginAccountType = {
//   email: string;
//   password: string;
// };

// type SearchUsernameType = {
//   username: string;
//   isDocument?: boolean;
// };

// const handleError = (error: string): string => {
//   switch (error) {
//     case "AppwriteException: Invalid `password` param: Password must be between 8 and 256 characters":
//       return "INVALID PASSWORD";
//     case "AppwriteException: Invalid `email` param: Value must be a valid email address":
//       return "INVALID EMAIL";
//     case "AppwriteException: Invalid credentials. Please check the email and password.":
//       return "WRONG EMAIL OR PASSWORD";
//     case "AppwriteException: Rate limit for the current endpoint has been exceeded. Please try again after some time.":
//       return "\nYOU LOGIN AND LOGOUT VERY FREQUENTLY";
//     case "AppwriteException: Network request failed":
//       return "\nNO INTERNET";
//     default:
//       return "Something went wrong. Please try again.";
//   }
// };

// export const loginAccount = async ({ email, password }: LoginAccountType) => {
//   try {
//     const token = await _loginUser(email, password);

//     // TODO: verify if the user is verified. if not, throw an error
//     return token;
//   } catch (error: any) {
//     const errorMessage = handleError(error.message || error);

//     console.log(`ERROR : (service.ts => loginAccount) :: ${errorMessage}`);

//     Alert.alert(
//       "Login Failed",
//       `Error Message: ${errorMessage}\n\nSomething went wrong in Logging-in your account. You may try again.`
//     );

//     throw error; // Re-throw to let the caller handle the error if needed
//   }
// };

// export const createAccount = async ({
//   username,
//   email,
//   password,
// }: CreateAccountType) => {
//   try {
//     const userAccount = await _createAccount(username, email, password);

//     if (!userAccount) {
//       Alert.alert(
//         "Sign-up Failed",
//         `Something went wrong on signing you up. You may try again.`
//       );
//       throw Error("userAccount Undefine");
//     }

//     await _loginUser(email, password);

//     const avatar_url = _generateAvatar(username);

//     await _createDocument(COLLECTION_USER_NOTIFICATION_ID, userAccount.$id, {});

//     return await _createDocument(COLLECTION_USER_ID, userAccount.$id, {
//       email: email,
//       username: username,
//       avatar_url: avatar_url.toString(),
//       joined_at: new Date().toISOString(),
//     });
//   } catch (error) {
//     console.log(`ERROR : (userServices.ts => createAccount) :: ${error}`);
//     throw error;
//   }
// };

// export const searchUsername = async ({
//   username,
//   isDocument,
// }: SearchUsernameType) => {
//   try {
//     const userDocs = await _listDocuments(COLLECTION_USER_ID, [
//       Query.equal("username", username),
//     ]);
//     if (isDocument) {
//       return userDocs.documents;
//     } else {
//       return userDocs.total;
//     }
//   } catch (error) {
//     console.log(`ERROR : (userServices.ts => searchUsername) :: ${error}`);
//     throw error;
//   }
// };

// export const requestVerification = async () => {
//   try {
//     return await _createEmailVerification(
//       RAMONLINE_WEB_ENDPOINT.concat("/emailVerification")
//     );
//   } catch (error) {
//     console.log(`ERROR : (userServices.ts => requestVerification) :: ${error}`);
//     throw error;
//   }
// };

// export const requestRecovery = async (email: string) => {
//   try {
//     return await _createRecovery(
//       email,
//       RAMONLINE_WEB_ENDPOINT.concat("/accountRecovery")
//     );
//   } catch (error) {
//     console.log(`ERROR : (userServices.ts => requestRecovery) :: ${error}`);
//     throw error;
//   }
// };

// export const changePassword = async (
//   oldPassword: string,
//   newPassword: string
// ) => {
//   try {
//     return await _updatePassword(oldPassword, newPassword);
//   } catch (error) {
//     console.log(`ERROR : (userServices.ts => changePassword) :: ${error}`);
//     if (
//       error ==
//       "AppwriteException: Invalid credentials. Please check the email and password."
//     ) {
//       throw Error("Incorrect Old Password.");
//     } else if (
//       error ==
//       "AppwriteException: Rate limit for the current endpoint has been exceeded. Please try again after some time."
//     ) {
//       throw Error("Transcation limit reached. Please try again later.");
//     } else {
//       throw Error("There was a problem updating your password.");
//     }
//   }
// };

// export const getCurrentUser = async () => {
//   try {
//     const res = await _getCurrentUser();
//     return res;
//   } catch (error) {
//     console.log(
//       `LOGIN STATE (service.ts => getCurrentUser) :: ${
//         error ==
//         "AppwriteException: User (role: guests) missing scope (account)"
//           ? "NOT LOGGED IN"
//           : error
//       }`
//     );
//   }
// };

// export const logoutCurrentUser = async () => {
//   try {
//     const res = await _logoutUser();
//     return res;
//   } catch (error) {
//     console.log(`ERROR : (userServices.ts => logoutCurrentUser) :: ${error}`);
//     throw error;
//   }
// };

// export const logoutUser = async (session_id: string) => {
//   try {
//     const res = await _logoutUser(session_id);
//     return res;
//   } catch (error) {
//     console.log(`ERROR : (userServices.ts => logoutUser) :: ${error}`);
//     throw error;
//   }
// };

// export const getUserSessions = async () => {
//   try {
//     const sessions = await _listSession();

//     return toSessionList(sessions);
//   } catch (error) {
//     console.log(`ERROR : (userServices.ts => getUserSessions) :: ${error}`);
//     throw error;
//   }
// };

// export const getUserInfo = async <T extends boolean>(
//   user_id: string,
//   extendedType?: T
// ): Promise<T extends true ? ExtendedUserType : UserType> => {
//   try {
//     const document = await _getDocument(COLLECTION_USER_ID, user_id);
//     const line_ids = document.line_ids;

//     if (extendedType) {
//       let lineList: LineType[] = [];

//       if (line_ids && line_ids.length) {
//         for (let i = 0; line_ids.length > i; i++) {
//           const lineDocument = await _getDocument(
//             COLLECTION_LINE_ID,
//             line_ids[i]
//           );

//           lineList.push(toLine(lineDocument));
//         }
//       }

//       const user = toExtendedUser(document, lineList);
//       return user;
//     } else {
//       return toUser(document) as any;
//     }
//   } catch (error) {
//     console.log(`ERROR : (userServices.ts => getUserInfo) :: ${error}`);
//     throw error;
//   }
// };

// export const updateProfile = async (
//   user_id: string,
//   name: [string | undefined, string | undefined, string | undefined],
//   newProfilePicture?: ImagePickerAsset
// ) => {
//   try {
//     if (newProfilePicture) {
//       const pictureFile = await _uploadFile({
//         name: newProfilePicture.fileName!,
//         type: newProfilePicture.mimeType!,
//         size: newProfilePicture.fileSize!,
//         uri: newProfilePicture.uri!,
//       });

//       return await _updateDocument(COLLECTION_USER_ID, user_id, {
//         picture_id: pictureFile.$id,
//         name: name,
//       });
//     } else {
//       return await _updateDocument(COLLECTION_USER_ID, user_id, {
//         name: name,
//       });
//     }
//   } catch (error) {
//     console.log(`ERROR : (userServices.ts => updateProfile) :: ${error}`);
//     throw error;
//   }
// };

// export const updateRole = async (user_id: string, role: AffiliationType) => {
//   try {
//     return await _updateDocument(COLLECTION_USER_ID, user_id, {
//       role: [role.first, role.second, role.third, role.year],
//     });
//   } catch (error) {
//     console.log(`ERROR : (userServices.ts => updateRole) :: ${error}`);
//     throw error;
//   }
// };
