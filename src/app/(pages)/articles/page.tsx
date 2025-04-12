"use client";
import { GetArticle, Tag } from "@/alova/globals";
import { LONG_ARTICLE_TYPE } from "@/constant";
import { ClientGetArticleList, ClientGetSystemTags } from "@/request/apis/web";
import { useAppStore } from "@/store";
import { Button, Card, Skeleton, Tabs } from "antd";
import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
import Signin from "@/app/_components/signin/signin";
import { useStore } from "zustand";
import Acknowledgement from "@/app/_components/acknowledgement";
import { MoneyCollectOutlined } from "@ant-design/icons";

const AppArticlePreview = dynamic(
  () => import("@/app/_components/appArticlePreview"),
  { ssr: false } // 禁用服务器端渲染
);
const AppIcon = dynamic(
  () => import("@/app/_components/appIcon"),
  { ssr: false } // 禁用服务器端渲染
);

export default function Page() {
  const { userInfo } = useStore(useAppStore, (state) => state);
  const [page, setPage] = useState(1);
  const [list, setList] = useState<GetArticle[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [currentTag, setCurrentTag] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [getTagLoading, setGetTagLoading] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);
  const loadingRef = useRef(null); // 目标 DOM 元素
  const [isMobile, setIsMobile] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && currentTag) {
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

  function changeMobile() {
    if (window.innerWidth < 768) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }

  useEffect(() => {
    changeMobile();
    window.addEventListener("resize", changeMobile);
    return () => {
      window.removeEventListener("resize", changeMobile);
    };
  }, []);

  const getList = () => {
    if (!currentTag) return;
    if (!hasMore) return;
    setLoading(true);
    // 当选择全部分类时，不传入 category_id
    const categoryId = currentTag === "all" ? undefined : currentTag;
    ClientGetArticleList("article", page, 10, categoryId, userInfo.id)
      .then((res) => {
        if (!res?.data) {
          setHasMore(false);
          return;
        } else {
          setList((pre) => {
            return [...pre, ...(res?.data?.list || [])];
          });
        }
      })
      .finally(() => {
        setLoading(false);
        setFirstLoad(false);
      });
  };

  const getSideTags = () => {
    setGetTagLoading(true);
    ClientGetSystemTags(LONG_ARTICLE_TYPE)
      .then((res) => {
        const originalTags = res.data?.list || [];
        // 添加全部分类
        const allCategory = {
          id: "all",
          name: "全部",
          icon: "", // 可根据实际情况设置图标
        };
        const newTags = [allCategory, ...originalTags] as Tag[];
        setTags(newTags);
        setCurrentTag(newTags[0]?.id);
      })
      .finally(() => {
        setFirstLoad(false);
        setGetTagLoading(false);
      });
  };

  useEffect(getSideTags, []);

  useEffect(getList, [page, userInfo.id, currentTag]);

  const SideBar = () => (
    <div className="lg:flex w-[200px] h-full gap-4 flex-col sticky top-[74px]">
      <Card className="flex flex-col flex-1 w-full items-center justify-center gap-10 !border-none">
        {!isMobile && getTagLoading && (
          <>
            {Array(5)
              .fill(0)
              .map((_, index) => {
                return (
                  <div
                    className="flex-1 text-base justify-start cursor-pointer text-slate-600 w-40 py-2"
                    key={index}
                  >
                    <Skeleton.Node active style={{ height: 20 }} />
                  </div>
                );
              })}
          </>
        )}
        {tags?.map((item) => {
          return (
            <div key={item.id}>
              <Button
                type="text"
                className={`
            flex-1 text-base justify-start cursor-pointer text-slate-600 w-40 !py-4 my-2
             ${currentTag === item.id ? "!bg-slate-100" : ""}
            `}
                onClick={() => {
                  if (currentTag !== item.id) {
                    setHasMore(true);
                  }
                  setPage(1);
                  setList([]);
                  setCurrentTag(item.id);
                }}
              >
                <span className="text-start w-full flex gap-2">
                  <AppIcon type={item.icon} />
                  {item.name}
                </span>
              </Button>
            </div>
          );
        })}
      </Card>
    </div>
  );

  return (
    <div className="flex flex-wrap gap-4 justify-between">
      {/* 左侧推荐栏 */}
      {isMobile ? (
        <>
          {/* 左侧分类选择区域，在移动端展示到顶部 */}
          <div className="lg:hidden w-full flex gap-4 flex-col bg-white px-4">
            <Tabs
              onChange={(key) => {
                if (currentTag !== key) {
                  setHasMore(true);
                }
                setPage(1);
                setList([]);
                setCurrentTag(key);
              }}
              activeKey={currentTag as string}
              items={tags?.map((option) => ({
                key: option.id,
                label: option.name,
              }))}
            ></Tabs>
          </div>
        </>
      ) : (
        <SideBar />
      )}

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
          {loading ? "Loaing" : "没有更多了"}
        </div>
      </div>
      {/* 右侧推荐栏 */}
      <div className="hidden xl:flex w-[250px] gap-4 flex-col h-full sticky top-[74px]">
        <Card>
          <Signin />
        </Card>
        <Card title="广告位招租">
          <Acknowledgement />
        </Card>
      </div>
    </div>
  );
}
