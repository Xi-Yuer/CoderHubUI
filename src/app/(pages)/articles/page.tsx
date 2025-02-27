"use client";
import { GetArticle } from "@/alova/globals";
import AppArticlePreview from "@/app/_components/appArticlePreview";
import { ClientGetArticleList } from "@/request/apis";
import { useAppStore } from "@/store";
import { Card, Skeleton } from "antd";
import React, { useEffect, useRef, useState } from "react";

export default function Page() {
  const { userInfo } = useAppStore.getState();
  const [page, setPage] = useState(1);
  const [list, setList] = useState<GetArticle[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);
  const loadingRef = useRef(null); // 目标 DOM 元素

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading) {
          // 触发加载更多
          setPage((prev) => prev + 1);
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
  }, [loadingRef.current]);

  const getList = () => {
    if (!hasMore) return;
    setLoading(true);
    ClientGetArticleList("article", page, 10, userInfo.id)
      .then((res) => {
        if (!res.data) {
          setHasMore(false);
          return;
        } else {
          setList((pre) => {
            return [...pre, ...res.data];
          });
        }
      })
      .finally(() => {
        setLoading(false);
        setFirstLoad(false);
      });
  };

  useEffect(getList, [page, userInfo.id]);

  return (
    <div className="flex flex-wrap gap-4 justify-between">
      {/* 左侧推荐栏 */}
      <div className="hidden lg:flex w-[200px] h-full gap-4 flex-col">
        <Card>Recommend</Card>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col">
        {list?.map((item) => {
          return <AppArticlePreview article={item} key={item?.article?.id} />;
        })}
        {loading && firstLoad && (
          <div className="flex flex-col gap-10">
            {Array(3)
              .fill(0)
              .map((_, index) => {
                return (
                  <div
                    className="flex justify-between items-center gap-4 mt-2"
                    key={index}
                  >
                    <Skeleton active />
                    <Skeleton.Image active />
                  </div>
                );
              })}
          </div>
        )}
        <div ref={loadingRef} className="text-center mt-4 text-gray-400">
          {hasMore ? "Loaing" : "没有更多了"}
        </div>
      </div>

      {/* 右侧推荐栏 */}
      <div className="hidden xl:flex w-[250px] gap-4 flex-col">
        <Card>Recommend</Card>
        <Card>Recommend</Card>
      </div>
    </div>
  );
}
