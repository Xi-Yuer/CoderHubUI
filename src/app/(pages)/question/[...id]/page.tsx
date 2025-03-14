import {
  ClientGetQuestionDetail,
  ClientGetQuestionDetailList,
} from "@/request/apis/server";
import { ShareAltOutlined, StarFilled, StarOutlined } from "@ant-design/icons";
import { Card, Tag } from "antd";
import Link from "next/link";
import React from "react";
import QuestionPreview from "../_components/questionPreview";
import QuestionComments from "../_components/comments";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

const difficultyMap = {
  easy: {
    color: "green",
    label: "简单",
  },
  medium: {
    color: "orange",
    label: "中等",
  },
  hard: {
    color: "red",
    label: "困难",
  },
};
export default async function Page({ params }: Props) {
  try {
    const [bankID] = (await params).id;
    let [, questionID] = (await params).id;
    const resultResponse = await ClientGetQuestionDetailList(bankID);
    const questionList = resultResponse?.data?.list;
    questionID = questionID || questionList[0].id;
    const questionDetailResponse = await ClientGetQuestionDetail(questionID);
    return (
      <div className="container flex gap-4">
        <div className="left w-80 flex flex-col gap-4">
          <Card>
            {questionList?.map((item) => {
              return (
                <Link
                  key={item.id}
                  href={`/question/${bankID}/${item.id}`}
                  className={`p-2 block ${item.id === questionID ? "bg-gray-100 font-bold" : ""} text-${difficultyMap[item.difficult as keyof typeof difficultyMap].color}-500`}
                >
                  {item.title}
                </Link>
              );
            })}
          </Card>
        </div>
        <div className="center flex-1 flex flex-col gap-4">
          <Card>
            <div className="flex gap-4 items-center">
              <h2 className="text-xl font-semibold">
                {questionDetailResponse.data.id}：
                {questionDetailResponse?.data?.title}
              </h2>
              <Tag
                color={
                  difficultyMap[
                    questionDetailResponse?.data
                      ?.difficult as keyof typeof difficultyMap
                  ].color
                }
              >
                {
                  difficultyMap[
                    questionDetailResponse.data
                      .difficult as keyof typeof difficultyMap
                  ].label
                }
              </Tag>
            </div>
            {/* 分享、收藏、点赞 */}
            <div className="flex gap-8 mt-4 text-gray-400">
              <div className="flex items-center gap-1">
                <ShareAltOutlined />
                分享
              </div>
              <div className="flex items-center gap-1">
                <StarOutlined />
                收藏
              </div>
            </div>
          </Card>
          <Card title="推荐答案">
            <QuestionPreview content={questionDetailResponse.data.content} />
          </Card>
          <Card title="相关回答">
            <QuestionComments item={questionDetailResponse.data} />
          </Card>
        </div>
        <div className="right w-80">
          <Card></Card>
        </div>
      </div>
    );
  } catch (error) {
    return <div>{JSON.stringify(error)}</div>;
  }
}
