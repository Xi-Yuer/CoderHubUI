"use client";
import { Emoji } from "@/alova/globals";
import { ClientGetEmojiList } from "@/request/apis/web";
import { useAppStore } from "@/store";
import Image from "next/image";
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
    <div className="flex flex-wrap w-56 gap-2">
      {appStore.emotions?.map((item) => (
        <div
          key={item.id}
          className="flex flex-col items-center justify-center cursor-pointer"
        >
          <Image
            onClick={() => handleClick(item)}
            src={item.url}
            alt={item.description}
            width={30}
            height={30}
            className="m-1"
          />
          <p className="text-xs text-gray-500">{item.description}</p>
        </div>
      ))}
    </div>
  );
}
