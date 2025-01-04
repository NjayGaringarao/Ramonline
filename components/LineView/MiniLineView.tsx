// import React from "react";
// import { View, Text } from "react-native";
// import { Image } from "expo-image";
// import { LineType, UserType } from "@/constants/types";
// import DescriptionView from "./DescriptionView";
// import { getDisplayName, getDisplayRole } from "@/lib/definedAlgo";
// import ProfilePicture from "../ProfilePicture";
// import { getImagePreview } from "@/services/commonServices";

// type MiniPostViewProps = {
//   line: LineType;
//   user: UserType;
// };

// const MiniLineView = ({ line, user }: MiniPostViewProps) => {
//   return (
//     <View className="w-full h-auto px-2 bg-background items-center justify-center rounded-md shadow-lg shadow-primary mb-4">
//       <View className="w-full h-auto  justify-center ">
//         <View className="flex-row space-x-2 h-auto items-center ml-2 my-2">
//           <ProfilePicture
//             userInfo={user}
//             imageStyle="h-7 w-7 rounded-lg"
//             imageContentFit="cover"
//           />
//           <View className="justify-center">
//             <Text className="text-base font-semibold">
//               {getDisplayName(user)}
//             </Text>
//             <Text className="text-xs font-mono -mt-1">
//               {getDisplayRole(user)}
//             </Text>
//           </View>
//         </View>
//       </View>
//       <View className="overflow-hidden h-auto m-2 bg-primary w-full rounded-md">
//         <Image
//           source={{ uri: getImagePreview(line.banner_id) }}
//           className="w-full h-52"
//           contentFit="cover"
//         />
//       </View>
//       <View className="h-auto w-full">
//         <Text className="text-xl text-primary font-semibold py-2">
//           {line.name}
//         </Text>
//         <DescriptionView line={line} isInModal={true} />
//       </View>
//     </View>
//   );
// };

// export default MiniLineView;
