"use client";
import { useAppStore } from "@/store";
import { AiEditor, AiEditorOptions, CustomMenu, MenuGroup } from "aieditor";
import "aieditor/dist/style.css";

import { HTMLAttributes, forwardRef, useEffect, useRef } from "react";
import { AIMenus } from "./menus";
import { models } from "./models";
import { images } from "./image";
import { useStore } from "zustand";

type AIEditorProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange"> & {
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  editable?: boolean;
  toolbarKeys?: (string | CustomMenu | MenuGroup)[] | undefined;
  allowUploadImage?: boolean;
  textSelectionBubbleMenu?: boolean;
  onChange?: (val: string) => void;
  options?: Omit<AiEditorOptions, "element">;
};

export default forwardRef<HTMLDivElement, AIEditorProps>(function AIEditor(
  {
    placeholder,
    defaultValue,
    value,
    onChange,
    editable = true,
    options,
    toolbarKeys,
    allowUploadImage,
    textSelectionBubbleMenu = true,
    ...props
  }: AIEditorProps,
  ref
) {
  const divRef = useRef<HTMLDivElement>(null);
  const aiEditorRef = useRef<AiEditor | null>(null);
  const { token } = useStore(useAppStore, (state) => state);

  useEffect(() => {
    if (!divRef.current) return;

    if (!aiEditorRef.current) {
      const aiEditor = new AiEditor({
        element: divRef.current,
        placeholder: placeholder,
        content: defaultValue,
        toolbarKeys: toolbarKeys,
        editable: editable,
        textSelectionBubbleMenu: {
          enable: true,
          items: [
            "ai",
            "Bold",
            "Italic",
            "Underline",
            "Strike",
            "code",
            "comment",
            "translate",
          ],
        },
        ai: {
          models: models(token),
          menus: AIMenus,
          translate: {
            prompt: (lang, selectedText) => {
              return `translate$${lang}$${selectedText}`;
            },
            translateMenuItems: [
              { title: "英语", language: "英语" },
              { title: "中文" },
              { title: "日语" },
              { title: "法语" },
              { title: "德语" },
              { title: "葡萄牙语" },
              { title: "西班牙语" },
            ],
          },
        },
        onChange: (ed) => {
          if (typeof onChange === "function") {
            onChange(ed.getMarkdown());
          }
        },
        image: images(token, allowUploadImage),
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
