import { messageParse } from "./messageParse";
export const models = (token: string) => ({
  custom: {
    url: "/api/ai/chat",
    headers: () => {
      return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
    },
    wrapPayload: (message: string) => ({
      content: message,
    }),
    parseMessage: (message: string) => messageParse(message),
    // protocol: "sse" | "websocket" | "http"
    protocol: "http",
  } as any,
});
