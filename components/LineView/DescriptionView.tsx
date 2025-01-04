// import React, { useState } from "react";
// import { Text, TouchableOpacity, View, ScrollView } from "react-native";
// import { LineType, PostType } from "@/constants/types";

// type IDescriptionProps = {
//   line: LineType;
//   isInModal?: boolean;
// };

// const DescriptionView: React.FC<IDescriptionProps> = ({ line, isInModal }) => {
//   if (!line.description) return null;

//   // Handling long captions
//   const isLongCaption = line.description.length > 150;
//   const [isExpanded, setIsExpanded] = useState(false);

//   const toggleExpand = () => {
//     setIsExpanded((prev) => !prev);
//   };

//   // Logic for displaying the caption
//   if (!isLongCaption) {
//     return (
//       <View className=" mb-2 border-t-4 border-primary max-h-32">
//         <Text className="pl-4 text-base">{line.description}</Text>
//       </View>
//     );
//   } else if (isLongCaption && !isInModal) {
//     const displayedCaption = isExpanded
//       ? line.description
//       : `${line.description.slice(0, 100)}...`;

//     return (
//       <TouchableOpacity onPress={toggleExpand}>
//         <Text className="p-2 text-base text-left font-normal border-t-4 border-primary">
//           {displayedCaption}
//           <Text className="font-semibold">
//             {isExpanded ? " Show Less" : " Show More"}
//           </Text>
//         </Text>
//       </TouchableOpacity>
//     );
//   } else if (isLongCaption && !isInModal) {
//     const displayedCaption = isExpanded
//       ? line.description
//       : `${line.description.slice(0, 150)}...`;

//     return (
//       <TouchableOpacity onPress={toggleExpand}>
//         <Text className="p-2 text-base text-left font-normal border-t-4 border-primary">
//           {displayedCaption}
//           <Text className="font-semibold">
//             {isExpanded ? " Show Less" : " Show More"}
//           </Text>
//         </Text>
//       </TouchableOpacity>
//     );
//   } else if (isLongCaption && isInModal) {
//     return (
//       <ScrollView
//         showsVerticalScrollIndicator={true}
//         className="px-2 mb-2 border-t-4 border-primary max-h-32"
//       >
//         <Text className="text-base text-left font-normal">
//           {line.description}
//         </Text>
//       </ScrollView>
//     );
//   } else {
//     return (
//       <View className=" mb-2 border-t-4 border-primary max-h-32">
//         <Text className="pl-4 text-base">{line.description}</Text>
//       </View>
//     );
//   }
// };

// export default DescriptionView;
