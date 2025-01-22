"use client";
import { MdEditor, ToolbarNames } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import { CreateArticleResp, Emoji } from "@/alova/globals";
import { ClientCreateArticle, ClientUploadImage } from "@/request/apis";
import { getBase64, RenderEmotion } from "@/utils";
import {
  PictureOutlined,
  SendOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { Button, Upload, UploadProps, Image, Popover } from "antd";
import React, { useState } from "react";
import Emotion from "../emotion";
import { useStore } from "zustand";
import { useAppStore } from "@/store";

type Props = {
  PublicSuccess: (params: CreateArticleResp) => void;
};

export function AppShortEditor({ PublicSuccess }: Props) {
  const [imageList, setImageList] = useState<string[]>([]);
  const [imageListID, setImageListID] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [previewTheme] = useState("arknights");
  const [toolbars] = useState<ToolbarNames[]>([]);
  const appStore = useStore(useAppStore, (state) => state);
  const publicMicroPost = () => {
    if (!text) return;
    ClientCreateArticle({
      content: RenderEmotion(appStore.emotions, text),
      type: "micro_post",
      status: "published",
      imageIds: imageListID,
    }).then((res) => {
      setText("");
      PublicSuccess(res);
    });
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
    <div>
      <div className="overflow-hidden">
        <MdEditor
          value={text}
          onChange={setText}
          preview={false}
          footers={[]}
          toolbars={toolbars}
          style={{ height: "fit-content", minHeight: "100px" }}
          previewTheme={previewTheme}
        />
      </div>
      <div className="image_list flex gap-2 mt-2">
        {imageList.map((item, index) => {
          return (
            <Image key={index} src={item} width={100} height={100} alt="" />
          );
        })}
      </div>
      <div className="flex justify-between items-center mt-2">
        <div className="left flex gap-6 text-md text-gray-500">
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
            <PictureOutlined className=" mx-1" />
            <span>图片</span>
          </Upload>
        </div>
        <div className="right">
          <Button
            type="primary"
            className="w-32"
            icon={<SendOutlined />}
            iconPosition="end"
            onClick={publicMicroPost}
          >
            发布
          </Button>
        </div>
      </div>
    </div>
  );
}
