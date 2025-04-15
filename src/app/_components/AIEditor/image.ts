export const images = (token: string, allowUploadImage = true) => ({
  uploadUrl: `${process.env.NEXT_PUBLIC_SERVER_API_BASE_URL}/api/image/upload`,
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
    onUploadBefore: () => {
      //监听图片上传之前，此方法可以不用回任何内容，但若返回 false，则终止上传
      if (!allowUploadImage) return false;
    },
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
