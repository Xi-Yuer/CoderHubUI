"use client";
import { GetArticle } from "@/alova/globals";
import AppArticlePreview from "@/app/_components/appArticlePreview";
import { ClientGetUserArticles } from "@/request/apis/web";
import { useAppStore } from "@/store";
import { List } from "antd";
import React, { useEffect, useState } from "react";
import { useStore } from "zustand";

interface Props {
  userID: string;
}
export default function MicroPost({ userID }: Props) {
  const { userInfo } = useStore(useAppStore, (state) => state);
  const [list, setList] = useState<GetArticle[]>();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    ClientGetUserArticles(userInfo.id, userID, "article", page, 10).then(
      (res) => {
        setList(res.data?.list || []);
        setTotal(res.data?.total || 0);
      }
    );
  }, [userID, page]);
  return (
    <List
      pagination={{
        onChange: setPage,
        total: total,
        pageSize: 10,
      }}
      dataSource={list}
      renderItem={(item) => (
        <div key={item?.article?.id}>
          <AppArticlePreview article={item} />
        </div>
      )}
    ></List>
  );
}
