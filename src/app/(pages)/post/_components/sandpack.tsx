"use client";
import { SandpackProject } from "@/alova/globals";
import { ClientGetSandpack } from "@/request/apis/web";
import { RunIcon, Sandpack } from "@codesandbox/sandpack-react";
import { Button, Card, Modal } from "antd";
import { useEffect, useState } from "react";
import { templateList } from "../../creator/_components/template";

interface SandpackProps {
  author: string;
  articleId: string;
}

export default function SodeSandpack(props: SandpackProps) {
  const [sandpackDetails, setSandpackDetails] = useState<SandpackProject>();
  const [showSandpack, setShowSandpack] = useState(false);
  useEffect(() => {
    ClientGetSandpack(props.author, props.articleId).then((res) => {
      setSandpackDetails(res.data);
    });
  }, [props.author, props.articleId, showSandpack]);

  return (
    <>
      {sandpackDetails && (
        <>
          <Card title="代码沙盒">
            <Button
              icon={<RunIcon />}
              type="primary"
              block
              onClick={() => setShowSandpack(!showSandpack)}
            >
              运行示例代码
            </Button>
          </Card>
          <Modal
            open={showSandpack}
            onCancel={() => setShowSandpack(false)}
            width="100%"
            style={{
              top: 20,
            }}
            footer={null}
            title="运行代码"
          >
            <div style={{ minHeight: 400 }}>
              <Sandpack
                template={(sandpackDetails?.template as any) || "vanilla"}
                files={sandpackDetails?.files || {}}
                options={{
                  showConsole:
                    sandpackDetails?.template === "vanilla" ||
                    sandpackDetails?.template === "static",
                  autorun: true,
                  autoReload: true,
                }}
                customSetup={{
                  dependencies:
                    templateList.find(
                      (item) => item.value === sandpackDetails?.template
                    )?.dependencies || {},
                }}
              ></Sandpack>
            </div>
          </Modal>
        </>
      )}
    </>
  );
}
