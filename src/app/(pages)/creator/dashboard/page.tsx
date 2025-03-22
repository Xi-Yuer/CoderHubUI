"use client";
import { ClientGetCreatorInfo } from "@/request/apis/web";
import { Card, Tooltip } from "antd";
import React, { useEffect, useState } from "react";

export default function Page() {
  const [stats, setStats] = useState<any[]>([]);
  useEffect(() => {
    ClientGetCreatorInfo().then((res) => {
      const data = res.data;
      setStats([
        { label: "总粉丝数", value: data.followerCount },
        { label: "文章展现数", value: data.articlePV },
        { label: "创作天数", value: data.birthday + "天" },
        { label: "文章点赞数", value: data.likeCount },
        { label: "文章评论数", value: data.commentCount },
        { label: "文章收藏数", value: data.articleFavorCount },
      ]);
    });
  }, []);
  return (
    <Card title="数据概览">
      <div className="grid grid-cols-3 gap-4">
        {stats.map((item, index) => (
          <Card key={index}>
            <div className="text-gray-500 flex items-center space-x-1">
              <span>{item.label}</span>
            </div>
            <div className="text-2xl font-bold">{item.value}</div>
          </Card>
        ))}
      </div>
    </Card>
  );
}
