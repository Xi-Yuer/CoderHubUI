"use client";
import type { Tag as TagOptionType } from "@/alova/globals";
import { EditorRefCallBack } from "@/app/_components";
import { LONG_ARTICLE_TYPE } from "@/constant";
import {
  ClientCreateArticle,
  ClientUploadImage,
  ClientGetAllTags,
  ClientCreateTag,
  ClientGetSystemTags,
} from "@/request/apis/web";
import { getBase64 } from "@/utils";
import { PlusOutlined, SaveOutlined, SendOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Divider,
  Image,
  Input,
  message,
  Space,
  Upload,
  UploadProps,
  Radio,
} from "antd";
import { Select, Tag } from "antd";
import type { InputRef, SelectProps } from "antd";
import dynamic from "next/dynamic";
import React from "react";

type TagRender = SelectProps["tagRender"];

const AppAIEditor = dynamic(
  () => import("@/app/_components/AIEditor"),
  { ssr: false } // 禁用服务器端渲染
);
export default function Page() {
  const [messageApi, messageContext] = message.useMessage();
  const [name, setName] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [imageListID, setImageListID] = React.useState<string[]>([]);
  const [imageList, setImageList] = React.useState<string[]>([]);
  const [categoryOptions, setCategoryOptions] = React.useState<TagOptionType[]>(
    []
  );
  const [category, setCategory] = React.useState("");
  const [tagList, setTagList] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [tagOptions, setTagOptions] = React.useState<any[]>([]);
  const [hasMore, setHasMore] = React.useState(true);
  const inputRef = React.useRef<InputRef>(null);
  const AppEditorRef = React.useRef<EditorRefCallBack>(null);

  const loadTags = async (pageNum: number) => {
    if (!hasMore || loading) return;
    setLoading(true);
    const res = await ClientGetAllTags(LONG_ARTICLE_TYPE, pageNum, 10);
    if (res.data) {
      const newTags = res.data?.list.map((tag) => ({
        label: tag.name,
        value: tag.name,
      }));
      setTagOptions((prev) => [...prev, ...newTags]);
      setHasMore(res.data?.list.length < 10);
      setPage(pageNum + 1);
    }
    setLoading(false);
  };

  const loadCategory = () => {
    ClientGetSystemTags(LONG_ARTICLE_TYPE).then((res) => {
      setCategoryOptions(res.data?.list || []);
    });
  };

  React.useEffect(() => {
    loadTags(1);
    loadCategory();
  }, []);

  const onPublish = (status: "published" | "draft") => {
    const content = AppEditorRef.current?.getText();
    if (!title) {
      messageApi.error("标题不能为空");
      return;
    }
    if (!content) {
      messageApi.error("内容不能为空");
      return;
    }
    if (!category) {
      messageApi.error("请选择分类");
      return;
    }
    if (!tagList.length) {
      messageApi.error("请选择标签");
      return;
    }
    ClientCreateArticle({
      type: "article",
      title: title,
      coverImageID: imageListID[0],
      content: content,
      summary: description,
      tags: tagList,
      status: status,
      categoryId: category,
    }).then((res) => {
      messageApi.info(res.message);
      setTitle("");
      setDescription("");
      setTagList([]);
      setImageList([]);
      setImageListID([]);
      AppEditorRef.current?.restText();
    });
  };

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const props: UploadProps = {
    name: "file",
    accept: "image/*",
    showUploadList: false,
    maxCount: 1,
    beforeUpload(file) {
      return false;
    },
    async onChange(info) {
      // 预览列表
      const fileBase64 = await getBase64(info.file as unknown as File);
      setImageList((prev) => [...prev, fileBase64]);
      // 上传图片
      ClientUploadImage(info.file as unknown as File).then((res) => {
        setImageListID((prev) => [...prev, res.data.image_id]);
      });
    },
  };

  const tagRender: TagRender = (props) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <Tag
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ marginInlineEnd: 4 }}
      >
        {label}
      </Tag>
    );
  };
  const addItem = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    e.preventDefault();
    if (!name || tagOptions.includes(name)) return;
    ClientCreateTag({
      type: LONG_ARTICLE_TYPE,
      name,
      description,
      is_system_provider: false,
      icon: "",
    }).then((res) => {
      if (res.data) {
        setTagOptions([
          ...tagOptions,
          {
            label: name,
            value: name,
          },
        ]);
        setName("");
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      } else {
        messageApi.error(res.message);
      }
    });
  };

  return (
    <Card>
      {messageContext}
      <div className="flex-1 flex flex-col gap-4">
        <Input.TextArea
          placeholder="请输入标题"
          autoSize
          className="placeholder:text-lg placeholder:text-gray-800 placeholder:font-bold font-bold"
          style={{ fontSize: "1.5rem" }}
          value={title}
          onChange={(e) =>
            setTitle(e.target.value.replaceAll(/^\s+|\s+$/g, ""))
          }
        />
        <Input.TextArea
          placeholder="请输入文章摘要（限100字，选填）"
          maxLength={100}
          autoSize={{ minRows: 3 }}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="border border-b-0">
          <AppAIEditor ref={AppEditorRef} />
        </div>
        <Divider />
        <div className="flex flex-col gap-8">
          <span className="text-lg font-bold">发布设置</span>
          <div className="flex gap-6 items-center text-md">
            <span className="w-20">
              <span className="text-red-500 mr-2">*</span>
              选择分类
            </span>
            <Radio.Group defaultValue="a" buttonStyle="solid">
              {categoryOptions.map((item) => {
                return (
                  <Radio.Button
                    key={item.id}
                    value={item.id}
                    onClick={() => setCategory(item.id)}
                  >
                    {item.name}
                  </Radio.Button>
                );
              })}
            </Radio.Group>
          </div>
          <div className="flex items-center">
            <div className="flex items-center w-28">
              <span className="text-red-500 mr-2">*</span>
              <span>标签</span>
            </div>
            <Select
              mode="multiple"
              tagRender={tagRender}
              value={tagList}
              onChange={(value) => setTagList(value)}
              style={{ width: "100%" }}
              options={tagOptions}
              loading={loading}
              onPopupScroll={(e) => {
                const target = e.target as HTMLDivElement;
                if (
                  target.scrollTop + target.clientHeight >=
                  target.scrollHeight - 10
                ) {
                  loadTags(page);
                }
              }}
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <Divider style={{ margin: "8px 0" }} />
                  <Space style={{ padding: "0 8px 4px" }}>
                    <Input
                      placeholder="点击添加标签"
                      ref={inputRef}
                      value={name}
                      onChange={onNameChange}
                      onKeyDown={(e) => e.stopPropagation()}
                    />
                    <Button
                      type="text"
                      icon={<PlusOutlined />}
                      onClick={addItem}
                    >
                      添加标签
                    </Button>
                  </Space>
                </>
              )}
            />
          </div>
          <div className="flex gap-6 items-center text-md">
            <span className="w-20 ml-2">文章封面</span>
            {imageListID.length ? (
              <>
                <div className="flex flex-col gap-2">
                  {imageList.map((item) => {
                    return (
                      <Image src={item} alt="" key={item} height={150}></Image>
                    );
                  })}
                </div>
              </>
            ) : (
              <>
                <Upload
                  {...props}
                  className="flex cursor-pointer !text-gray-500 hover:!text-gray-950"
                >
                  <div className="flex flex-col items-center justify-center border w-40 h-40 border-dashed">
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>上传</div>
                  </div>
                </Upload>
              </>
            )}
          </div>
        </div>
        <Divider />
        <div className="flex justify-end">
          <div className="flex gap-2">
            <Button onClick={() => onPublish("draft")} icon={<SaveOutlined />}>
              私密暂存
            </Button>
            <Button
              type="primary"
              onClick={() => onPublish("published")}
              icon={<SendOutlined />}
            >
              发布
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
