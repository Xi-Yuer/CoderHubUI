import { GetArticle } from "@/alova/globals";
import {
  EyeOutlined,
  LikeOutlined,
  MessageOutlined,
  LikeFilled,
} from "@ant-design/icons";
import { Image } from "antd";
import { MdPreview } from "md-editor-rt";
import Link from "next/link";
import React from "react";

interface AppArticlePreviewProps {
  article: GetArticle;
}

export default function AppArticlePreview({ article }: AppArticlePreviewProps) {
  return (
    <Link
      href={`/post/${article.article.id}`}
      target="_blank"
      className="bg-white rounded-lg border-b py-2 px-4 flex flex-col sm:flex-row justify-between items-start cursor-pointer transition-all duration-300 hover:bg-gray-50"
    >
      <div className="flex-1 mb-4 sm:mb-0">
        <h2 className="text-lg font-semibold text-slate-800">
          {article.article.title}
        </h2>
        <div className="mt-1 text-gray-400 text-[13px] max-h-12 mb-4 line-clamp-2">
          {article.article.summary}
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-1 text-gray-400">
          <div className="flex gap-4 sm:gap-6 mb-2 sm:mb-0">
            <span className="text-sm">
              {article.author.nickname || article.author.username}
            </span>
            <span className="text-sm">
              <EyeOutlined className="mr-1" />
              {article.article.viewCount}
            </span>
            <span className="text-sm">
              {article.article.isLiked ? (
                <LikeFilled className="mr-1" />
              ) : (
                <LikeOutlined className="mr-1" />
              )}
              {article.article.likeCount}
            </span>
            <span className="text-sm">
              <MessageOutlined className="mr-1" />
              {article.article.commentCount}
            </span>
          </div>
          <div>
            {article.article?.tags?.map((tag) => (
              <span
                key={tag}
                className="inline-block bg-gray-200 px-2 text-slate-500 text-[12px] mr-2"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      {article.article.coverImage && (
        <div className="rounded-lg overflow-hidden w-full sm:w-[180px] hidden sm:flex justify-center items-center">
          <Image
            src={article.article.coverImage}
            alt=""
            width="100%"
            height={100}
            preview={false}
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </Link>
  );
}
