import React, { useState, useEffect } from "react";
import { ClientSignIn, ClientGetSignInRecord } from "@/request/apis/web";
import { message } from "antd";
import { UserSign } from "@/alova/globals";
import { CarryOutOutlined } from "@ant-design/icons";

const daysOfWeek = ["日", "一", "二", "三", "四", "五", "六"];

const Signin: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [signInRecords, setSignInRecords] = useState<UserSign[]>([]);
  const [todaySignedIn, setTodaySignedIn] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const fetchRecords = async () => {
    try {
      const res = await ClientGetSignInRecord(year, month + 1); // 注意月份从 1 开始
      setSignInRecords(res.data || []);
      const today = new Date();
      if (
        today.getFullYear() === year &&
        today.getMonth() === month &&
        res.data?.[today.getDate() - 1]?.bool
      ) {
        setTodaySignedIn(true);
      } else {
        setTodaySignedIn(false);
      }
    } catch (err) {
      message.error("获取签到记录失败");
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [currentDate]);

  const handleSignIn = async () => {
    try {
      await ClientSignIn();
      message.success("签到成功");
      fetchRecords();
    } catch (err) {
      message.error("签到失败");
    }
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = new Date(year, month, 1).getDay();

    const calendarDays = [];
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      calendarDays.push(i);
    }

    return (
      <div>
        <div className="flex gap-2 text-md font-semibold mb-4">
          <CarryOutOutlined />
          <span>每日签到</span>
        </div>
        {/* 月份切换栏 */}
        <div className="flex justify-between items-center mb-6 text-[12px]">
          <button
            onClick={() => changeMonth(-1)}
            className="text-gray-500 hover:text-black transition"
          >
            ← 上月
          </button>
          <h2 className="font-semibold text-gray-800 tracking-wide">
            {year}年 {month + 1}月
          </h2>
          <button
            onClick={() => changeMonth(1)}
            className="text-gray-500 hover:text-black transition"
          >
            下月 →
          </button>
        </div>

        {/* 星期标题 */}
        <div className="grid grid-cols-7 gap-1 text-center text-sm font-semibold text-gray-600 mb-2">
          {daysOfWeek.map((day) => (
            <div key={day} className="uppercase tracking-wide">
              {day}
            </div>
          ))}
        </div>

        {/* 日期格子 */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, idx) => {
            if (day === null)
              return <div key={idx} className="aspect-square" />;
            const isToday =
              day === new Date().getDate() &&
              month === new Date().getMonth() &&
              year === new Date().getFullYear();

            const signedIn = signInRecords[day - 1]?.bool;

            return (
              <div
                key={idx}
                className={`
                  p-1 border text-gray-800 flex justify-center items-center
                  ${signedIn ? "bg-black text-white" : "bg-white"}
                  rounded-[5px] cursor-pointer
                  text-[12px]
                  w-6 h-6
                  relative
                `}
                title={signedIn ? "已签到" : "未签到"}
                onClick={isToday && !todaySignedIn ? handleSignIn : undefined}
              >
                {day}
                <div
                  className={`
                    w-1 h-1 rounded-full absolute -top-1.5 -right-1.5 m-1
                    ${signedIn ? "bg-green-500" : "bg-gray-300"}
                  `}
                ></div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const changeMonth = (offset: number) => {
    const newDate = new Date(year, month + offset, 1);
    setCurrentDate(newDate);
  };

  return <div>{renderCalendar()}</div>;
};

export default Signin;
