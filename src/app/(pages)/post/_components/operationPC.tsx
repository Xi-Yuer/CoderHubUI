"use client";
import { ArticleExtra } from "@/alova/globals";
import AppSharedPopUp from "@/app/_components/appSharedPopup";
import { useFavorFlod } from "@/app/_hooks/useFavorFlod";
import { FAVORITE_ARTICLE } from "@/constant";
import {
  ClientGetArticleExtraInfo,
  ClientLikeEntity,
} from "@/request/apis/web";
import {
  LikeFilled,
  LikeOutlined,
  ShareAltOutlined,
  StarFilled,
  StarOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Badge, Popover } from "antd";
import { Button } from "antd";
import React, { useEffect } from "react";

interface Props {
  id: string;
}

export default function OperationPC({ id }: Props) {
  const [extraInfo, setExtraInfo] = React.useState<ArticleExtra>({
    id: "",
  } as ArticleExtra);
  const { contextHolder, favorEntity } = useFavorFlod(
    id,
    FAVORITE_ARTICLE,
    () => {
      setExtraInfo((prev: any) => ({
        ...prev,
        is_favorited: !prev.is_favorited,
        favor_count: prev.is_favorited
          ? prev.favor_count - 1
          : prev.favor_count + 1,
      }));
    }
  );

  useEffect(() => {
    ClientGetArticleExtraInfo(id).then((res) => {
      setExtraInfo(res.data);
    });
  }, [id]);
  return (
    <div>
      {/* 桌面端操作按钮（固定在右侧） */}
      <div className="hidden lg:flex w-[200px] h-full gap-8 flex-col items-end py-10 pr-8">
        {contextHolder}
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
                setExtraInfo((prev: any) => ({
                  ...prev,
                  like_count: prev?.is_liked
                    ? prev.like_count - 1
                    : prev.like_count + 1,
                  is_liked: !prev.is_liked,
                }));
              });
            }}
          />
        </Badge>
        <Button
          type="primary"
          size="large"
          icon={extraInfo.is_favorited ? <StarFilled /> : <StarOutlined />}
          shape="circle"
          onClick={async () => favorEntity(extraInfo.is_favorited)}
        />
        <Popover
          content={<AppSharedPopUp id={extraInfo!.id} />}
          placement="bottomRight"
        >
          <Button
            type="primary"
            size="large"
            icon={<ShareAltOutlined />}
            shape="circle"
          />
        </Popover>
        <Button
          type="primary"
          size="large"
          icon={<WarningOutlined />}
          shape="circle"
        />
      </div>
    </div>
  );
}
