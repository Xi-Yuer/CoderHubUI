"use client";
import "md-editor-rt/lib/style.css";
import { CreateArticleResp, Emoji, Tag } from "@/alova/globals";
import {
  ClientCreateArticle,
  ClientGetSystemTags,
  ClientUploadImage,
} from "@/request/apis/web";
import { getBase64, RenderEmotion } from "@/utils";
import {
  CrownOutlined,
  PictureOutlined,
  RightOutlined,
  SendOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { Button, Upload, UploadProps, Image, Popover } from "antd";
import React, { useEffect, useState } from "react";
import Emotion from "../emotion";
import { useStore } from "zustand";
import { useAppStore } from "@/store";
import { DEFAULT_AVATAR, SHORT_ARTICLE_TYPE } from "@/constant";
import AiEditor from "@/app/_components/AIEditor/init";

type Props = {
  PublicSuccess: (params: CreateArticleResp) => void;
};

export default function AppShortEditor({ PublicSuccess }: Props) {
  const [imageList, setImageList] = useState<string[]>([]);
  const [imageListID, setImageListID] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [categoryOptions, setCategoryOptions] = useState<Tag[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const appStore = useStore(useAppStore, (state) => state);
  const publicMicroPost = () => {
    if (!text) return;
    ClientCreateArticle({
      content: RenderEmotion(appStore.emotions, text),
      type: "micro_post",
      status: "published",
      imageIds: imageListID,
      categoryId: categoryId,
    }).then((res) => {
      setText("");
      setImageList([]);
      setImageListID([]);
      PublicSuccess(res);
    });
  };

  // 处理圈子选择事件
  const handleCategoryChange = (item: Tag) => {
    setCategoryId(item.id);
    setCategoryName(item.name);
  };

  useEffect(() => {
    ClientGetSystemTags(SHORT_ARTICLE_TYPE)
      .then((res) => {
        if (!res?.data) return;
        setCategoryOptions(res?.data?.list);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

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
      <div className="border border-b-0 comment">
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
      <div
        className="image_list flex gap-2 mt-2 rounded-md overflow-hidden"
        style={{ borderRadius: "5px", overflow: "hidden" }}
      >
        {imageList?.map((item, index) => {
          return (
            <Image
              key={index}
              src={item || DEFAULT_AVATAR}
              width={100}
              height={100}
              alt=""
              className="rounded-md cursor-pointer object-cover"
              style={{ borderRadius: "5px", overflow: "hidden" }}
            />
          );
        })}
      </div>
      <Popover
        placement="bottom"
        content={
          <div className="flex flex-col gap-2 overflow-auto max-h-80">
            {categoryOptions?.map((item) => {
              return (
                <div
                  key={item.id}
                  className={`p-2 cursor-pointer ${
                    categoryId === item.id ? "bg-gray-200" : ""
                  }`}
                  onClick={() => handleCategoryChange(item)}
                >
                  {item.name}
                </div>
              );
            })}
          </div>
        }
      >
        <div className="md:hidden w-fit mt-4 flex items-center gap-1 cursor-pointer bg-black rounded-xl px-3 text-white text-[12px]">
          <span>
            <CrownOutlined />
          </span>
          <span># {categoryName ? categoryName : "选择圈子"}</span>
          <RightOutlined />
        </div>
      </Popover>
      <div className="flex justify-between items-center mt-2">
        <div className="left flex gap-6 text-md text-gray-500">
          <Popover
            placement="bottom"
            content={
              <div className="flex flex-col gap-2 overflow-auto max-h-80">
                {categoryOptions?.map((item) => {
                  return (
                    <div
                      key={item.id}
                      className={`p-2 cursor-pointer ${
                        categoryId === item.id ? "bg-gray-200" : ""
                      }`}
                      onClick={() => handleCategoryChange(item)}
                    >
                      {item.name}
                    </div>
                  );
                })}
              </div>
            }
          >
            <div className="hidden md:flex items-center w-fit text-nowrap gap-1 cursor-pointer bg-black rounded-xl px-3 text-white text-[12px]">
              <span>
                <CrownOutlined />
              </span>
              <span>
                # {categoryName ? categoryName : "选择圈子"} <RightOutlined />
              </span>
            </div>
          </Popover>
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
        <div className="absolute top-10 bottom-0 left-0 right-0 w-full h-full z-1 p-2 cursor-not-allowed text-slate-500">
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
