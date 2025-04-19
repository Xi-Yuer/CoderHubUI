import { useAppStore } from "@/store";
import event from "@/utils/event";
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
        event.emit("BAD_REQUEST", json.message);
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
