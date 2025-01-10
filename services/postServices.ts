import { ID, Models, Query } from "react-native-appwrite";
import { ImagePickerAsset } from "expo-image-picker";
import {
  _createDocument,
  _deleteDocument,
  _deleteFile,
  _getDocument,
  _getFilePreview,
  _listDocuments,
  _updateDocument,
  _updateFile,
  _uploadFile,
} from "./appwrite";
import { toPostInfo, toPostInfoList } from "@/lib/typeConverter";
import { env } from "@/constants/env";
import { UserPostListType } from "@/types/utils";

export const uploadImages = async (ImagePickerResults: ImagePickerAsset[]) => {
  const uploadedImages: Models.File[] = [];
  try {
    for (let i = 0; i < ImagePickerResults.length; i++) {
      const imageFile = await _uploadFile(env.BUCKET_IMAGE, {
        name: ImagePickerResults[i].fileName!,
        type: ImagePickerResults[i].mimeType!,
        size: ImagePickerResults[i].fileSize!,
        uri: ImagePickerResults[i].uri!,
      });
      uploadedImages.push(imageFile);
    }
    return uploadedImages;
  } catch (error) {
    if (uploadedImages.length)
      for (let i = 0; i < uploadedImages.length; i++) {
        _deleteFile(env.BUCKET_IMAGE, uploadedImages[i].$id);
      }
    if (error == "AppwriteException: File extension not allowed") {
      throw Error("File extension not allowed.");
    } else if (error == "AppwriteException: File size not allowed") {
      throw Error("File size exceeds the limit of 25MB ");
    } else {
      throw Error("There was an error uploading your file");
    }
  }
};

export const createPost = async (
  user_id: string,
  caption?: string,
  images?: ImagePickerAsset[]
) => {
  const image_ids: string[] = [];
  let imagesFiles: Models.File[] = [];
  let post: Models.Document | undefined = undefined;
  try {
    if (images) imagesFiles = await uploadImages(images);

    if (imagesFiles.length)
      for (let i = 0; i < imagesFiles.length; i++) {
        image_ids.push(imagesFiles[i].$id);
      }

    post = await _createDocument(
      env.DATABASE_PRIMARY,
      env.COLLECTION_POST_INFO,
      ID.unique(),
      {
        caption: caption,
        image_id: image_ids,
        created_at: new Date().toISOString(),
        user_id: user_id,
      }
    );

    // This should mark the image as a part of the post
    // Therefore, cleaner will not delete the file
    await Promise.all(
      imagesFiles.map((file) =>
        _updateFile(env.BUCKET_IMAGE, file.$id, {
          name: `Post Image ${post?.$id}`,
        })
      )
    );

    return post;
  } catch (error) {
    // Rollback file uploads
    await Promise.all(
      imagesFiles.map((file) => _deleteFile(env.BUCKET_IMAGE, file.$id))
    );

    // Rollback post creation
    if (post) {
      _deleteDocument(env.DATABASE_PRIMARY, env.COLLECTION_POST_INFO, post.$id);
    }
    console.log("Roll back complete");

    throw error;
  }
};

export const updateCaption = async (post_id: string, newCaption: string) => {
  try {
    return await _updateDocument(
      env.DATABASE_PRIMARY,
      env.COLLECTION_POST_INFO,
      post_id,
      {
        caption: newCaption,
      }
    );
  } catch (error) {
    console.log(`ERROR (postServices.ts => updateCaption) :: ${error}`);
    throw error;
  }
};

export const deletePost = async (post_id: string) => {
  try {
    const post = toPostInfo(
      await _getDocument(
        env.DATABASE_PRIMARY,
        env.COLLECTION_POST_INFO,
        post_id
      )
    );

    if (post.image_id && post.image_id.length !== 0) {
      post.image_id.forEach(async (id) => {
        _deleteFile(env.BUCKET_IMAGE, id);
      });
    }

    const result = await _deleteDocument(
      env.DATABASE_PRIMARY,
      env.COLLECTION_POST_INFO,
      post.id
    );
    console.log("Post Deleted. ID : ", post.id!);
    return result;
  } catch (error) {
    console.log(`ERROR (postServices.ts => deletePost) :: ${error}`);
    throw error;
  }
};

export const getFeedPosts = async (lastId?: string) => {
  try {
    if (lastId) {
      const posts = await _listDocuments(
        env.DATABASE_PRIMARY,
        env.COLLECTION_POST_INFO,
        [
          Query.orderDesc("created_at"),
          Query.limit(5),
          Query.cursorAfter(lastId),
        ]
      );
      return toPostInfoList(posts.documents);
    } else {
      const posts = await _listDocuments(
        env.DATABASE_PRIMARY,
        env.COLLECTION_POST_INFO,
        [Query.orderDesc("created_at"), Query.limit(5)]
      );
      return toPostInfoList(posts.documents);
    }
  } catch (error) {
    console.log(`ERROR (postServices.ts => getFeedPosts) :: ${error}`);
    throw error;
  }
};

export const getUserPostList = async (user_id: string) => {
  try {
    const postDoc = await _listDocuments(
      env.DATABASE_PRIMARY,
      env.COLLECTION_POST_INFO,
      [Query.equal("user_id", user_id)]
    );

    const postList: UserPostListType = {
      total: postDoc.total,
      post_info: toPostInfoList(postDoc.documents),
    };

    return postList;
  } catch (error) {
    console.log(`ERROR (postServices.ts => getUserPost) :: ${error}`);
    throw error;
  }
};

export const getPost = async (post_id: string) => {
  try {
    const postDoc = await _getDocument(
      env.DATABASE_PRIMARY,
      env.COLLECTION_POST_INFO,
      post_id
    );
    return toPostInfo(postDoc);
  } catch (error) {
    console.log(`ERROR (postServices.ts => getPost) :: ${error}`);
    throw error;
  }
};
