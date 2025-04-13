"use client";
import { FavorFoldList } from "@/alova/globals";
import { ClientGetUserFavorFold } from "@/request/apis/web";
import { useAppStore } from "@/store";
import { LockOutlined, UnlockOutlined } from "@ant-design/icons";
import { Pagination } from "antd";
import React, { useEffect, useImperativeHandle, useState } from "react";
import { useStore } from "zustand";

export type AppFavoriteRefCallBack = {
  getSelectedFolder: () => string | null;
};
export default function AppFavorite({ ref }: any) {
  const { userInfo } = useStore(useAppStore, (state) => state);
  const [favorList, setFavorList] = useState<FavorFoldList>();
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  useEffect(() => {
    ClientGetUserFavorFold(userInfo.id, currentPage, 10).then((res) => {
      setFavorList(res.data);
      setTotal(res.data.total);
    });
  }, [userInfo.id, currentPage]);

  useImperativeHandle(ref, () => ({
    getSelectedFolder: () => {
      return selectedFolder;
    },
  }));

  return (
    <div>
      <div className="space-y-4">
        {favorList?.list?.map((item, index) => (
          <div
            key={item.id}
            onClick={() => {
              if (selectedFolder !== item.id) {
                setSelectedFolder(item.id);
              } else {
                setSelectedFolder("");
              }
            }}
            className={`py-2 px-4 rounded-lg border cursor-pointer mb-2 transition-all duration-200 
              ${selectedFolder === item.id ? "border-blue-500 bg-blue-100 shadow-md" : "hover:shadow-md bg-white"}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-lg font-semibold text-gray-800 pr-10 truncate">
                {item.name}
              </div>
              <div className="text-sm text-gray-500 text-nowrap">
                {item.is_public ? (
                  <span className="text-green-500">
                    公开
                    <UnlockOutlined className="ml-1" />
                  </span>
                ) : (
                  <span className="text-gray-500">
                    私密
                    <LockOutlined className="ml-1" />
                  </span>
                )}
              </div>
            </div>
            <div className="text-gray-600 text-sm mb-2 truncate">
              {item.description}
            </div>
          </div>
        ))}
        {total > 10 && (
          <div className="flex justify-end">
            <Pagination
              current={currentPage}
              total={total}
              pageSize={10}
              onChange={(page) => {
                setCurrentPage(page);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
