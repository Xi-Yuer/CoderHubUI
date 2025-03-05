"use client";
import { GetArticle } from "@/alova/globals";
import AppShortPreview from "@/app/_components/appShortPreview";
import { ClientGetArticleList } from "@/request/apis";
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
};
export default function MicroPostList({ ref }: Props) {
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
    if (!hasMore) return;
    setLoading(true);
    ClientGetArticleList(
      "micro_post",
      "154833878727528448",
      page,
      10,
      userInfo.id
    )
      .send(reFreshed)
      .then((res) => {
        if (!res.data) {
          setHasMore(false);
          return;
        }
        setList((pre) => {
          return [...pre, ...res.data];
        });
      })
      .finally(() => {
        setLoading(false);
        setFirstLoad(false);
      });
  };

  // 导出函数，使得其他页面可以刷新列表
  const refreshList = () => {
    setList([]);
    setPage(1);
    // 强制刷新页面数据
    getList(true);
  };

  useImperativeHandle(
    ref,
    function () {
      return {
        refreshList,
      };
    },
    []
  );

  useEffect(getList, [page]);
  return (
    <Card>
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
        {hasMore ? "Loaing" : "没有更多了"}
      </div>
    </Card>
  );
}
