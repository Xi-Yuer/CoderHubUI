import { Emoji } from "@/alova/globals";
import { Md5 } from "ts-md5";

export const md5 = (str: string) => {
  return Md5.hashStr(str);
};

export const getBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export const RenderEmotion = (emotions: Emoji[], text: string) => {
  const emotionsMap = new Map(emotions.map((item) => [item.code, item]));
  const emojiRegex = /:\w+:/g;
  return text.replace(emojiRegex, (match) => {
    const emoji = emotionsMap.get(match);
    return emoji
      ? `<img src="${emoji.url}" alt="${emoji.description}" style="display: inline-block; width: 80px; height: 80px; border:none;margin: 0px 4px;" />`
      : match;
  });
};
