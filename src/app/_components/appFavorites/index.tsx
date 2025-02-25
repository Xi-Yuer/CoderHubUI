"use client";
import { FavorFoldList } from "@/alova/globals";
import { ClientGetUserFavorFold } from "@/request/apis";
import { useAppStore } from "@/store";
import React, { useEffect, useState } from "react";

export default function AppFavorite() {
  const { userInfo } = useAppStore();
  const [favorList, setFavorList] = useState<FavorFoldList>();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    ClientGetUserFavorFold(userInfo.id, 1, 10).then((res) => {
      setFavorList(res.data);
    });
  }, [userInfo.id]);
  return <div>11</div>;
}
