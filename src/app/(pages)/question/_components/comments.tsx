"use client";
import { Question } from "@/alova/globals";
import { AppCommentEditor } from "@/app/_components/appCommentEditor";
import AppCommentList, {
  appendCommentRefCallBack,
} from "@/app/_components/appCommentList";
import { ClientSendComment } from "@/request/apis/web";
import React from "react";

export default function QuestionComments({ item }: { item: Question }) {
  const appCommentListRef = React.useRef<appendCommentRefCallBack>(null);
  const [questionFromProps, setQuestionFromProps] = React.useState(item);
  return (
    <div>
      <AppCommentEditor
        publicSuccess={async (params) => {
          await ClientSendComment({
            entity_author_id: questionFromProps?.id,
            entity_id: questionFromProps?.id,
            content: params.content,
            image_ids: params.imageIds,
            root_id: "",
            parent_id: "",
            reply_to_uid: "",
          })
            .send()
            .then((res) => {
              appCommentListRef.current?.appendComment(res.data);
            });
        }}
        cancel={() => {}}
        entityID={questionFromProps?.id}
      />
      <AppCommentList entityID={questionFromProps.id} ref={appCommentListRef} />
    </div>
  );
}
