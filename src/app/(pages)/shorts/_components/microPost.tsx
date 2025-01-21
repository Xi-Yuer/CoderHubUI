"use client";
import { GetArticle } from "@/alova/globals";
import { ClientGetArticleList } from "@/request/apis";
import {
  CommentOutlined,
  LikeOutlined,
  PlusOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { Button, Card, Image } from "antd";
import { MdPreview } from "md-editor-rt";
import React, { Ref, useEffect, useImperativeHandle, useRef, useState } from "react";

export type RefCallBack = {
  refreshList: () => void;
};

type Props = {
  ref: Ref<RefCallBack>;
};
export default function MicroPost({ ref }: Props) {
  const [page, setPage] = useState(1);
  const [list, setList] = useState<GetArticle[]>([]);
  const loadingRef = useRef(null); // 目标 DOM 元素

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setPage((prev) => prev + 1)
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
    ClientGetArticleList("micro_post", page, 10).send(refreshed).then((res) => {
      setList([...list, ...res.data || []]);
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
            <Card>
              {/* Header */}
              <div className="flex items-center justify-between space-x-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-pink-300 flex items-center justify-center text-white text-lg">
                    <Image
                      src={item.author.avatar}
                      alt="Avatar"
                      preview={false}
                      className="rounded-full"
                    ></Image>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">
                      {item.author.nickname || item.author.username}
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.article.updatedAt}
                    </p>
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-1">
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      iconPosition="end"
                    >
                      关注
                    </Button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="mt-4">
                <MdPreview value={item.article.content} />
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {/* Image Cards */}
                  {item.article.imageUrls.map((url, index) => (
                    <div className="flex flex-wrap" key={index}>
                      <Image src={url} alt="" className="w-20" width={120} />
                    </div>
                  ))}
                </div>
              </div>
              {/* Footer */}
              <div className="flex items-center justify-between text-gray-500 text-sm border-t border-gray-100 mt-4 pt-4 px-10 ">
                <button className="flex items-center space-x-1 hover:text-gray-950">
                  <LikeOutlined className="text-sm" />
                  <span>{item.article.likeCount || 0}</span>
                </button>
                <button className="flex items-center space-x-1 hover:text-gray-950">
                  <CommentOutlined className="text-sm" />
                  <span>{item.article.commentCount || 0}</span>
                </button>
                <button className="flex items-center space-x-1 hover:text-gray-950">
                  <ShareAltOutlined className="text-sm" />
                  <span className="text-[13px]">分享</span>
                </button>
              </div>
            </Card>
          </div>
        );
      })}
      <div ref={loadingRef}>Loaing</div>
    </div>
  );
}
