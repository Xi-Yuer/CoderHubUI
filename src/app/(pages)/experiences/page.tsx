"use client";
import { Button, Card, message } from "antd";
import React, { useState } from "react";
import { BankOutlined, EditOutlined, ReadOutlined } from "@ant-design/icons";
import { Tabs } from "antd";
import School from "./_components/school";
import Work from "./_components/work";
import SchoolFilter from "./_components/schoolFilter";
import WorkFilter from "./_components/workFilter";
import AddSchoolExperienceModal from "./_components/schoolDialog";
import AddWorkExperienceModal from "./_components/workDialog";
import { ClientCreateSchoolExp, ClientCreateWorkExp } from "@/request/apis/web";

export default function Page() {
  const [messageApi, contextHolder] = message.useMessage();
  const [current, setCurrent] = useState("school");
  const [schoolParams, setSchoolParams] = useState({});
  const [workParams, setWorkParams] = useState({});
  const [AddSchoolExperienceModalVsible, setAddSchoolExperienceModalVisible] =
    useState(false);
  const [AddWorkExperienceModalVsible, setAddWorkExperienceModalVisible] =
    useState(false);

  return (
    <div className="container flex flex-wrap gap-4">
      {contextHolder}
      <div className="lg:sticky lg:top-[75px] h-fit lg:w-80 w-full">
        <Card className="lg:w-80 w-full" title="条件筛选">
          {current === "school" ? (
            <SchoolFilter setSchoolParams={setSchoolParams} />
          ) : (
            <WorkFilter setWorkParams={setWorkParams} />
          )}
        </Card>
      </div>
      <Card
        title="经验列表"
        className="flex-1 w-full"
        extra={
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              if (current === "school") {
                setAddSchoolExperienceModalVisible(true);
              }
              if (current === "work") {
                setAddWorkExperienceModalVisible(true);
              }
            }}
          >
            我也要留言
          </Button>
        }
      >
        <Tabs
          type="card"
          defaultActiveKey={current}
          onChange={(key) => setCurrent(key)}
          tabBarGutter={10}
          items={[
            {
              key: "school",
              label: `学院`,
              children: <School filterParams={schoolParams} />,
              icon: <ReadOutlined />,
            },
            {
              key: "work",
              label: `公司`,
              children: <Work filterParams={workParams} />,
              icon: <BankOutlined />,
            },
          ]}
        />
      </Card>
      <AddSchoolExperienceModal
        visible={AddSchoolExperienceModalVsible}
        onClose={() => setAddSchoolExperienceModalVisible(false)}
        onSubmit={(val) => {
          ClientCreateSchoolExp(val).then(() => {
            setAddSchoolExperienceModalVisible(false);
            setSchoolParams({});
            messageApi.success("感谢您的留言");
          });
        }}
      />
      <AddWorkExperienceModal
        visible={AddWorkExperienceModalVsible}
        onClose={() => setAddWorkExperienceModalVisible(false)}
        onSubmit={(val) => {
          ClientCreateWorkExp(val).then(() => {
            setAddWorkExperienceModalVisible(false);
            setWorkParams({});
            messageApi.success("感谢您的留言");
          });
        }}
      />
    </div>
  );
}
