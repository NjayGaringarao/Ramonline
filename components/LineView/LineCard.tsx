// import { colors, icons, images } from "@/constants";
// import React, { useState } from "react";
// import { TouchableOpacity, View, Text, Modal, Pressable } from "react-native";
// import { Image } from "expo-image";
// import { LineType } from "@/constants/types";
// import { getImagePreview } from "@/services/commonServices";
// import LineView from "./LineView";
// import CustomButton from "../CustomButton";

// type UserInterfaceType = {
//   onPress?: () => void;
//   text?: string;
// };

// type ILineCardProps = {
//   userInterface?: UserInterfaceType;
//   lineData?: LineType;
//   children?: React.ReactNode;
// };

// const LineCard = ({ userInterface, lineData, children }: ILineCardProps) => {
//   const [modalVisible, setModalVisible] = useState(false);

//   const openModal = () => {
//     setModalVisible(true);
//   };

//   const closeModal = () => {
//     setModalVisible(false);
//   };

//   const renderImage = (image_id: string) => {
//     try {
//       return getImagePreview(image_id);
//     } catch (error) {
//       console.log(`ERROR (PostView.tsx => renderImage) :: ${error}`);
//       return "";
//     }
//   };

//   return (
//     <>
//       <TouchableOpacity
//         onPress={lineData ? openModal : userInterface?.onPress}
//         className="ml-2 h-64 w-48 rounded-lg overflow-hidden"
//       >
//         <View className="w-full">
//           <View className="w-full h-48 justify-center items-center">
//             <Image
//               source={images.gate}
//               contentFit="cover"
//               className="absolute h-48 w-full opacity-40"
//             />
//             {children ? (
//               children
//             ) : (
//               <Image
//                 source={lineData && renderImage(lineData.banner_id)}
//                 contentFit="contain"
//                 tintColor={lineData ? undefined : colors.background}
//                 className={` ${
//                   lineData
//                     ? "h-full w-full opacity-100"
//                     : "h-36 w-full opacity-100"
//                 }`}
//               />
//             )}
//           </View>
//           <View className="h-16 bg-background items-center justify-center px-2">
//             <Text className="text-primary text-xl font-semibold">
//               {lineData ? lineData.name : userInterface?.text}
//             </Text>
//           </View>
//         </View>
//       </TouchableOpacity>

//       {/* Modal for lineView */}
//       <Modal
//         visible={modalVisible}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={closeModal}
//       >
//         <TouchableOpacity
//           className="absolute h-full w-full bg-black opacity-50"
//           onPress={() => {
//             setModalVisible(false);
//           }}
//         />
//         {lineData ? (
//           <View className=" flex-1 justify-center items-center">
//             <View className="w-11/12 h-auto bg-background rounded-lg overflow-hidden">
//               <LineView line={lineData} isInModal={true} />
//               <CustomButton
//                 handlePress={() => {
//                   setModalVisible(false);
//                 }}
//                 imageOnly={icons.close}
//                 imageStyles="h-5 w-5"
//                 iconTint={colors.uGray}
//                 withBackground={false}
//                 containerStyles="absolute right-0 top-8"
//               />
//             </View>
//           </View>
//         ) : (
//           <View className=" flex-1 justify-center items-center">
//             <View className="w-11/12 h-96 bg-background rounded-lg" />
//           </View>
//         )}
//       </Modal>
//     </>
//   );
// };

// export default LineCard;
