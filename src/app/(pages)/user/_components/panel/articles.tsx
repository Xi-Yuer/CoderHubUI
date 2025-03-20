"use client";
import { GetArticle } from "@/alova/globals";
import AppArticlePreview from "@/app/_components/appArticlePreview";
import AppShortPreview from "@/app/_components/appShortPreview";
import { ClientGetUserArticles } from "@/request/apis/web";
import { useAppStore } from "@/store";
import { Empty, Pagination } from "antd";
import React, { useEffect, useState } from "react";

interface Props {
  userID: string;
}
export default function MicroPost({ userID }: Props) {
  const { userInfo } = useAppStore();
  const [list, setList] = useState<GetArticle[]>();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    ClientGetUserArticles(userInfo.id, userID, "article", page, 10).then(
      (res) => {
        setList(res.data.list);
        setTotal(res.data.total);
      }
    );
  }, [userID, page]);
  return (
    <>
      <div>
        {list?.map((item) => {
          return (
            <div key={item?.article?.id}>
              <AppArticlePreview article={item} />
            </div>
          );
        })}
        <div className="mt-2">
          <Pagination
            current={page}
            total={total}
            pageSize={10}
            onChange={setPage}
          />
        </div>
      </div>
      {list && list.length === 0 && <Empty />}
    </>
  );
}
