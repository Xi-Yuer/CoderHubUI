"use client";
import { Image } from "antd";
import { MdPreview } from "md-editor-rt";
import React from "react";
import { GetArticle } from "@/alova/globals";
import { ClientSendComment } from "@/request/apis";
import AppCommentList, { appendCommentRefCallBack } from "../appCommentList";
import { AppCommentEditor } from "../appCommentEditor";

export default function AppArticlePreviewDetail({
  item,
}: {
  item: GetArticle;
}) {
  const appCommentListRef = React.useRef<appendCommentRefCallBack>(null);
  const [articleFromProps, setArticleFromProps] = React.useState(item);
  return (
    <div>
      <MdPreview value={item.article.content} />
      <div className="grid grid-cols-2 gap-2 mt-2 px-6">
        {item.article.imageUrls.map((url, index) => (
          <div className="flex flex-wrap" key={index}>
            <Image src={url} alt="" className="w-20" width={120} />
          </div>
        ))}
      </div>
      <div className="px-6 mt-10">
        <AppCommentEditor
          publicSuccess={async (params) => {
            await ClientSendComment({
              entity_id: articleFromProps.article.id,
              content: params.content,
              image_ids: params.imageIds,
              root_id: "",
              parent_id: "",
              reply_to_uid: "",
            })
              .send()
              .then((res) => {
                appCommentListRef.current?.appendComment(res.data);
                setArticleFromProps((prev) => ({
                  ...prev,
                  article: {
                    ...prev.article,
                    commentCount: prev.article.commentCount
                      ? prev.article.commentCount + 1
                      : 1,
                  },
                }));
              });
          }}
          cancel={() => {}}
          entityID={articleFromProps.article.id}
        />
        <AppCommentList
          entityID={articleFromProps.article.id}
          ref={appCommentListRef}
        />
      </div>
    </div>
  );
}
