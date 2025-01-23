import { env } from "@/constants/env";
import { _getFilePreview } from "./appwrite";

export const getImagePreview = (
  file_ID: string,
  quality?: number,
  width?: number,
  height?: number
) => {
  let fileUrl;

  try {
    fileUrl = _getFilePreview(
      env.BUCKET_IMAGE,
      file_ID,
      quality,
      width,
      height
    );

    return fileUrl.toString();
  } catch (error) {
    console.log(`ERROR (commonServices.ts => getImagePreview) :: ${error}`);
    throw error;
  }
};
