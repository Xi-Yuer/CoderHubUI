"use client";
import { ArticleExtra } from "@/alova/globals";
import AppFavorite, {
  AppFavoriteRefCallBack,
} from "@/app/_components/appFavorites";
import AppSharedPopUp from "@/app/_components/appSharedPopup";
import {
  ClientAddContentToFavor,
  ClientCreateFavorFold,
  ClientGetArticleExtraInfo,
  ClientLikeEntity,
} from "@/request/apis";
import {
  LikeFilled,
  LikeOutlined,
  PlusOutlined,
  ShareAltOutlined,
  StarFilled,
  StarOutlined,
  StarTwoTone,
  WarningOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Form,
  Input,
  message,
  ModalFuncProps,
  Popover,
  Radio,
} from "antd";
import { Button, Modal } from "antd";
import React, { useEffect } from "react";

interface Props {
  id: string;
}

export default function OperationPC({ id }: Props) {
  const [extraInfo, setExtraInfo] = React.useState<ArticleExtra>({
    id: "",
  } as ArticleExtra);

  const [modal, contextHolder] = Modal.useModal();
  const [form] = Form.useForm();
  const [messageApi, messageContext] = message.useMessage();
  const AppFavoriteRef = React.useRef<AppFavoriteRefCallBack>(null);

  const createFavorFoldConfig: ModalFuncProps = {
    title: "创建收藏夹",
    icon: null,
    width: 500,
    forceRender: true,
    footer: null,
    closable: true,
    content: (
      <>
        <Form
          layout="vertical"
          form={form}
          name="createFavorFold"
          onFinish={(values) => {
            ClientCreateFavorFold(
              values.isPublic,
              values.name,
              values.description
            ).then(
              () => Modal.destroyAll() // 表单提交后关闭弹窗
            );
          }}
          initialValues={{ isPublic: true }}
        >
          <Form.Item
            label="名称"
            name="name"
            rules={[{ required: true, message: "请输入收藏集名称" }]}
          >
            <Input placeholder="请输入收藏集名称" maxLength={20} />
          </Form.Item>
          <Form.Item label="描述" name="description">
            <Input.TextArea
              placeholder="请输入收藏描述（限100字，选填）"
              maxLength={100}
              autoSize={{ minRows: 3 }}
            />
          </Form.Item>

          <Form.Item
            name="isPublic"
            rules={[{ required: true, message: "请选择可见性" }]}
          >
            <Radio.Group>
              <Radio value={true}>
                公开{" "}
                <span className="text-gray-400">
                  {" "}
                  当其他人关注此收藏集后不可再更改为隐私
                </span>
              </Radio>
              <Radio value={false}>
                隐私 <span className="text-gray-400">仅自己可见此收藏集</span>
              </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label={null}>
            <div className="flex justify-end gap-4">
              <Button type="primary" htmlType="submit">
                确认
              </Button>
            </div>
          </Form.Item>
        </Form>
      </>
    ),
  };

  const config: ModalFuncProps = {
    title: "选择收藏夹",
    icon: null,
    forceRender: true,
    closable: true,
    content: (
      <>
        <AppFavorite ref={AppFavoriteRef} />
      </>
    ),
    footer: (
      <>
        {messageContext}
        <div className="flex justify-between items-center mx-[-10px] pt-4">
          <Button
            type="text"
            onClick={async () => {
              modal.confirm(createFavorFoldConfig);
            }}
          >
            <PlusOutlined />
            创建收藏夹
          </Button>
          <Button
            type="primary"
            onClick={() => {
              const folderID = AppFavoriteRef.current?.getSelectedFolder();
              if (folderID) {
                ClientAddContentToFavor({
                  foldId: folderID,
                  entityId: id,
                  entity_type: "article",
                }).then((res) => {
                  if (res.data) {
                    messageApi.success(res.message);
                  } else {
                    messageApi.success(res.message);
                  }
                  Modal.destroyAll();
                });
              } else {
                Modal.destroyAll();
              }
            }}
          >
            确定
          </Button>
        </div>
      </>
    ),
    okText: "确定",
  };

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
          onClick={async () => {
            modal.info(config);
          }}
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
