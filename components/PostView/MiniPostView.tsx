// import React from "react";
// import { View, Text, FlatList } from "react-native";
// import { Image } from "expo-image";
// import { getImagePreview } from "@/services/commonServices"; // Adjust the import based on your project structure
// import { PostType } from "@/constants/types";
// import CaptionView from "./CaptionView";
// import { getDisplayName, getDisplayRole } from "@/lib/definedAlgo";
// import ProfilePicture from "../ProfilePicture";
// import AdaptiveTime from "../AdaptiveTime";

// type MiniPostViewProps = {
//   post: PostType;
// };

// const MiniPostView = ({ post }: MiniPostViewProps) => {
//   const renderImage = (imageId: string) => {
//     try {
//       return getImagePreview(imageId);
//     } catch (error) {
//       console.log(`ERROR (MiniaturePostView => renderImage) :: ${error}`);
//       return "";
//     }
//   };

//   return (
//     <View className="w-full h-auto px-2 mb-4 bg-background items-center justify-center rounded-md shadow-md shadow-primary">
//       <View className="w-full h-auto justify-center ">
//         <View className="flex-row space-x-2 h-auto items-center mx-2 mt-2">
//           <ProfilePicture
//             userInfo={post.user}
//             imageStyle="h-8 w-8 rounded-lg"
//             imageContentFit="cover"
//           />

//           <View className="justify-center">
//             <Text className="text-base font-semibold">
//               {getDisplayName(post.user)}
//             </Text>
//             <Text className="text-xs font-mono -mt-1">
//               {getDisplayRole(post.user)}
//             </Text>
//           </View>
//         </View>

//         {/* Miniature Caption */}
//         <CaptionView post={post} isMiniPostView={true} />
//       </View>

//       {/* Images for Miniature */}
//       <View className="overflow-hidden h-auto m-2 bg-panel w-full rounded-md">
//         <FlatList
//           data={post.image_ids}
//           keyExtractor={(item) => item.toString()}
//           horizontal={true}
//           showsHorizontalScrollIndicator={true}
//           renderItem={({ item }) => (
//             <Image
//               source={{ uri: renderImage(item) }}
//               className="w-36 h-36"
//               contentFit="cover"
//             />
//           )}
//           ListFooterComponent={
//             <View
//               className={`${
//                 post.image_ids?.length == 0 ? "h-16" : "h-36"
//               } w-36 items-center justify-around`}
//             >
//               <Text className="text-sm text-primary">
//                 {post.image_ids?.length == 0
//                   ? "No Image to Show"
//                   : "Nothing\nFollows"}
//               </Text>
//             </View>
//           }
//         />
//       </View>
//       <View className="w-full py-1 items-end">
//         <AdaptiveTime
//           isoDate={post.created_at!}
//           isFullDate
//           textStyles="text-gray-600"
//         />
//       </View>
//     </View>
//   );
// };

// export default MiniPostView;
