import { Table } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { api, defaultAxios } from "../../../environment/api";

const OrderTable = () => {
  const [orederData, setOrderData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalSize, setTotalSize] = useState(0);
  useEffect(() => {
    defaultAxios({
      url: api.getOrder.url,
      method: api.getOrder.method,
      params: {
        page: { page: page, pageSize: pageSize },
      },
    }).then((res) => {
      console.log(res.data, "asd");
      setOrderData(res.data.content);
      setTotalSize(res.data.totalSize);
    });
  }, [page, pageSize]);

  return (
    <Table
      columns={[
        {
          title: "訂單 ID",
          dataIndex: "orderId",
          render: (data) => <span>{data || "NULL"}</span>,
          key: Math.random(),
        },
        {
          title: "投資 ID",
          dataIndex: "investorId",
          key: Math.random(),
        },
        {
          title: "股票 ID",
          dataIndex: "stockId",
          key: Math.random(),
        },
        {
          title: "類型",
          dataIndex: "method",
          render: (data) => <span>{data ? "sell" : "buy"}</span>,
          key: Math.random(),
        },
        {
          title: "副類型",
          dataIndex: "subMethod",
          render: (data) => (
            <span>{data ? "UPDATE" : data === null ? "NULL" : "CANCEL"}</span>
          ),
          key: Math.random(),
        },
        {
          title: "價格",
          dataIndex: "price",
          key: Math.random(),
        },
        {
          title: "數量",
          dataIndex: "quantity",
          key: Math.random(),
        },
        {
          title: "價格類型",
          dataIndex: "priceType",
          render: (data) => <span>{data ? "LIMIT" : "MARKET"}</span>,
          key: Math.random(),
        },
        {
          title: "狀態",
          dataIndex: "status",
          render: (data) => <span>{data ? "FULL" : "PARTIAL"}</span>,
          key: Math.random(),
        },
        {
          title: "時間限制",
          dataIndex: "timeRestriction",
          render: (data) => (
            <span>{data ? "IOC" : data === 2 ? "FOK" : "ROD"}</span>
          ),
          key: Math.random(),
        },
        {
          title: "委託時間",
          dataIndex: "createdTime",
          width: 200,
          render: (data) => (
            <span>{dayjs(data).format("YYYY/MM/DD HH:mm:ss")}</span>
          ),
          key: Math.random(),
        },
      ]}
      dataSource={orederData}
      pagination={{
        pageSize: pageSize,
        total: totalSize,
        onChange: (page) => {
          setPage(page);
        },
        onShowSizeChange: (cur, size) => {
          setPageSize(size);
        },
      }}
      sticky
    />
  );
};

export default OrderTable;
