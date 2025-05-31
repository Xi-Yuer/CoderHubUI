"use client";

import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import event from "@/utils/event";

export default function Sandpack() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [] = useState([
    {
      type: "react",
      files: {
        "/App.js": `export default function App() {
            return <h1>Hello Sandpack!!</h1>
          }`,
      },
    },
  ]);

  useEffect(() => {
    event.on("SAND_PACK", showModal);
    return () => {
      event.off("SAND_PACK", showModal);
    };
  }, []);
  return (
    <>
      <Modal
        title="插入代码块"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={"100%"}
        style={{ top: 20 }}
      >
        请选择模板
      </Modal>
    </>
  );
}
