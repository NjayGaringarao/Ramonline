// import { View, Text, Modal, TouchableOpacity } from "react-native";
// import React, { useEffect, useState } from "react";
// import PostView from "../PostView/PostView";
// import { LineType, NotificationType, PostType } from "@/constants/types";
// import { getPost } from "@/services/postServices";
// import { getLine } from "@/services/lineServices";
// import Loading from "../Loading";
// import CustomButton from "../CustomButton";
// import { colors, icons } from "@/constants";
// import { formatDateToLocal } from "@/lib/definedAlgo";

// interface ModalNotificationType {
//   notification: NotificationType;
//   isVisible: boolean;
//   onClose: () => void;
// }

// const ModalNotification = ({
//   notification,
//   isVisible,
//   onClose,
// }: ModalNotificationType) => {
//   const [post, setpost] = useState<PostType>();
//   const [line, setLine] = useState<LineType>();
//   const [isLoading, setIsLoading] = useState(false);

//   const queryData = async () => {
//     setIsLoading(true);
//     try {
//       setpost(await getPost(notification.post_id));
//       setLine(await getLine(notification.line_id));
//     } catch {}
//     setIsLoading(false);
//   };

//   useEffect(() => {
//     queryData();
//   }, []);

//   return (
//     <Modal visible={isVisible} transparent animationType="none">
//       <View className="flex-1 justify-center">
//         <TouchableOpacity
//           className="h-full w-full flex-1 absolute items-center bg-black opacity-80"
//           onPress={onClose}
//         />
//         <View className="w-11/12 h-auto bg-background rounded-lg justify-center relative self-center px-2 py-4 overflow-hidden">
//           <View className="flex-row justify-between items-center w-full px-2 mb-4">
//             <Text
//               className="text-xl font-semibold text-primary"
//               numberOfLines={1}
//             >
//               {notification.title}
//             </Text>
//             <CustomButton
//               handlePress={onClose}
//               imageOnly={icons.close}
//               iconTint={colors.uGray}
//               imageStyles="h-5 w-5"
//               withBackground={false}
//               containerStyles="-mr-2"
//             />
//           </View>
//           <View className="w-full bg-background shadow-lg shadow-primary items-center mb-2">
//             {post ? (
//               <PostView post={post} isInModal={true} />
//             ) : isLoading ? (
//               <Loading loadingPrompt="Loading" containerStyles="m-4" />
//             ) : (
//               <Text className="my-6 text-lg">
//                 The post seems to be deleted by the owner.
//               </Text>
//             )}
//           </View>
//           <View className="px-1">
//             <Text className="text-sm text-gray-900">
//               {"Recieve from\t: "}
//               <Text className="font-semibold">
//                 {line?.name.concat(" Line")}
//               </Text>
//             </Text>
//             <Text className="text-sm text-gray-900">
//               {"Recieve time\t: "}
//               <Text className="font-semibold">
//                 {formatDateToLocal(notification.created_at)}
//               </Text>
//             </Text>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// export default ModalNotification;
