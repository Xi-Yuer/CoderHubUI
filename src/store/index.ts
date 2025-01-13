import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// 定义状态类型
type AppStore = {
  token: string;
  setToken: (token: string) => void;
  clearToken: () => void;
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      token: "",
      setToken: (token: string) => {
        window.localStorage.setItem("token", token);
        set(() => ({ token }));
      },
      clearToken: () => set(() => ({ token: "" })),
    }),
    {
      name: "storage",
      storage: createJSONStorage(() => localStorage), // 使用 localStorage
    }
  )
);
