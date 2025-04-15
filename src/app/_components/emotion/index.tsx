"use client";
import { Emoji } from "@/alova/globals";
import { Image } from "antd";
import { ClientGetEmojiList } from "@/request/apis/web";
import { useAppStore } from "@/store";
import React, { useEffect } from "react";
import { useStore } from "zustand";

type Props = {
  onClick: (emoji: Emoji) => void;
};
export default function Emotion({ onClick }: Props) {
  const appStore = useStore(useAppStore, (state) => state);

  useEffect(() => {
    ClientGetEmojiList().then((res) => {
      appStore.setEmotions(res?.data?.list || []);
    });
  }, []);

  const handleClick = (emoji: Emoji) => {
    onClick(emoji);
  };
  return (
    <div className="grid grid-cols-6 justify-center items-center w-56 gap-2">
      {appStore?.emotions?.map((item) => (
        <div key={item.id} className="mx-1 cursor-pointer">
          <Image
            onClick={() => handleClick(item)}
            src={item.url}
            alt={item.description}
            width={30}
            height={30}
            preview={false}
          />
          <span className="text-xs text-center text-gray-500 text-nowrap">
            {item.description}
          </span>
        </div>
      ))}
    </div>
  );
}
