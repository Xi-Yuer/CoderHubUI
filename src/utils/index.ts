import { Emoji } from "@/alova/globals";
import { Md5 } from "ts-md5";
import { formatDistance } from "date-fns";
import { zhCN } from "date-fns/locale";

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

export const formatTime = (time: number | string) => {
  try {
    if (!time) {
      return "Invalid time";
    }
    let date: Date;
    if (typeof time === "number") {
      // 假设 time 是秒级时间戳，转换为毫秒级
      date = new Date(time * 1000);
    } else if (typeof time === "string") {
      date = new Date(time);
    } else {
      throw new Error("Invalid time format");
    }

    if (isNaN(date.getTime())) {
      throw new Error("Invalid date");
    }

    return formatDistance(date, new Date(), {
      addSuffix: true,
      locale: zhCN,
    });
  } catch (error) {
    console.error("Error formatting time:", error);
    return "Invalid time";
  }
};

export function matchPath(actualPath: string, patternPath: string) {
  const actualPathParts = actualPath.split("/");
  const patternPathParts = patternPath.split("/");
  if (actualPathParts[1] !== patternPathParts[1]) return false;
  return true;
}
