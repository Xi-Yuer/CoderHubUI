"use client";
import { GetPositionListRes } from "@/alova/globals";
import { ClientGetJobInfo } from "@/request/apis/web";
import React, { useEffect, useState } from "react";
import { Card, List, Select } from "antd";
import { dictionary } from "@/dictionary";
import { Tabs } from "antd"; // 引入 Tabs 组件

export default function Page() {
  const [data, setData] = useState<GetPositionListRes | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setLoading(true);
    ClientGetJobInfo()
      .then((res) => {
        setData(res.data);
        if (res.data.list.length > 0) {
          setSelectedCompany(res.data.list[0].name);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  });

  const companies = data?.list || [];
  const selectedJobs =
    companies.find((company) => company.name === selectedCompany)?.jobs || [];
  const filteredCompanies = selectedJobs.filter((company) =>
    company.location.includes(selectedPosition || "")
  );

  const companyList = () => {
    return (
      <>
         
        <>
          {/* 移动端 */}
          <div className="sticky top-0 bg-white z-10 p-4 md:hidden -mt-10">
            <div className="mb-4">
              <Select
                placeholder="请选择城市"
                showSearch
                allowClear
                className="w-full"
                value={selectedPosition}
                onChange={(value) => {
                  setSelectedPosition(value);
                }}
              >
                {dictionary.city.map((item) => (
                  <Select.Option key={item} value={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>
            </div>
            <Tabs
              onChange={(key) => setSelectedCompany(key)}
              activeKey={selectedCompany as string}
              items={companies.map((company) => ({
                label: company.name,
                key: company.name,
              }))}
            ></Tabs>
          </div>
        </>
        <>
          {/* 桌面端 */}
          <div className="h-full sticky top-[70px] hidden md:block">
            <Card className="w-60 flex flex-col">
              <div className="mb-4">
                <Select
                  placeholder="请选择城市"
                  showSearch
                  allowClear
                  className="w-full"
                  value={selectedPosition}
                  onChange={(value) => {
                    setSelectedPosition(value);
                  }}
                >
                  {dictionary.city.map((item) => (
                    <Select.Option key={item} value={item}>
                      {item}
                    </Select.Option>
                  ))}
                </Select>
              </div>
              {companies.map((company) => (
                <span
                  className={`block text-slate-900 p-2 cursor-pointer hover:bg-gray-50 ${selectedCompany === company.name ? "bg-gray-100" : ""}`}
                  key={company.name}
                  onClick={() => {
                    setSelectedCompany(company.name);
                  }}
                >
                  {company.name}
                </span>
              ))}
            </Card>
          </div>
        </>
      </>
    );
  };

  return (
    <div className="flex flex-col md:flex-row gap-3">
      {companyList()}
      <List
        className="w-full"
        dataSource={filteredCompanies}
        loading={loading}
        renderItem={(job: any) => (
          <Card
            key={job.name}
            title={job.name}
            style={{ marginBottom: 20 }}
            extra={
              <a href={job.url} target="_blank" rel="noopener noreferrer">
                投递简历
              </a>
            }
          >
            <div className="flex flex-col gap-2">
              <p className="font-semibold">{job.subName}</p>
              <p className="text-gray-500">
                {job.experience} | {job.location}
              </p>
              <div className="text-gray-500 flex flex-col gap-2">
                <span className="font-semibold text-slate-700">职位描述：</span>
                <p>{job.description}</p>
              </div>
              <div className="text-gray-500 flex flex-col gap-2">
                <span className="font-semibold text-slate-700">职位要求：</span>
                <p>{job.requirement}</p>
              </div>
            </div>
          </Card>
        )}
      />
    </div>
  );
}
