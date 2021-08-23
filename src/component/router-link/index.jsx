import { NavLink } from "react-router-dom";
import React from "react";

const RouterLink = () => {
  return (
    <ul className="sticky px-4 bg-gray-200 w-48 flex-shrink-0 min-h-screen">
      <li className="py-5 text-xl border-b border-black">
        <NavLink to="/stock-font-end/" exact>
          main
        </NavLink>
      </li>
      <li className="py-5 text-xl border-b border-black">
        <NavLink to="/stock-font-end/echart-example">echart example</NavLink>
      </li>
      <li className="py-5 text-xl border-b border-black">
        <NavLink to="/stock-font-end/auto-chart">LOB 圖表</NavLink>
      </li>
      <li className="py-5 text-xl border-b border-black">
        <NavLink to="/stock-font-end/replay-chart">重播紀錄</NavLink>
      </li>
      <li className="py-5 text-xl border-b border-black">
        <NavLink to="/stock-font-end/oreder-table">委託紀錄表單</NavLink>
      </li>
      <li className="py-5 text-xl border-b border-black">
        <NavLink to="/stock-font-end/price-table">成交紀錄表單</NavLink>
      </li>
      <li className="py-5 text-xl border-b border-black">
        <NavLink to="/stock-font-end/quick-order">閃電下單</NavLink>
      </li>
      <li className="py-5 text-xl border-b border-black">
        <NavLink to="/stock-font-end/case">情境管理</NavLink>
      </li>
      <li className="py-5 text-xl border-b border-black">
        <NavLink to="/stock-font-end/frequent-data">高頻資料</NavLink>
      </li>
    </ul>
  );
};

export default RouterLink;
