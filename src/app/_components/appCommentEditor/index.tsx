"use client";
import { MdEditor, ToolbarNames } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import { Emoji } from "@/alova/globals";
import { ClientUploadImage } from "@/request/apis/web";
import { getBase64, RenderEmotion } from "@/utils";
import { PictureOutlined, SmileOutlined } from "@ant-design/icons";
import { Button, Upload, UploadProps, Image, Popover } from "antd";
import React, { useState } from "react";
import Emotion from "../emotion";
import { useStore } from "zustand";
import { useAppStore } from "@/store";

type Props = {
  entityID: string;
  publicSuccess: (params: { content: string; imageIds: string[] }) => void;
  cancel: () => void;
};

export function AppCommentEditor({ publicSuccess, cancel, entityID }: Props) {
  const [imageList, setImageList] = useState<string[]>([]);
  const [imageListID, setImageListID] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [previewTheme] = useState("arknights");
  const [toolbars] = useState<ToolbarNames[]>([]);
  const appStore = useStore(useAppStore, (state) => state);
  const [editorHeight, setEditorHeight] = useState("50px");

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
        <div className="border relative h-fit">
          <MdEditor
            value={text}
            onChange={setText}
            preview={false}
            footers={[]}
            toolbars={toolbars}
            placeholder={appStore.token ? "平等表达，友善交流" : ""}
            onFocus={() => {
              setEditorHeight("100px");
            }}
            style={{
              height: "fit-content",
              minHeight: editorHeight,
              border: "none",
              paddingBottom: "0px",
              transition: "all 0.2s ease-in-out",
            }}
            previewTheme={previewTheme}
          />
          <div className="image_list flex gap-2 mb-10 mx-2">
            {imageList.map((item, index) => {
              return (
                <Image src={item} key={index} width={100} height={100} alt="" />
              );
            })}
          </div>
          <div className="flex gap-6 absolute bottom-2 left-2 text-gray-500">
            <Popover
              placement="bottom"
              content={
                <Emotion
                  onClick={(emoji: Emoji) => {
                    setText(text + emoji.code);
                  }}
                />
              }
            >
              <div className="flex gap-1 cursor-pointer hover:text-gray-950">
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
              <Button type="primary" onClick={confirmAction}>
                发送
              </Button>
            </div>
          </div>
        </div>
      </div>
      {!appStore.token && (
        <div className="absolute top-0 bottom-0 left-0 right-0 w-full h-full z-10 p-2 cursor-not-allowed text-slate-500">
          点击
          <Button
            type="link"
            onClick={() => appStore.setShowLoginPanel(true)}
            className="!p-1"
          >
            登录
          </Button>
          , 和大家分享你此刻的心情
        </div>
      )}
    </div>
  );
}
