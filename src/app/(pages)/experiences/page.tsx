"use client";
import { Card } from "antd";
import React, { useState } from "react";
import { BankOutlined, ReadOutlined } from "@ant-design/icons";
import { Tabs } from "antd";
import School from "./_components/school";
import Work from "./_components/work";
import SchoolFilter from "./_components/schoolFilter";
import WorkFilter from "./_components/workFilter";

export default function Page() {
  const [current, setCurrent] = useState("school");
  const [schoolParams, setSchoolParams] = useState({});
  const [workParams, setWorkParams] = useState({});

  return (
    <div className="container flex flex-wrap gap-4">
      <Card className="w-full sm:w-80" title="条件筛选">
        {current === "school" ? (
          <SchoolFilter setSchoolParams={setSchoolParams} />
        ) : (
          <WorkFilter setWorkParams={setWorkParams} />
        )}
      </Card>

      <Card className="flex-1 w-full">
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
    </div>
  );
}
