import { Favor } from "@/alova/globals";
import { DEFAULT_AVATAR } from "@/constant";
import { ClientGetFavorFoldList } from "@/request/apis/web";
import { useAppStore } from "@/store";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Card, List, Spin } from "antd";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useStore } from "zustand";

interface FavorProps {
  id: string;
}

export default function Bank({ id }: FavorProps) {
  const { userInfo } = useStore(useAppStore, (state) => state);
  const [list, setList] = useState<Favor[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (!userInfo.id) return;
    ClientGetFavorFoldList(userInfo.id, id, "question", page, 10)
      .then((res) => {
        setList(res?.data?.list || []);
        setTotal(res?.data?.total || 0);
      })
      .finally(() => setLoading(false));
  }, [page, userInfo.id]);

  return (
    <Spin spinning={loading}>
      <List
        itemLayout="vertical"
        size="large"
        pagination={{
          current: page,
          total,
          pageSize: 10,
          onChange: (p) => setPage(p),
        }}
        dataSource={list}
        renderItem={(item) => (
          <Link
            href={`/question/${item?.entity_value?.entity_id}`}
            target="_blank"
          >
            <Card style={{ marginBottom: 16 }}>
              <Card.Meta
                avatar={
                  <Avatar
                    src={
                      item?.entity_value?.user_info?.avatar || DEFAULT_AVATAR
                    }
                    icon={<UserOutlined />}
                  />
                }
                title={item?.entity_value?.title}
                description={item?.entity_value?.content?.slice(0, 100) + "..."}
              />
            </Card>
          </Link>
        )}
      />
    </Spin>
  );
}
