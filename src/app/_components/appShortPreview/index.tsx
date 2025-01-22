import { Card, Image } from "antd";
import { MdPreview } from "md-editor-rt";
import React from "react";
import { GetArticle } from "@/alova/globals";
import AppShartControl from "../appShortControl";

export default function AppShortPreview({ item }: { item: GetArticle }) {
  return (
    <Card>
      <AppShartControl article={item}>
        <div className="mt-4">
          <MdPreview value={item.article.content} />
          <div className="grid grid-cols-2 gap-2 mt-2">
            {item.article.imageUrls.map((url, index) => (
              <div className="flex flex-wrap" key={index}>
                <Image src={url} alt="" className="w-20" width={120} />
              </div>
            ))}
          </div>
        </div>
      </AppShartControl>
    </Card>
  );
}
