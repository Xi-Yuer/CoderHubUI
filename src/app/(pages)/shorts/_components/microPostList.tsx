"use client";
import { GetArticle } from "@/alova/globals";
import AppShortPreview from "@/app/_components/appShortPreview";
import { SHORT_ARTICLE_TYPE } from "@/constant";
import { ClientGetArticleList } from "@/request/apis/web";
import { useAppStore } from "@/store";
import { Card, Skeleton } from "antd";
import React, {
  Ref,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

export type RefCallBack = {
  refreshList: () => void;
};

type Props = {
  ref: Ref<RefCallBack>;
  categoryId?: string;
};
export default function MicroPostList({ ref, categoryId }: Props) {
  const [page, setPage] = useState(1);
  const [list, setList] = useState<GetArticle[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);
  const loadingRef = useRef(null); // 目标 DOM 元素

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
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

  const getList = (reFreshed = false) => {
    const { userInfo } = useAppStore.getState();
    setLoading(true);
    ClientGetArticleList(
      SHORT_ARTICLE_TYPE,
      reFreshed ? 1 : page,
      10,
      categoryId,
      userInfo.id
    )
      .send(reFreshed)
      .then((res) => {
        if (!res?.data) {
          setHasMore(false);
          return;
        }
        if (page === 1 || reFreshed) {
          setList(res.data);
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

  // 导出函数，使得其他页面可以刷新列表
  const refreshList = () => getList(true);

  useImperativeHandle(
    ref,
    function () {
      return {
        refreshList,
      };
    },
    []
  );

  useEffect(getList, [page, categoryId]);

  useEffect(() => {
    setList([]);
    setHasMore(true);
    setPage(1);
  }, [categoryId]);

  return (
    <div className="flex">
      {/* 右侧微动态列表区域 */}
      <Card className="px-2 py-6 flex-1">
        {list?.map((item) => {
          return (
            <div key={item?.article?.id}>
              <AppShortPreview item={item} />
            </div>
          );
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
          {hasMore ? "Loading" : "没有更多了"}
        </div>
      </Card>
    </div>
  );
}
