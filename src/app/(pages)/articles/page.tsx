"use client";
import { GetArticle } from "@/alova/globals";
import AppArticlePreview from "@/app/_components/appArticlePreview";
import { ClientGetArticleList } from "@/request/apis";
import { useAppStore } from "@/store";
import { Card } from "antd";
import React, { useEffect } from "react";

export default function Page() {
  const { userInfo } = useAppStore();
  const [list, setList] = React.useState<GetArticle[]>([]);
  const [hasMore, setHasMore] = React.useState(true);
  useEffect(() => {
    if (!userInfo.id || !hasMore) return;
    ClientGetArticleList("article", 1, 10, userInfo.id).then((res) => {
      setList([...list, ...res.data]);
      setHasMore(res.data.length === 10);
    });
  }, [userInfo.id]);
  return (
    <div className="flex flex-wrap gap-4 justify-between">
      {/* 左侧推荐栏 */}
      <div className="hidden lg:flex w-[200px] h-full gap-4 flex-col">
        <Card>Recommend</Card>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col">
        {list?.map((item) => {
          return <AppArticlePreview article={item} key={item.article.id} />;
        })}
      </div>

      {/* 右侧推荐栏 */}
      <div className="hidden xl:flex w-[250px] gap-4 flex-col">
        <Card>Recommend</Card>
        <Card>Recommend</Card>
      </div>
    </div>
  );
}
