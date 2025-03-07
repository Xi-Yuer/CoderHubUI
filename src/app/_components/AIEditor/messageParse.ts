export const messageParse = (message: string) => {
  const data = JSON.parse(message);
  return {
    role: "assistant",
    content: data.data,
  };
};
