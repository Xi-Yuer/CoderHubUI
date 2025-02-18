"use client";
import { ArticleExtra } from "@/alova/globals";
import { ClientGetArticleExtraInfo, ClientLikeEntity } from "@/request/apis";
import {
  LikeFilled,
  LikeOutlined,
  ShareAltOutlined,
  StarOutlined,
  StarFilled,
} from "@ant-design/icons";
import { Badge, Button } from "antd";
import React, { useEffect } from "react";

interface Props {
  id: string;
}
export default function Operation({ id }: Props) {
  const [extraInfo, setExtraInfo] = React.useState<ArticleExtra>();
  useEffect(() => {
    ClientGetArticleExtraInfo(id).then((res) => {
      setExtraInfo(res.data);
    });
  }, [id]);
  return (
    <div className="hidden lg:flex w-[200px] h-full gap-8 flex-col justify-center items-center py-10">
      <Badge count={extraInfo?.like_count}>
        <Button
          type="primary"
          size="large"
          icon={extraInfo?.is_liked ? <LikeFilled /> : <LikeOutlined />}
          shape="circle"
          onClick={() => {
            if (!extraInfo) return;
            ClientLikeEntity(extraInfo.id).then((res) => {
              if (!res) return;
              setExtraInfo((prev: any) => {
                return {
                  ...prev,
                  like_count: prev?.is_liked
                    ? prev.like_count - 1
                    : prev.like_count + 1,
                  is_liked: !prev.is_liked,
                } as ArticleExtra;
              });
            });
          }}
        ></Button>
      </Badge>

      <Button
        type="primary"
        size="large"
        icon={<StarOutlined />}
        shape="circle"
      ></Button>
      <Button
        type="primary"
        size="large"
        icon={<ShareAltOutlined />}
        shape="circle"
      ></Button>
    </div>
  );
}
