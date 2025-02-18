"use client";
import { Image } from "antd";
import { MdPreview } from "md-editor-rt";
import React from "react";
import { GetArticle } from "@/alova/globals";
import AppShartControl from "../appShortControl";
import DOMPurify from "dompurify";

export default function AppShortPreview({
  item,
  showComment,
}: {
  item: GetArticle;
  showComment?: boolean;
}) {
  return (
    <div>
      <AppShartControl article={item} showComment={showComment}>
        <MdPreview
          value={item.article.content}
          sanitize={(html) => {
            return DOMPurify.sanitize(html);
          }}
        />
        <div className="grid grid-cols-2 gap-2 mt-2 px-6">
          {item.article.imageUrls.map((url, index) => (
            <div className="flex flex-wrap" key={index}>
              <Image src={url} alt="" className="w-20" width={120} />
            </div>
          ))}
        </div>
      </AppShartControl>
    </div>
  );
}
