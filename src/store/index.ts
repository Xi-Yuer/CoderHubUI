import { Emoji, UserInfo } from "@/alova/globals";
import { TOKEN } from "@/constant";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// 定义状态类型
type AppStore = {
  token: string;
  userInfo: UserInfo;
  emotions: Emoji[];
  showLoginPanel: boolean;
  setToken: (token: string) => void;
  clearToken: () => void;
  setUserInfo: (userInfo: UserInfo) => void;
  setEmotions: (emotions: Emoji[]) => void;
  reset: () => void;
  setShowLoginPanel: (showLoginPanel: boolean) => void;
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      token: "",
      userInfo: {} as UserInfo,
      emotions: [],
      showLoginPanel: false,
      setToken: (token: string) => {
        window.localStorage.setItem(TOKEN, token);
        set(() => ({ token }));
      },
      clearToken: () =>
        set(() => {
          return { token: "", userInfo: {} as UserInfo };
        }),
      setUserInfo: (userInfo: UserInfo) => {
        set(() => ({ userInfo }));
      },
      setEmotions: (emotions: Emoji[]) => {
        set(() => ({ emotions }));
      },
      setShowLoginPanel: (showLoginPanel: boolean) => {
        set(() => ({ showLoginPanel }));
      },
      reset: () => {
        window.localStorage.clear();
        set(() => ({
          token: "",
          userInfo: {} as UserInfo,
          emotions: [],
        }));
      },
    }),
    {
      name: "storage",
      storage: createJSONStorage(() => localStorage), // 使用 localStorage
    }
  )
);
