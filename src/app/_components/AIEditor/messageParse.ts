export const messageParse = (message: string) => {
  try {
    const jsonString = message.replace(/^data:\s*/, ""); // 去掉 `data: ` 前缀
    const data = JSON.parse(jsonString); // 解析 JSON
    return {
      role: "assistant",
      content: data.data.content,
      status: Number(data.data.status),
    };
  } catch (error) {
    console.error("JSON 解析失败:", message, error);
    return null;
  }
};
