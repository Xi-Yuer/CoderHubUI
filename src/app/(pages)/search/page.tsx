"use client";
import { GetArticle } from "@/alova/globals";
import AppArticlePreview from "@/app/_components/appArticlePreview";
import AppShortPreview from "@/app/_components/appShortPreview";
import { ClientSearch } from "@/request/apis/web";
import { Card, Input, Tabs, Spin } from "antd";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState, useCallback } from "react";

type ContentType = "article" | "micro_post";

export default function Page() {
  const searchParams = useSearchParams();
  const [keywords, setKeywords] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [type, setType] = useState<ContentType>("article");
  const [articleList, setArticleList] = useState<GetArticle[]>([]);
  const [microPostList, setMicroPostList] = useState<GetArticle[]>([]);
  const [articlePage, setArticlePage] = useState<number>(1);
  const [microPostPage, setMicroPostPage] = useState<number>(1);
  const [hasMoreArticle, setHasMoreArticle] = useState<boolean>(true);
  const [hasMoreMicroPost, setHasMoreMicroPost] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const loadingRef = useRef<HTMLDivElement>(null);
  const isFetchingRef = useRef<boolean>(false); // 防止重复请求

  // 初始化：从 URL 获取参数
  useEffect(() => {
    const kw = searchParams.get("keywords");
    const tp = searchParams.get("type") as ContentType;
    if (kw) {
      setKeywords(kw);
      setInputValue(kw);
    }
    if (tp === "article" || tp === "micro_post") {
      setType(tp);
    }
  }, [searchParams]);

  const resetState = () => {
    setArticleList([]);
    setMicroPostList([]);
    setArticlePage(1);
    setMicroPostPage(1);
    setHasMoreArticle(true);
    setHasMoreMicroPost(true);
  };

  const fetchData = async (
    isArticle: boolean,
    page: number,
    isNewSearch = false
  ) => {
    if (isFetchingRef.current || !keywords) return;

    isFetchingRef.current = true;
    setLoading(true);

    try {
      const res = await ClientSearch(
        isArticle ? "article" : "micro_post",
        keywords,
        page,
        10
      );

      const list = res?.data?.list || [];

      if (list.length === 0) {
        if (isArticle) {
          setHasMoreArticle(false);
        } else {
          setHasMoreMicroPost(false);
        }
        return;
      }

      if (isArticle) {
        setArticleList((prev) => (isNewSearch ? list : [...prev, ...list]));
        setArticlePage((prev) => (isNewSearch ? 2 : prev + 1));
      } else {
        setMicroPostList((prev) => (isNewSearch ? list : [...prev, ...list]));
        setMicroPostPage((prev) => (isNewSearch ? 2 : prev + 1));
      }
    } catch (error) {
      console.error("搜索失败:", error);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  // keywords 或 type 变化时重新搜索
  useEffect(() => {
    if (!keywords) return;

    resetState();

    if (type === "article") {
      fetchData(true, 1, true);
    } else {
      fetchData(false, 1, true);
    }
  }, [keywords, type]);

  // 滚动触发加载更多
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading && !isFetchingRef.current) {
          if (type === "article" && hasMoreArticle) {
            fetchData(true, articlePage);
          } else if (type === "micro_post" && hasMoreMicroPost) {
            fetchData(false, microPostPage);
          }
        }
      },
      { threshold: 0.1 }
    );

    const target = loadingRef.current;
    if (target) observer.observe(target);
    return () => {
      if (target) observer.unobserve(target);
    };
  }, [
    loading,
    type,
    articlePage,
    microPostPage,
    hasMoreArticle,
    hasMoreMicroPost,
  ]);

  const onSearch = (value: string) => {
    setKeywords(value.trim());
  };

  const onClearSearch = () => {
    setInputValue("");
    setKeywords("");
    resetState();
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <Input.Search
          placeholder="请输入搜索内容"
          allowClear
          size="large"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onSearch={onSearch}
          onClear={onClearSearch}
        />
      </Card>
      <Card>
        <Tabs
          activeKey={type}
          onChange={(key) => setType(key as ContentType)}
          items={[
            {
              key: "micro_post",
              label: "圈子",
              children: (
                <div>
                  {microPostList.map((item) => (
                    <div key={item.article?.id}>
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
                    <div key={item.article?.id}>
                      <AppArticlePreview article={item} />
                    </div>
                  ))}
                </div>
              ),
            },
          ]}
        />
        <div ref={loadingRef} className="text-center mt-4 text-gray-400">
          {loading ? (
            <Spin />
          ) : type === "article" ? (
            hasMoreArticle ? (
              "加载更多..."
            ) : (
              "没有更多文章了"
            )
          ) : hasMoreMicroPost ? (
            "加载更多..."
          ) : (
            "没有更多圈子了"
          )}
        </div>
      </Card>
    </div>
  );
}
