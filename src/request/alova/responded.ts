import { useAppStore } from "@/store";
import { Method } from "alova";

export const responded = {
  onSuccess: async (response: Response, method: Method) => {
    if (response.status >= 400) {
      throw new Error(response.statusText);
    }
    const json = await response.json();
    if (json.code !== 200) {
      throw new Error(json.message);
    }
    if (response.status === 401) {
      const { reset } = useAppStore.getState();
      reset();
    }
    return json;
  },
  onError: (error: Error, method: Method) => {
    console.log(error);
  },
  onComplete: () => {},
};
