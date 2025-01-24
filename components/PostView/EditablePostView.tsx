import { View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { PostType } from "@/types/models";
import { useGlobalContext } from "@/context/GlobalProvider";
import UserBanner from "../UserBanner";
import ImageDisplay from "./ImageDisplay";
import { router } from "expo-router";
import CaptionView from "./CaptionView";
import AdaptiveTime from "../AdaptiveTime";
import ModalOptions from "./ModalOptions";
import { deletePost, updateCaption } from "@/services/postServices";
import Toast from "react-native-root-toast";
import { confirmAction } from "@/lib/commonUtil";
import CustomButton from "../CustomButton";
import { colors, icons } from "@/constants";
import ModalEditCaption from "./ModalEditCaption";

type IEditablePostViewProps = {
  post: PostType.Info;
};

const EditablePostView = ({ post }: IEditablePostViewProps) => {
  const { userInfo, setIsRefreshPostFeed, refreshUserRecord } =
    useGlobalContext();
  const [isThisVisible, setIsThisVisible] = useState(true);
  const [isModalOptionVisible, setIsModalOptionVisible] = useState(false);
  const [isModalEditVisible, setIsModalEditVisible] = useState(false);
  const [captionForm, setCaptionForm] = useState<string>("");

  const updatePostHandle = async () => {
    const isConfirm = await confirmAction(
      "Confirm Changes",
      "Do you really want to save the changes you've made?"
    );

    if (isConfirm) {
      const result = await updateCaption(post.id!, captionForm);

      post.caption = captionForm;
      setIsModalEditVisible(false);
      setIsModalOptionVisible(false);
      if (result)
        Toast.show(`Post updated`, {
          duration: Toast.durations.LONG,
        });
    }
  };

  const deletePostHandle = async () => {
    const isConfirmed = await confirmAction(
      "Confirm Deletion",
      "Do you really want to delete this post?"
    );

    if (isConfirmed) {
      if (await deletePost(post.id)) {
        refreshUserRecord({
          post: true,
        });
        setIsRefreshPostFeed(true);
        setIsThisVisible(false);
        Toast.show(`Post deleted`, {
          duration: Toast.durations.LONG,
        });
      }
    }
  };

  useEffect(() => {
    setCaptionForm(post.caption!);
  }, []);

  return (
    <View
      className={`w-full h-auto pb-10 bg-background p-2 ${
        isThisVisible ? "visible" : "hidden"
      }`}
    >
      <View className="w-full h-auto my-2 flex-row justify-between">
        <UserBanner userInfo={userInfo} />
        <CustomButton
          handlePress={() => {
            setIsModalOptionVisible(true);
          }}
          containerStyles={`-mr-2 bg-transparent`}
        >
          <Image
            source={icons.options}
            className="h-7 w-7"
            tintColor={colors.uGray}
          />
        </CustomButton>
      </View>
      <View className="rounded-t-lg overflow-hidden">
        <ImageDisplay
          imageIds={post.image_id}
          onImagePress={() =>
            router.navigate(`/(content)/post/image/${post.id}`)
          }
        />
      </View>

      <CaptionView post={post} />

      <AdaptiveTime
        isoDate={post.created_at.toISOString()}
        textStyles="self-end pr-4 pt-2 text-gray-600"
      />

      <ModalEditCaption
        visible={isModalEditVisible}
        initialCaption={post.caption || ""}
        onSave={updatePostHandle}
        onClose={() => {
          setIsModalEditVisible(false);
          setCaptionForm(post.caption!);
        }}
        setCaptionForm={(captionForm) => setCaptionForm(captionForm)}
        captionForm={captionForm}
      />

      {/* <ModalSendNotification
            visible={isModalNotifyVisible}
            selectedLines={selectedLines}
            onDone={() => {
              sendNotificationHandle();
            }}
            onClose={() => {
              setIsModalNotifyVisible(false);
              setSelectedLines([]);
              setNotificationTitle("");
            }}
            handleSelectLine={(line) => handleSelectLine(line)}
            notificationTitle={notificationTitle}
            setNotificationTitle={(notificationTitle) =>
              setNotificationTitle(notificationTitle)
            }
          /> */}
      <ModalOptions
        visible={isModalOptionVisible}
        onClose={() => setIsModalOptionVisible(false)}
        post={post}
        onEditPress={() => setIsModalEditVisible(true)}
        onNotifyPress={() => {}}
        onDelete={deletePostHandle}
      />
    </View>
  );
};

export default EditablePostView;
