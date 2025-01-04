// import React from "react";
// import { Modal, View, Text, TouchableOpacity } from "react-native";
// import CustomButton from "../CustomButton";
// import MiniPostView from "./MiniPostView";
// import { PostType } from "@/constants/types";
// import { colors, icons } from "@/constants";

// type Props = {
//   visible: boolean;
//   onClose: () => void;
//   post: PostType;
//   onEditPress: () => void;
//   onNotifyPress: () => void;
//   onDelete: () => void;
// };

// const ModalOptions = ({
//   visible,
//   onClose,
//   post,
//   onEditPress,
//   onNotifyPress,
//   onDelete,
// }: Props) => (
//   <Modal visible={visible} transparent animationType="slide">
//     <TouchableOpacity
//       className="absolute w-full h-full bg-black opacity-70"
//       onPress={onClose}
//     />

//     <View className="absolute bottom-0 w-full justify-center bg-background p-4 rounded-t-lg overflow-hidden">
//       <View className="mb-4 flex-row justify-between overflow-hidden">
//         <Text className="text-2xl text-gray-950 font-semibold">
//           Manage Post
//         </Text>
//         <CustomButton
//           handlePress={onClose}
//           imageOnly={icons.close}
//           iconTint={colors.uGray}
//           imageStyles="h-5 w-5"
//           withBackground={false}
//           containerStyles="-mr-4"
//         />
//       </View>
//       <MiniPostView post={post} />
//       <View className="w-full h-auto">
//         <CustomButton
//           title="Notify Line"
//           handlePress={onNotifyPress}
//           containerStyles="h-10 w-full mb-1"
//         />
//         <CustomButton
//           title="Edit Caption"
//           handlePress={onEditPress}
//           containerStyles="h-9 w-full border-2 border-primary mb-1"
//           textStyles="text-primary"
//           withBackground={false}
//         />
//         <CustomButton
//           title="Delete Post"
//           handlePress={onDelete}
//           containerStyles="h-9 w-full border-2 border-primary"
//           textStyles="text-primary"
//           withBackground={false}
//         />
//       </View>
//     </View>
//   </Modal>
// );

// export default ModalOptions;
