"use client";
import { GetQuestionBankResqonse } from "@/alova/globals";
import { ClientGetQuestionBankDetail } from "@/request/apis/web";
import React, { useEffect, useState } from "react";
import { Button, Card, Image, Tag } from "antd";
import { StarFilled, StarOutlined } from "@ant-design/icons";
import { formatTime } from "@/utils";
import { useFavorFlod } from "@/app/_hooks/useFavorFlod";
import { difficultyMap, FAVORITE_QUESTION } from "@/constant";

interface QuestionBankDetailProps {
  id: string;
}

export default function QuestionBankDetail({ id }: QuestionBankDetailProps) {
  const [questionBankDetail, setQuestionBankDetail] =
    useState<GetQuestionBankResqonse>();
  const { contextHolder, favorEntity } = useFavorFlod(
    id,
    FAVORITE_QUESTION,
    () => {
      setQuestionBankDetail((prev) => ({
        ...prev,
        isFavorited: !prev?.isFavorited,
      }));
    }
  );
  useEffect(() => {
    ClientGetQuestionBankDetail(id).then((res) => {
      setQuestionBankDetail(res.data);
      console.log(res.data?.difficulty);
    });
  }, [id]);
  return (
    <Card
      title="题库详情"
      extra={
        <Button
          onClick={async () => favorEntity(questionBankDetail?.isFavorited)}
        >
          {questionBankDetail?.isFavorited ? "取消收藏" : "收藏"}
          {questionBankDetail?.isFavorited ? <StarFilled /> : <StarOutlined />}
        </Button>
      }
    >
      {contextHolder}
      {/* 封面 */}
      <div className="flex gap-2 justify-between">
        <Image
          src={questionBankDetail?.coverImage?.url || undefined}
          alt={questionBankDetail?.coverImage?.url || undefined}
          width={40}
          height={40}
          className="w-1/5 object-cover"
          preview={false}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-slate-800 truncate">
              {questionBankDetail?.name}
            </span>
            <Tag
              color={
                difficultyMap[
                  questionBankDetail?.difficulty as keyof typeof difficultyMap
                ]?.color
              }
            >
              {
                difficultyMap[
                  questionBankDetail?.difficulty as keyof typeof difficultyMap
                ]?.label
              }
            </Tag>
          </div>
          <span className="text-slate-400">
            {questionBankDetail?.description}
          </span>
          <div className="flex gap-2 text-slate-400">
            <span>{formatTime(questionBankDetail?.createdAt || "")}</span>
            <span>
              {questionBankDetail?.createUser?.nickname ||
                questionBankDetail?.createUser?.username}
            </span>
            <span>创建</span>
          </div>
        </div>
      </div>
      {/* 标签 */}
      <div className="flex flex-wrap gap-2 mt-2">
        {questionBankDetail?.tags?.map((tag) => (
          <Tag color="black" key={tag}>
            {tag}
          </Tag>
        ))}
      </div>
    </Card>
  );
}
