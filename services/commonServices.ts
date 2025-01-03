import { _getFilePreview } from "./appwrite";

export const getImagePreview = (fileId: string) => {
  let fileUrl;

  try {
    fileUrl = _getFilePreview(fileId);

    return fileUrl.toString();
  } catch (error) {
    console.log(`ERROR (commonServices.ts => getImagePreview) :: ${error}`);
    throw error;
  }
};
