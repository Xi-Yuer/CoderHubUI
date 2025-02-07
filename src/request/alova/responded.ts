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
    const json = await response.json();
    return json;
  },
  onError: (error: Error, method: Method) => {
    console.log(error);
  },
  onComplete: () => {},
};
