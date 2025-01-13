import React, { useState, useEffect } from "react";
import { View, Text, Modal, Image, Alert } from "react-native";
import { WebView } from "react-native-webview";
import { LineType, PostType, UserType } from "@/types/models";
import { deletePost, updateCaption } from "@/services/postServices";
import {
  confirmAction,
  getDisplayName,
  getDisplayRole,
  getHTMLImageRender,
} from "@/lib/commonUtil";
import CustomButton from "../CustomButton";
import Toast from "react-native-root-toast";
import MiniPostView from "./MiniPostView";
import CaptionView from "./CaptionView";
import { colors, icons } from "@/constants";
import { getImagePreview } from "@/services/commonServices";
import ProfilePicture from "../ProfilePicture";
import { notifyLine } from "@/services/lineServices";
import ModalEditCaption from "./ModalEditCaption";
import ModalSendNotification from "./ModalSendNotification";
import ModalOptions from "./ModalOptions";
import ImageDisplay from "./ImageDisplay";
import AdaptiveTime from "../AdaptiveTime";
import { getUserInfo } from "@/services/userServices";
import { useGlobalContext } from "@/context/GlobalProvider";
type IPostViewProps = {
  post: PostType.Info;
  isModifyable?: boolean;
  isMiniture?: boolean;
  isInModal?: boolean;
};

const PostView = ({
  post,
  isModifyable,
  isMiniture,
  isInModal,
}: IPostViewProps) => {
  const { setIsRefreshFeeds, refreshUserRecord, userRecord } =
    useGlobalContext();
  const [isModalImageVisible, setIsModalImageVisible] = useState(false);
  const [isModalOptionVisible, setIsModalOptionVisible] = useState(false);
  const [isModalEditVisible, setIsModalEditVisible] = useState(false);
  const [isModalNotifyVisible, setIsModalNotifyVisible] = useState(false);
  const [isThisVisible, setIsThisVisible] = useState(true);
  const [captionForm, setCaptionForm] = useState<string>("");
  const [selectedLines, setSelectedLines] = useState<LineType.Info[]>([]);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [owner, setOwner] = useState<UserType.Info>(Object);

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
          info: true,
          activity: false,
          line: false,
          post: false,
        });
        setIsRefreshFeeds(true);
        setIsThisVisible(false);
        Toast.show(`Post deleted`, {
          duration: Toast.durations.LONG,
        });
      }
    }
  };

  const handleSelectLine = (line: LineType.Info) => {
    setSelectedLines((prev) =>
      prev.find((selectedLine) => selectedLine.id === line.id)
        ? prev.filter((selectedLine) => selectedLine.id !== line.id)
        : [...prev, line]
    );
  };

  const sendNotificationHandle = async () => {
    if (
      !(
        (await confirmAction(
          "Send Notification",
          "Are you sure you want to send this post as notification? This action will take effect immediately and cannot be undone."
        )) && selectedLines.length > 0
      )
    )
      return;

    setIsModalNotifyVisible(false);
    setIsModalOptionVisible(false);

    for (let i = 0; selectedLines.length > i; i++) {
      const result = await notifyLine(
        notificationTitle,
        selectedLines[i].id,
        post.id
      );

      if (result?.responseStatusCode == 200) {
        Toast.show(`Notification sent on ${selectedLines[i].name} line`, {
          duration: Toast.durations.LONG,
        });
      } else {
        Toast.show(
          `Failed to send notification on ${selectedLines[i].name} line`,
          { duration: Toast.durations.LONG }
        );
      }
    }

    setSelectedLines([]);
  };

  useEffect(() => {
    setCaptionForm(post.caption!);
    if (userRecord.info.id == post.user_id) {
      setOwner(userRecord.info);
    } else {
      getUserInfo(post.user_id).then((e) => {
        setOwner(e);
      });
    }
  }, []);

  if (isMiniture) {
    return <MiniPostView post={post} />;
  }
  return (
    <View
      className={`w-full h-auto pb-10 bg-background p-2 ${
        isThisVisible ? "visible" : "hidden"
      }`}
    >
      {/* Header */}
      <View className="w-full h-auto my-2">
        <View className="flex-row justify-between items-center">
          <View className="flex-row gap-2 h-12 items-center">
            <ProfilePicture
              userInfo={owner}
              imageStyle="h-12 w-12 rounded-full"
            />
            <View className="justify-center">
              <Text className="text-lg font-semibold">
                {getDisplayName(owner)}
              </Text>
              <Text className="text-xs font-mono -mt-1">
                {getDisplayRole(owner)}
              </Text>
            </View>
          </View>
          <CustomButton
            handlePress={() => {
              setIsModalOptionVisible(true);
            }}
            containerStyles={`-mr-2 bg-transparent ${
              isModifyable ? "visible" : "hidden"
            }`}
          >
            <Image
              source={icons.options}
              className="h-7 w-7"
              tintColor={colors.uGray}
            />
          </CustomButton>
          {!isModifyable && (
            <View>
              <AdaptiveTime
                isoDate={post.created_at.toISOString()}
                textStyles="self-end pr-4 text-gray-600"
              />
            </View>
          )}
        </View>
      </View>
      {/* Images */}
      <View className="rounded-t-lg overflow-hidden">
        <ImageDisplay
          imageIds={post.image_id}
          onImagePress={() => setIsModalImageVisible(true)}
        />
      </View>

      {isInModal ? (
        <CaptionView post={post} isMiniPostView={true} />
      ) : (
        <CaptionView post={post} />
      )}

      {isModifyable && (
        <AdaptiveTime
          isoDate={post.created_at.toISOString()}
          textStyles="self-end pr-4 pt-2 text-gray-600"
        />
      )}

      {isModifyable ? (
        <>
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

          <ModalSendNotification
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
          />
          <ModalOptions
            visible={isModalOptionVisible}
            onClose={() => setIsModalOptionVisible(false)}
            post={post}
            onEditPress={() => {
              setIsModalEditVisible(true);
            }}
            onNotifyPress={() => {
              if (userRecord.line.total == 0) {
                Alert.alert(
                  "No Line",
                  "You do not own any `Line`. Please create one."
                );
              } else {
                setIsModalNotifyVisible(true);
              }
            }}
            onDelete={deletePostHandle}
          />
        </>
      ) : null}

      {/* Full-Screen Modal to preview images */}
      <Modal
        visible={isModalImageVisible}
        transparent={false}
        animationType="slide"
      >
        <View className="flex-1 bg-black">
          <WebView
            originWhitelist={["*"]}
            source={{
              html: getHTMLImageRender(post.image_id, getImagePreview),
            }}
            style={{ flex: 1 }}
            scalesPageToFit={true}
            bounces={true}
            showsVerticalScrollIndicator={false}
          />

          <View className="absolute top-0 w-full h-16 bg-black opacity-70" />
          <CustomButton
            handlePress={() => setIsModalImageVisible(false)}
            containerStyles="absolute top-5 left-0 bg-transparent"
          >
            <Image source={icons.back} className="h-6 w-6" tintColor={"#fff"} />
          </CustomButton>
        </View>
      </Modal>
    </View>
  );
};

export default PostView;
