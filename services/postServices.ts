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
import { PostType, UserType } from "@/constants/types";
import { toPost, toPostList } from "@/lib/typeConverter";
import { COLLECTION_POST_ID } from "@/constants/variables";

export const uploadImages = async (ImagePickerResults: ImagePickerAsset[]) => {
  const uploadedImages: Models.File[] = [];
  try {
    for (let i = 0; i < ImagePickerResults.length; i++) {
      const imageFile = await _uploadFile({
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
        _deleteFile(uploadedImages[i].$id);
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
  user: UserType,
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

    post = await _createDocument(COLLECTION_POST_ID, ID.unique(), {
      caption: caption,
      image_ids: image_ids,
      created_at: new Date().toISOString(),
      user: user.id,
    });

    // This should mark the image as a part of the post
    // Therefore, cleaner will not delete the file
    await Promise.all(
      imagesFiles.map((file) =>
        _updateFile(file.$id, `Post Image ${post?.$id}`)
      )
    );

    return post;
  } catch (error) {
    // Rollback file uploads
    await Promise.all(imagesFiles.map((file) => _deleteFile(file.$id)));

    // Rollback post creation
    if (post) {
      _deleteDocument(COLLECTION_POST_ID, post.$id);
    }
    console.log("Roll back complete");

    throw error;
  }
};

export const updateCaption = async (post_id: string, newCaption: string) => {
  try {
    return await _updateDocument(COLLECTION_POST_ID, post_id, {
      caption: newCaption,
    });
  } catch (error) {
    console.log(`ERROR (postServices.ts => updateCaption) :: ${error}`);
    throw error;
  }
};

export const deletePost = async (post: PostType) => {
  const audio_id = post.audio_id;
  const image_ids = post.image_ids;

  try {
    if (image_ids && image_ids.length !== 0) {
      console.log(image_ids.length);
      image_ids.forEach(async (id) => {
        _deleteFile(id);
      });
    }

    if (audio_id && audio_id.length !== 0) _deleteFile(audio_id);

    const result = await _deleteDocument(COLLECTION_POST_ID, post.id!);
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
      const posts = await _listDocuments(COLLECTION_POST_ID, [
        Query.orderDesc("created_at"),
        Query.limit(5),
        Query.cursorAfter(lastId),
      ]);
      return toPostList(posts.documents);
    } else {
      const posts = await _listDocuments(COLLECTION_POST_ID, [
        Query.orderDesc("created_at"),
        Query.limit(5),
      ]);
      return toPostList(posts.documents);
    }
  } catch (error) {
    console.log(`ERROR (postServices.ts => getFeedPosts) :: ${error}`);
    throw error;
  }
};

export const getPost = async (post_id: string) => {
  try {
    const postDoc = await _getDocument(COLLECTION_POST_ID, post_id);
    return toPost(postDoc);
  } catch (error) {
    console.log(`ERROR (postServices.ts => getPost) :: ${error}`);
    throw error;
  }
};
