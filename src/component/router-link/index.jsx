import React from "react";
import { NavLink } from "react-router-dom";

const RouterLink = () => {
  return (
    <ul className="sticky px-4 bg-gray-200 w-48 flex-shrink-0 min-h-screen">
      <li className="py-5 text-xl border-b border-black">
        <NavLink to="/" exact>
          main
        </NavLink>
      </li>
      <li className="py-5 text-xl border-b border-black">
        <NavLink to="/echart-example">echart example</NavLink>
      </li>
      <li className="py-5 text-xl border-b border-black">
        <NavLink to="/auto-chart">LOB 圖表</NavLink>
      </li>
      <li className="py-5 text-xl border-b border-black">
        <NavLink to="/replay-chart">重播紀錄</NavLink>
      </li>
      <li className="py-5 text-xl border-b border-black">
        <NavLink to="/oreder-table">委託紀錄表單</NavLink>
      </li>
      <li className="py-5 text-xl border-b border-black">
        <NavLink to="/price-table">成交紀錄表單</NavLink>
      </li>
      <li className="py-5 text-xl border-b border-black">
        <NavLink to="/case">情境管理</NavLink>
      </li>
    </ul>
  );
};

export default RouterLink;
