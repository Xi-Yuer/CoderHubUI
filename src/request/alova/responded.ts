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

    return json;
  },
  onError: (error: Error, method: Method) => {
    console.log(error);
  },
  onComplete: () => {},
};
