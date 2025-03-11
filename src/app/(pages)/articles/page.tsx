"use client";
import { GetArticle, Tag } from "@/alova/globals";
import { AppIcon } from "@/app/_components";
import AppArticlePreview from "@/app/_components/appArticlePreview";
import { ClientGetArticleList, ClientGetSystemTags } from "@/request/apis";
import { useAppStore } from "@/store";
import { MenuOutlined } from "@ant-design/icons";
import { Button, Card, Drawer, FloatButton, Skeleton } from "antd";
import React, { useEffect, useRef, useState } from "react";

export default function Page() {
  const { userInfo } = useAppStore.getState();
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

  function changeMobile() {
    if (window.innerWidth < 768) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsMobile(true);
    }
    window.addEventListener("resize", changeMobile);
    return () => {
      window.removeEventListener("resize", changeMobile);
    };
  }, []);

  const getList = () => {
    if (!currentTag) return;
    if (!hasMore) return;
    setLoading(true);
    ClientGetArticleList("article", currentTag, page, 10, userInfo.id)
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

  const getSideTags = () => {
    setGetTagLoading(true);
    ClientGetSystemTags()
      .then((res) => {
        setTags(res.data?.list || []);
        setCurrentTag(res.data?.list[0].id);
      })
      .finally(() => {
        setGetTagLoading(false);
      });
  };

  useEffect(getSideTags, []);

  useEffect(getList, [page, userInfo.id, currentTag]);

  const SideBar = () => (
    <div className="lg:flex w-[200px] h-full gap-4 flex-col">
      <Card className="flex flex-col flex-1 w-full items-center justify-center gap-10 !border-none">
        {getTagLoading && (
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
          <FloatButton
            type="primary"
            icon={<MenuOutlined />}
            onClick={() => setDrawerVisible(true)}
          ></FloatButton>
          <Drawer
            title="文章"
            placement="left"
            closable
            onClose={() => setDrawerVisible(false)}
            open={drawerVisible}
            width={"250px"}
          >
            <SideBar />
          </Drawer>
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
