"use client";
import { GetArticle } from "@/alova/globals";
import AppShortPreview from "@/app/_components/appShortPreview";
import { ClientGetArticleList } from "@/request/apis";
import React, { Ref, useEffect, useImperativeHandle, useRef, useState } from "react";

export type RefCallBack = {
  refreshList: () => void;
};

type Props = {
  ref: Ref<RefCallBack>;
};
export default function MicroPostList({ ref }: Props) {
  const [page, setPage] = useState(1);
  const [list, setList] = useState<GetArticle[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(null); // 目标 DOM 元素

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // 触发加载更多
          setPage((prev) => prev + 1)
        }
      },
      {
        threshold: 0.1, // 元素至少 10% 可见时触发
      }
    );

    const target = loadingRef.current;
    if (target) {
      observer.observe(target); // 开始观察
    }

    return () => {
      if (target) {
        observer.unobserve(target); // 停止观察
      }
    };
  }, []);

  const getList = (refreshed = false) => {
    if (!hasMore) return
    ClientGetArticleList("micro_post", page, 10).send(refreshed).then((res) => {
      setList([...list, ...res.data || []]);
      if (!res.data) {
        setHasMore(false)
      }
    });
  }

  // 导出函数，使得其他页面可以刷新列表
  const refreshList = () => {
    setList([]);
    setPage(1);
    // 强制刷新页面数据
    getList(true);
  };


  useImperativeHandle(ref, function () {
    return {
      refreshList
    }
  }, [])

  useEffect(getList, [page]);
  return (
    <div>
      {list?.map((item) => {
        return (
          <div key={item.article.id} className="mt-4">
            <AppShortPreview item={item} />
          </div>
        );
      })}
      <div ref={loadingRef} className="text-center mt-4 text-gray-400">{hasMore ? "Loaing" : "没有更多了"}</div>
    </div>
  );
}
