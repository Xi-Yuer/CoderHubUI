import React from "react";
import {
  ClientCreateFavorFold,
  ClientAddContentToFavor,
  ClientRemoveContentFromFavor,
} from "@/request/apis/web";
import { PlusOutlined } from "@ant-design/icons";
import {
  Form,
  message,
  ModalFuncProps,
  Modal,
  Radio,
  Button,
  Input,
} from "antd";
import AppFavorite, {
  AppFavoriteRefCallBack,
} from "../_components/appFavorites";
import { useAppStore } from "@/store";
import { useStore } from "zustand";

export const useFavorFlod = (
  id: string,
  entity_type: "article" | "question",
  FavorCallBack: () => void
) => {
  const [form] = Form.useForm();
  const [modal, contextHolder] = Modal.useModal();
  const [messageApi, messageContext] = message.useMessage();
  const AppFavoriteRef = React.useRef<AppFavoriteRefCallBack>(null);
  const { reset, token, setShowLoginPanel } = useStore(
    useAppStore,
    (state) => state
  );

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
            ).then(() => {
              Modal.destroyAll(); // 表单提交后关闭弹窗
            });
          }}
          initialValues={{ isPublic: true }}
        >
          <Form.Item
            label="名称"
            name="name"
            rules={[{ required: true, message: "请输入收藏集名称" }]}
          >
            <Input
              placeholder="请输入收藏集名称"
              maxLength={20}
              autoComplete="off"
            />
          </Form.Item>
          <Form.Item label="描述" name="description">
            <Input.TextArea
              placeholder="请输入收藏描述（限100字，选填）"
              maxLength={100}
              autoSize={{ minRows: 3 }}
              autoComplete="off"
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
                  entity_type: entity_type,
                }).then((res) => {
                  if (res.data) {
                    FavorCallBack();
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

  const cancelFavor = () => {
    ClientRemoveContentFromFavor({
      entity_type,
      entity_id: id,
    }).then((res) => {
      if (res.data) {
        FavorCallBack();
      }
    });
  };

  const favorEntity = (is_favorited: boolean | undefined) => {
    if (is_favorited) {
      cancelFavor();
      return;
    }
    if (!token) {
      reset();
      setShowLoginPanel(true);
      return;
    }
    modal.confirm(config);
  };
  return {
    config,
    messageApi,
    messageContext,
    AppFavoriteRef,
    form,
    createFavorFoldConfig,
    modal,
    contextHolder,
    cancelFavor,
    favorEntity,
  };
};
