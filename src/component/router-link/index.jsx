import { NavLink } from "react-router-dom";
import React from "react";
import { Button } from "antd";
import { defaultAxios, api } from "../../environment/api";
import { useHistory } from "react-router-dom";
import errorNotification from "../../utils/errorNotification";

const RouterLink = ({ setToken }) => {
  const history = useHistory();
  return (
    <ul className="sticky px-4 bg-gray-200 w-48 flex-shrink-0 min-h-screen">
      <li className=" text-center text-xl border-b border-black">
        <Button
          className="w-full"
          size="large"
          onClick={() => {
            defaultAxios({
              url: api.logout.url,
              method: api.logout.method,
            })
              .catch((err) => {
                errorNotification(err?.response?.data);
              })
              .finally((res) => {
                setToken(null);
                history.replace("/stock-font-end/login/");
              });
          }}
        >
          登出
        </Button>
      </li>
      <li className=" py-5 text-xl border-b border-black">
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
        <NavLink to="/stock-font-end/Q1-chart">Q1 圖表</NavLink>
      </li>
      <li className="py-5 text-xl border-b border-black">
        <NavLink to="/stock-font-end/order-table">委託紀錄表單</NavLink>
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
      <li className="py-5 text-xl border-b border-black">
        <NavLink to="/stock-font-end/real-data-upload">上傳真實資料</NavLink>
      </li>
      <li className="py-5 text-xl border-b border-black">
        <NavLink to="/stock-font-end/simulator">模擬下單</NavLink>
      </li>
      <li className="py-5 text-xl border-b border-black">
        <NavLink to="/stock-font-end/stock">股票管理</NavLink>
      </li>
      <li className="py-5 text-xl border-b border-black">
        <NavLink to="/stock-font-end/role-management">權限管理</NavLink>
      </li>
      <li className="py-5 text-xl border-b border-black">
        <NavLink to="/stock-font-end/investor-management">帳戶管理</NavLink>
      </li>
    </ul>
  );
};

export default RouterLink;
