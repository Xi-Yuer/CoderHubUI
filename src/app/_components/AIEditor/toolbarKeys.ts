import event from "@/utils/event";

export const toolbarKeys = [
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
  "|",
  {
    icon: "icon-custom",
    html: `<div class="rounded-md">
             <div class="menu-ai flex gap-1" style="width:140px;">
             <svg t="1748672398243" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5819" width="200" height="200"><path d="M512 64C264.64 64 64 264.576 64 512c0 247.36 200.64 448 448 448 247.488 0 448-200.64 448-448C960 264.576 759.488 64 512 64zM384 704 384 320l320 192L384 704z" fill="#ffffff" p-id="5820"></path></svg>
                插入沙箱代码示例
              </div>
          </div>`,
    tip: "插入沙箱代码示例",
    onClick: () => {
      event.emit("SAND_PACK");
    },
  },
];

export const simpleToolbarKeys = [
  "undo",
  "redo",
  "brush",
  "eraser",
  "|",
  "bold",
  "italic",
  "underline",
  "ai",
];
