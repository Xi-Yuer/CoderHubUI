"use client";
import { Image, Popover } from "antd";
import { MdPreview } from "md-editor-rt";
import React from "react";
import { GetArticle } from "@/alova/globals";
import { ClientSendComment } from "@/request/apis/web";
import AppCommentList, { appendCommentRefCallBack } from "../appCommentList";
import { AppCommentEditor } from "../appCommentEditor";
import { formatTime } from "@/utils";
import { EyeOutlined } from "@ant-design/icons";
import AppUserInfoMationPopUP from "../appUserInfomationPopup";
import Operation from "@/app/(pages)/post/_components/operation";
import Link from "next/link";
import { DEFAULT_AVATAR, getLevel, PREVIEW_THEME } from "@/constant";

export default function AppArticlePreviewDetail({
  item,
}: {
  item: GetArticle;
}) {
  const appCommentListRef = React.useRef<appendCommentRefCallBack>(null);
  const [articleFromProps, setArticleFromProps] = React.useState(item);

  return (
    <div>
      {articleFromProps?.article?.type === "article" && (
        <>
          <h1 className="text-3xl p-4 pb-0 font-semibold">
            {articleFromProps.article.title}
          </h1>
          <div className="flex gap-4 px-4 pt-6">
            <Link
              href={`/user/${articleFromProps.author.id}`}
              target="_blank"
              className="text-slate-700 cursor-pointer hover:text-slate-950 flex items-center"
            >
              {articleFromProps.author.nickname ||
                articleFromProps.author.username}
              <Image
                width={25}
                height={25}
                preview={false}
                src={getLevel(articleFromProps.author.level).svg.src}
                alt={getLevel(articleFromProps.author.level).name}
                className="ml-1"
              ></Image>
            </Link>
            <span className="text-gray-400">
              {formatTime(articleFromProps.article.createdAt)}
            </span>
            <span className="text-gray-400 flex gap-1">
              <EyeOutlined />
              {articleFromProps.article.viewCount}
            </span>
          </div>
        </>
      )}
      {articleFromProps?.article?.type === "micro_post" && (
        <div className="flex items-center justify-between space-x-3 mt-4">
          <div className="flex items-center space-x-3 cursor-pointer">
            <Popover
              placement="bottomLeft"
              destroyTooltipOnHide
              content={
                <AppUserInfoMationPopUP
                  id={articleFromProps.article.authorId}
                />
              }
            >
              <Link
                href={`/user/${articleFromProps.author.id}`}
                target="_blank"
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg"
              >
                <Image
                  src={articleFromProps.author.avatar || DEFAULT_AVATAR}
                  alt="Avatar"
                  preview={false}
                  className="rounded-full"
                ></Image>
              </Link>
            </Popover>
            <div>
              <Link
                href={`/user/${articleFromProps.author.id}`}
                className="font-bold text-gray-800 flex items-center"
              >
                {articleFromProps.author.nickname ||
                  articleFromProps.author.username}
                <Image
                  width={25}
                  height={25}
                  preview={false}
                  src={getLevel(articleFromProps.author.level).svg.src}
                  alt={getLevel(articleFromProps.author.level).name}
                  className="ml-1"
                ></Image>
              </Link>
              <p className="text-sm text-gray-500">
                {formatTime(articleFromProps.article.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      )}
      <MdPreview
        value={item?.article?.content}
        id="preview-only"
        previewTheme={PREVIEW_THEME}
      />
      <div className="grid grid-cols-2 gap-2 mt-2 px-6">
        {item?.article?.imageUrls?.map((url, index) => (
          <div className="flex flex-wrap" key={index}>
            <Image src={url} alt="" className="w-20" width={120} />
          </div>
        ))}
      </div>
      <Operation id={item?.article?.id} />
      <div className="mt-10 border-t pt-4 px-2 lg:px-6">
        <AppCommentEditor
          publicSuccess={async (params) => {
            await ClientSendComment({
              entity_author_id: articleFromProps?.author?.id,
              entity_id: articleFromProps?.article?.id,
              content: params.content,
              image_ids: params.imageIds,
              root_id: "",
              parent_id: "",
              reply_to_uid: "",
            })
              .send()
              .then((res) => {
                appCommentListRef.current?.appendComment(res.data);
                setArticleFromProps((prev) => ({
                  ...prev,
                  article: {
                    ...prev.article,
                    commentCount: prev.article.commentCount
                      ? prev.article.commentCount + 1
                      : 1,
                  },
                }));
              });
          }}
          cancel={() => {}}
          entityID={articleFromProps?.article?.id}
        />
        <AppCommentList
          entityID={articleFromProps?.article?.id}
          ref={appCommentListRef}
        />
      </div>
    </div>
  );
}
