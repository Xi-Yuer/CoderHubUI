"use client";
import { GetArticle } from "@/alova/globals";
import {
  EyeOutlined,
  LikeOutlined,
  MessageOutlined,
  LikeFilled,
} from "@ant-design/icons";
import { Image } from "antd";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface AppArticlePreviewProps {
  article: GetArticle;
}

export default function AppArticlePreview({ article }: AppArticlePreviewProps) {
  const [isMobile, setIsMobile] = useState(true);

  function changeMobile() {
    if (window.innerWidth < 768) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }

  useEffect(() => {
    changeMobile();
    window.addEventListener("resize", changeMobile);
    return () => {
      window.removeEventListener("resize", changeMobile);
    };
  }, []);
  return (
    <Link
      href={`/post/${article.article.id}`}
      target="_blank"
      className="bg-white rounded-lg border-b py-2 px-4 cursor-pointer transition-all duration-300 hover:bg-gray-50"
    >
      <div className="flex justify-between">
        {/* 左侧内容 */}
        <div className="flex-1 flex flex-col justify-between w-full sm:mr-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              {article.article.title}
            </h2>
            <div className="mt-1 text-gray-400 text-[13px] max-h-12 mb-4 line-clamp-2">
              {article.article.summary}
            </div>
          </div>
        </div>
        <div>
          {/* 图片区域 */}
          {article.article.coverImage && (
            <div className="rounded-lg bg-white overflow-hidden w-full sm:w-[160px] sm:flex justify-center items-center mt-4 sm:mt-0">
              <Image
                src={article.article.coverImage}
                alt=""
                style={{ objectFit: "cover", borderRadius: "0.3rem" }}
                width={isMobile ? 100 : 160}
                height={isMobile ? 60 : 100}
                preview={false}
              />
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 min-w-0 flex flex-wrap items-center justify-between mt-2">
        {/* 底部信息区域 */}
        <div className="flex text-gray-400">
          <div className="flex gap-4 sm:gap-6 mb-2 sm:mb-0 flex-shrink-0">
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
        </div>
        <div className="flex justify-center items-center">
          {article.article?.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-block bg-gray-200 px-2 text-slate-500 text-[12px] mr-2 truncate max-w-[120px]"
            >
              {tag}
            </span>
          ))}
          {article.article?.tags?.length > 3 && (
            <span className="inline-block bg-gray-200 px-2 text-slate-500 text-[12px] mr-2">
              +{article.article.tags.length - 3}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
