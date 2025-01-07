import { env } from "@/constants/env";
import { _getFilePreview } from "./appwrite";

export const getImagePreview = (file_ID: string) => {
  let fileUrl;

  try {
    fileUrl = _getFilePreview(env.BUCKET_IMAGE, file_ID);

    return fileUrl.toString();
  } catch (error) {
    console.log(`ERROR (commonServices.ts => getImagePreview) :: ${error}`);
    throw error;
  }
};
