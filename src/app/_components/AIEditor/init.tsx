"use client";
import { useAppStore } from "@/store";
import { AiEditor, AiEditorOptions } from "aieditor";
import "aieditor/dist/style.css";

import { HTMLAttributes, forwardRef, useEffect, useRef } from "react";

type AIEditorProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange"> & {
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (val: string) => void;
  options?: Omit<AiEditorOptions, "element">;
};

export default forwardRef<HTMLDivElement, AIEditorProps>(function AIEditor(
  {
    placeholder,
    defaultValue,
    value,
    onChange,
    options,
    ...props
  }: AIEditorProps,
  ref
) {
  const divRef = useRef<HTMLDivElement>(null);
  const aiEditorRef = useRef<AiEditor | null>(null);
  const { token } = useAppStore();

  useEffect(() => {
    if (!divRef.current) return;

    if (!aiEditorRef.current) {
      const aiEditor = new AiEditor({
        element: divRef.current,
        placeholder: placeholder,
        content: defaultValue,
        toolbarKeys: [
          "undo",
          "redo",
          "brush",
          "eraser",
          "|",
          "heading",
          "font-family",
          "font-size",
          "|",
          "bold",
          "italic",
          "underline",
          "strike",
          "link",
          "code",
          "subscript",
          "superscript",
          "hr",
          "todo",
          "emoji",
          "|",
          "highlight",
          "font-color",
          "|",
          "align",
          "line-height",
          "|",
          "bullet-list",
          "ordered-list",
          "indent-decrease",
          "indent-increase",
          "break",
          "|",
          "image",
          "quote",
          "code-block",
          "table",
          "|",
          "source-code",
          "printer",
          "fullscreen",
          "ai",
        ],
        ai: {
          models: {
            custom: {
              url: "/ai",
              wrapPayload: (message: string) => {
                return JSON.stringify({
                  model: "llama3.2",
                  stream: false,
                  messages: [
                    {
                      role: "user",
                      content: message,
                    },
                  ],
                });
              },
              parseMessage: (message: string) => {
                const data = JSON.parse(message);
                return {
                  role: "assistant",
                  content: data?.message?.content,
                  // index: 2,
                  // 0 代表首个文本结果；1 代表中间文本结果；2 代表最后一个文本结果。
                  // status: 0|1|2,
                  // tatus: 2,
                };
              },
              protocol: "http",
            } as any,
          },
        },
        onChange: (ed) => {
          if (typeof onChange === "function") {
            onChange(ed.getMarkdown());
          }
        },
        image: {
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
            onSuccess: (file, response) => {
              return {
                errorCode: 0,
                data: {
                  src: response?.data?.url,
                  alt: "图片 alt",
                },
              };
            },
          },
        },
        // 提及
        onMentionQuery: () => [],
        ...options,
      });

      aiEditorRef.current = aiEditor;
    }

    return () => {
      if (aiEditorRef.current) {
        aiEditorRef.current.destroy();
        aiEditorRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (ref) {
      if (typeof ref === "function") {
        ref(divRef.current);
      } else {
        ref.current = divRef.current;
      }
    }
  }, [ref]);

  useEffect(() => {
    if (aiEditorRef.current && value !== aiEditorRef.current.getMarkdown()) {
      aiEditorRef.current.setContent(value || "");
    }
  }, [value]);

  return <div ref={divRef} {...props} />;
});
