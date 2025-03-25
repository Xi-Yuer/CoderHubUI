"use client";
import "md-editor-rt/lib/style.css";
import { CreateArticleResp, Emoji } from "@/alova/globals";
import { ClientCreateArticle, ClientUploadImage } from "@/request/apis/web";
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
import { SHORT_ARTICLE_CATEGORY_ID } from "@/constant";
import AiEditor from "@/app/_components/AIEditor/init";

type Props = {
  PublicSuccess: (params: CreateArticleResp) => void;
};

export default function AppShortEditor({ PublicSuccess }: Props) {
  const [imageList, setImageList] = useState<string[]>([]);
  const [imageListID, setImageListID] = useState<string[]>([]);
  const [text, setText] = useState("");
  const appStore = useStore(useAppStore, (state) => state);
  const publicMicroPost = () => {
    if (!text) return;
    ClientCreateArticle({
      content: RenderEmotion(appStore.emotions, text),
      type: "micro_post",
      status: "published",
      imageIds: imageListID,
      categoryId: SHORT_ARTICLE_CATEGORY_ID,
    }).then((res) => {
      setText("");
      setImageList([]);
      setImageListID([]);
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
    <div className="relative">
      <div className="border comment">
        <AiEditor
          placeholder="输入正文内容，分享新鲜事"
          value={text}
          editable={!!appStore.token}
          allowUploadImage={false}
          textSelectionBubbleMenu={false}
          onChange={(val: string) => setText(val)}
          toolbarKeys={["ai"]}
          style={{ height: "content-fit", minHeight: 100 }}
          className="relative"
        />
      </div>
      <div className="image_list flex gap-2 mt-2">
        {imageList.map((item, index) => {
          return (
            <Image
              key={index}
              src={item || "/default-avatar.png"}
              width={100}
              height={100}
              alt=""
            />
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
            <div className="flex items-center gap-1 cursor-pointer hover:text-gray-950">
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
            <div className="flex items-center">
              <PictureOutlined className="mx-1" />
              <span>图片</span>
            </div>
          </Upload>
        </div>
        <div className="right">
          <Button
            type="primary"
            className="w-32"
            icon={<SendOutlined />}
            iconPosition="end"
            onClick={publicMicroPost}
            disabled={!appStore.token}
          >
            {appStore.token ? "发布" : "登录后发布"}
          </Button>
        </div>
      </div>
      {!appStore.token && (
        <div className="absolute top-10 bottom-0 left-0 right-0 w-full h-full z-10 p-2 cursor-not-allowed text-slate-500">
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
