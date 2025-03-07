export const images = (token: string) => ({
  uploadUrl: "/api/image/upload",
  uploadHeaders: {
    Authorization: `Bearer ${token}`,
  },
  uploader: (
    file: File,
    uploadUrl: string,
    headers: Record<string, any>,
    formName: string
  ): Promise<Record<string, any>> => {
    const formData = new FormData();
    formData.append("file", file);
    return new Promise((resolve, reject) => {
      fetch(uploadUrl, {
        method: "post",
        headers: { Accept: "application/json", ...headers },
        body: formData,
      })
        .then((resp) => resp.json())
        .then((json) => {
          resolve(json);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  uploaderEvent: {
    onSuccess: (file: File, response: any) => {
      return {
        errorCode: 0,
        data: {
          src: response?.data?.url,
          alt: "图片 alt",
        },
      };
    },
  },
});
