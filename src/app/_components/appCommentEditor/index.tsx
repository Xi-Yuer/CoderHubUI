"use client";
import "md-editor-rt/lib/style.css";
import { Emoji } from "@/alova/globals";
import { ClientUploadImage } from "@/request/apis/web";
import { getBase64, RenderEmotion } from "@/utils";
import { PictureOutlined, SmileOutlined } from "@ant-design/icons";
import { Button, Upload, UploadProps, Image, Popover, Spin } from "antd";
import React, { useState } from "react";
import Emotion from "../emotion";
import { useStore } from "zustand";
import { useAppStore } from "@/store";
import dynamic from "next/dynamic";
import { simpleToolbarKeys } from "../AIEditor/toolbarKeys";

type Props = {
  entityID: string;
  publicSuccess: (params: { content: string; imageIds: string[] }) => void;
  cancel: () => void;
};

const AIEditor = dynamic(() => import("@/app/_components/AIEditor/init"), {
  ssr: false,
  loading: () => <Spin style={{ margin: "0 auto" }} />,
});

export function AppCommentEditor({ publicSuccess, cancel, entityID }: Props) {
  const [imageList, setImageList] = useState<string[]>([]);
  const [imageListID, setImageListID] = useState<string[]>([]);
  const [text, setText] = useState("");
  const appStore = useStore(useAppStore, (state) => state);

  const confirmAction = () => {
    if (!text && imageListID.length == 0) return;
    publicSuccess({
      content: RenderEmotion(appStore.emotions, text),
      imageIds: imageListID,
    });
    cancelAction();
  };

  const cancelAction = () => {
    setText("");
    setImageList([]);
    setImageListID([]);
    cancel();
  };

  const props: UploadProps = {
    name: "file",
    accept: "image/*",
    showUploadList: false,
    maxCount: 4,
    beforeUpload(file) {
      return false;
    },
    disabled: !appStore.token,
    async onChange(info) {
      // 预览列表
      const fileBase64 = await getBase64(info.file as unknown as File);
      setImageList((prev) => [...prev, fileBase64]);
      // 上传图片
      ClientUploadImage(info.file as unknown as File).then((res) => {
        setImageListID((prev) => [...prev, res.data.image_id]);
      });
    },
  };
  return (
    <div className="relative">
      <div className="overflow-hidden relative">
        <div className="border relative h-fit comment">
          <AIEditor
            placeholder="输入正文内容，支持 Markdown 语法.."
            value={text}
            editable={!!appStore.token}
            allowUploadImage={false}
            textSelectionBubbleMenu={false}
            onChange={(val: string) => setText(val)}
            toolbarKeys={simpleToolbarKeys}
            style={{ height: "content-fit", minHeight: 100 }}
            className="relative"
          ></AIEditor>
          <div className="image_list flex gap-2 mb-10 mx-2 mt-2">
            {imageList.map((item, index) => {
              return (
                <Image
                  src={item}
                  key={index}
                  width={100}
                  height={100}
                  alt={item}
                  className="object-cover"
                />
              );
            })}
          </div>
          <div className="flex gap-6 absolute bottom-2 left-2 text-gray-500">
            <Popover
              placement="bottom"
              content={
                appStore.token && (
                  <Emotion
                    onClick={(emoji: Emoji) => {
                      setText(text + emoji.code);
                    }}
                  />
                )
              }
            >
              <div
                className={`flex gap-1 ${!appStore.token ? "cursor-not-allowed text-[#bfbfbf]" : "cursor-pointer hover:text-gray-950"}`}
              >
                <span>
                  <SmileOutlined />
                </span>
                <span>表情</span>
              </div>
            </Popover>
            <Upload
              {...props}
              className="flex cursor-pointer !text-gray-500 hover:!text-gray-950"
            >
              <PictureOutlined className="mx-1" />
              <span>图片</span>
            </Upload>
          </div>
          <div className="flex justify-between items-center mt-2 absolute bottom-2 right-2">
            <div className="left flex gap-6 text-md text-gray-500">
              <Button
                type="primary"
                onClick={confirmAction}
                disabled={!appStore.token}
              >
                {appStore.token ? "发送" : "登录后发送"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
