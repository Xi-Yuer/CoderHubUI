"use client";
import { GetArticle } from "@/alova/globals";
import AppArticlePreview from "@/app/_components/appArticlePreview";
import AppShortPreview from "@/app/_components/appShortPreview";
import { ClientSearch } from "@/request/apis/web";
import { Card, Input, Tabs } from "antd";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

export default function Page() {
  const searchParams = useSearchParams();
  const [keywords, setSearchKeywords] = useState<string>();
  const [type, setType] = useState<"article" | "micro_post">();
  const [articleList, setArticleList] = useState<GetArticle[]>([]);
  const [microPostList, setMicroPostList] = useState<GetArticle[]>([]);
  const [articlePage, setArticlePage] = useState<number>(1);
  const [microPostPage, setMicroPostPage] = useState<number>(1);
  const [inputValue, setInputValue] = useState<string>("");
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(null); // 目标 DOM 元素

  useEffect(() => {
    setSearchKeywords(searchParams.get("keywords") as string);
    setType(searchParams.get("type") as "article" | "micro_post");
  }, [searchParams]);

  const getArticleList = async () => {
    if (!keywords || type !== "article") return;
    const res = await ClientSearch("article", keywords, articlePage, 10);
    if (!res?.data.list) {
      setHasMore(false);
      return;
    }
    if (res?.data) {
      setArticleList(res?.data?.list || []);
      setArticlePage(res?.data?.total || 0);
    }
  };

  const getMicroPostList = async () => {
    if (!keywords || type !== "micro_post") return;
    const res = await ClientSearch("micro_post", keywords, microPostPage, 10);
    if (!res?.data.list) {
      setHasMore(false);
      return;
    }
    if (res?.data) {
      setMicroPostList(res?.data?.list || []);
      setArticlePage(res?.data?.total || 0);
    }
  };

  useEffect(() => {
    if (type === "article") {
      getArticleList();
    } else if (type === "micro_post") {
      getMicroPostList();
    }
  }, [keywords, type, articlePage, microPostPage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // 触发加载更多
          if (type === "article") {
            setArticlePage((prev) => prev + 1);
          }
          if (type === "micro_post") {
            setMicroPostPage((prev) => prev + 1);
          }
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

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <Input.Search
          placeholder="请输入搜索内容"
          allowClear
          size="large"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          onClear={() => {
            setInputValue("");
            setSearchKeywords("");
            setArticlePage(1);
          }}
          onSearch={() => {
            setSearchKeywords(inputValue);
            setArticlePage(1);
            setMicroPostPage(1);
            if (type === "article") {
              getArticleList();
            } else if (type === "micro_post") {
              getMicroPostList();
            }
          }}
        />
      </Card>
      <Card>
        <Tabs
          defaultActiveKey="micro_post"
          onChange={(key) => {
            setType(key as "article" | "micro_post");
            setArticlePage(1);
            setMicroPostPage(1);
            if (key === "article") {
              getArticleList();
            } else if (key === "micro_post") {
              getMicroPostList();
            }
          }}
          items={[
            {
              key: "micro_post",
              label: "圈子",
              children: (
                <div>
                  {microPostList.map((item) => (
                    <div key={item?.article?.id}>
                      <AppShortPreview item={item} />
                    </div>
                  ))}
                </div>
              ),
            },
            {
              key: "article",
              label: "文章",
              children: (
                <div>
                  {articleList.map((item) => (
                    <div key={item?.article?.id}>
                      <AppArticlePreview article={item} />
                    </div>
                  ))}
                </div>
              ),
            },
          ]}
        />
        <div ref={loadingRef} className="text-center mt-4 text-gray-400">
          {hasMore ? "Loading" : "没有更多了"}
        </div>
      </Card>
    </div>
  );
}
