"use client";
import { Image } from "antd";
import { MdPreview } from "md-editor-rt";
import React from "react";
import { GetArticle } from "@/alova/globals";
import AppShartControl from "../appShortControl";
import { PREVIEW_THEME } from "@/constant";

export default function AppShortPreview({ item }: { item: GetArticle }) {
  return (
    <div>
      <AppShartControl article={item}>
        <MdPreview value={item.article.content} previewTheme={PREVIEW_THEME} />
        <div className="flex flex-wrap gap-2 mt-2 px-6 rounded-md cursor-pointer object-cover">
          {item?.article?.imageUrls?.map((url, index) => (
            <div className="cursor-pointer object-cover" key={index}>
              <Image
                src={url}
                alt=""
                width={120}
                height={120}
                className="object-cover"
                style={{ borderRadius: "3px", overflow: "hidden" }}
              />
            </div>
          ))}
        </div>
      </AppShartControl>
    </div>
  );
}
