import { useAppStore } from "@/store";
import { Method } from "alova";
const { reset, setShowLoginPanel } = useAppStore.getState();

export const responded = {
  onSuccess: async (response: Response, method: Method) => {
    if (response.status === 401) {
      reset();
      setShowLoginPanel(true);
      return Promise.reject(response);
    }
    try {
      const json = await response.json();
      if (json.code !== 200) {
        return Promise.reject(json.message);
      }
      return json;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  onError: (error: Error, method: Method) => {
    return Promise.reject(error);
  },
  onComplete: () => {},
};
