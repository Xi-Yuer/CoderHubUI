"use client";

import React, { Ref, useEffect, useImperativeHandle, useState } from "react";
import { Modal, Radio, Input, Button, Space } from "antd";
import {
  SANDBOX_TEMPLATES,
  Sandpack,
  TemplateFiles,
} from "@codesandbox/sandpack-react";
import event from "@/utils/event";
import { templateList } from "./template";

export type SandpackRefCallBack = {
  showModal: () => void;
  getFiles: () => Record<string, any>;
  getTemplate: () => keyof typeof SANDBOX_TEMPLATES;
};

type Props = {
  ref: Ref<SandpackRefCallBack>;
};

export default function SandpackModal({ ref }: Props) {
  const [template, setTemplate] = useState<keyof typeof SANDBOX_TEMPLATES>(
    templateList[0].value
  );
  const [files, setFiles] = useState<Record<string, any>>(
    templateList[0].files
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const current = templateList.find((item) => item.value === template);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    event.on("SAND_PACK", showModal);
    return () => {
      event.off("SAND_PACK", showModal);
    };
  }, []);

  useImperativeHandle(
    ref,
    function () {
      return {
        showModal,
        getFiles: () => files,
        getTemplate: () => template,
      };
    },
    []
  );

  return (
    <>
      <Modal
        title="插入交互代码块"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={"100%"}
        style={{ top: 20 }}
      >
        <div className="mb-4">
          <span className="block mb-2 font-medium">选择模板类型</span>
          <Radio.Group
            value={template}
            onChange={(e) => {
              const selected = e.target.value;
              setTemplate(selected);
              const tpl = templateList.find((item) => item.value === selected);
              setFiles(tpl?.files || {});
            }}
            optionType="button"
            buttonStyle="solid"
          >
            {templateList.map((tpl) => (
              <Radio.Button key={tpl.value} value={tpl.value}>
                {tpl.label}
              </Radio.Button>
            ))}
          </Radio.Group>
        </div>

        <div style={{ minHeight: 400 }}>
          <Sandpack
            template={template}
            files={files}
            options={{
              showConsole: template === "vanilla" || template === "static",
              autorun: true,
              autoReload: true,
            }}
            customSetup={{
              dependencies: current?.dependencies || {},
            }}
          />
        </div>
      </Modal>
    </>
  );
}
