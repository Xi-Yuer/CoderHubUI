"use client";
import { Image } from "antd";
import { MdPreview } from "md-editor-rt";
import React from "react";
import { GetArticle } from "@/alova/globals";
import AppShartControl from "../appShortControl";

export default function AppShortPreview({ item }: { item: GetArticle }) {
  return (
    <div>
      <AppShartControl article={item}>
        <MdPreview value={item.article.content} />
        <div className="grid grid-cols-2 gap-2 mt-2 px-6">
          {item.article.imageUrls.map((url, index) => (
            <div className="flex flex-wrap" key={index}>
              <Image src={url} alt="" width={120} height={120} />
            </div>
          ))}
        </div>
      </AppShartControl>
    </div>
  );
}
