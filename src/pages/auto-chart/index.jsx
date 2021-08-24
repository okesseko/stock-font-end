import React, { useEffect, useRef, useState } from "react";
import Settings from "./settings";
import BarChart from "../echart-example/bar";
import BarLineChart from "../echart-example/bar-line";
import { defaultAxios, api } from "../../environment/api";
import { Button, Input, Select, Typography, Table } from "antd";

const { Title } = Typography;
const AutoChart = () => {
  const chartRecord = useRef();
  const selectCaseId = useRef(null);
  const [originData, setOriginData] = useState({});
  const [buttonStatus, setButtonStatus] = useState("stop");
  const [showType, setShowType] = useState("all");
  const [frequency, setFrequency] = useState(1);
  const [timeChart, setTimeChart] = useState({
    xAxis: [],
    price: [],
    quantity: [],
    buy: [],
    sell: [],
  });
  const [caseData, setCaseData] = useState([]);
  const [caseOrder, setCaseOrder] = useState([]);

  function renderData() {
    defaultAxios({
      url: api.getDisplay.url,
      method: api.getDisplay.method,
      params: {
        isGetLatest: true,
      },
    }).then((res) => {
      const data = res.data;
      setOriginData(() => data);
    });
    defaultAxios({
      url: api.getDisplayChart.url,
      method: api.getDisplayChart.method,
      params: {
        stockId: 1,
        dateFormat: 0,
      },
    }).then((res) => {
      const xAxis = [],
        price = [],
        quantity = [],
        buy = [],
        sell = [];
      res.data.forEach((deta) => {
        xAxis.push(deta.createdTime);
        price.push(deta.close);
        quantity.push(deta.quantity);
        buy.push(deta.firstOrderBuy);
        sell.push(deta.firstOrderSell);
      });
      setTimeChart({
        xAxis,
        price,
        quantity,
        buy,
        sell,
      });

      console.log(res.data);
    });
  }
  function resetStock(getData = false) {
    defaultAxios({
      url: api.resetStock.url,
      method: api.resetStock.method,
      data: {
        id: 1,
        isReset: true,
      },
    }).then(() => {
      if (getData) renderData();
    });
    setOriginData({});
    setButtonStatus("stop");
  }

  useEffect(() => {
    clearInterval(chartRecord.current);
    if (buttonStatus === "start") {
      chartRecord.current = setInterval(() => {
        renderData();
      }, frequency * 1000);
    }
    return () => {
      clearInterval(chartRecord.current);
    };
  }, [buttonStatus, frequency]);
  useEffect(() => {
    defaultAxios({
      url: api.getVirtualOrderContainer.url,
      method: api.getVirtualOrderContainer.method,
    }).then((res) => {
      setCaseData(
        res.data.content.map((content) => ({
          label: content.name,
          value: content.id,
        }))
      );
    });
  }, []);
  return (
    <div>
      <BarChart originData={originData} showType={showType} />
      <div className="flex justify-around my-6 items-center">
        <div>
          圖表模式
          <Select
            value={showType}
            style={{ width: 120, marginLeft: "20px" }}
            onChange={(value) => {
              setShowType(value);
            }}
            options={[
              {
                label: "全部",
                value: "all",
              },
              {
                label: "買賣五檔",
                value: "allfive",
              },
              {
                label: "買五檔",
                value: "buyfive",
              },
              {
                label: "賣五檔",
                value: "sellfive",
              },
            ]}
          />
        </div>
        目前狀態: {buttonStatus}
      </div>
      <BarLineChart data={timeChart} />
      <div className="flex justify-around my-6 items-center">
        <Button type="primary" onClick={() => setButtonStatus("start")}>
          開始模擬
        </Button>
        <Button
          style={{ background: "#91A194", color: "white" }}
          onClick={() => setButtonStatus("stop")}
        >
          暫停模擬
        </Button>
        <Button
          type="primary"
          danger
          onClick={() => {
            resetStock();
          }}
        >
          重製模擬
        </Button>
        <div>
          圖表更新頻率(s)
          <Input
            type="number"
            max={10}
            min={0.1}
            value={frequency}
            step={0.1}
            onChange={(e) => {
              setFrequency(e.target.value);
            }}
          />
        </div>
      </div>
      <Title className="m-4 mb-0" level={5}>
        使用情境
      </Title>
      <div className="max-h-96 m-4 mt-1 border border-gray-200 px-4">
        <div className="my-4 flex justify-around  items-end">
          <div className="w-1/6">
            選擇情境
            <Select
              className="w-full"
              options={caseData}
              onChange={(caseId) => {
                selectCaseId.current = caseId;
                defaultAxios({
                  url: api.getVirtualOrder.url,
                  method: api.getVirtualOrder.method,
                  params: {
                    virtualOrderContainerId: caseId,
                  },
                }).then((res) => {
                  console.log(res.data.content);
                  setCaseOrder(res.data.content);
                });
              }}
            />
          </div>
          <Button
            type="primary"
            onClick={() => {
              if (selectCaseId.current !== null) {
                defaultAxios({
                  url: api.putStock.url,
                  method: api.putStock.method,
                  data: {
                    id: 1,
                    virtualOrderContainerId: selectCaseId.current,
                  },
                }).then(() => {
                  resetStock(true);
                });
              }
            }}
          >
            使用情境重製
          </Button>
          <Button
            type="primary"
            danger
            onClick={() => {
              if (caseOrder.length) {
                defaultAxios({
                  url: api.postOrder.url,
                  method: api.postOrder.method,
                  data: {
                    investorId: 1,
                    stockId: 1,
                    ...caseOrder[0],
                  },
                }).then(() => {
                  setCaseOrder(caseOrder.slice(1));
                  renderData();
                });
              }
            }}
          >
            單步執行情境
          </Button>
        </div>
        <Table
          className="h-full "
          scroll={{ y: 240 }}
          columns={[
            {
              title: "價格類型",
              dataIndex: "priceType",
              render: (data) => <span>{data ? "LIMIT" : "MARKET"}</span>,
            },
            {
              title: "類型",
              dataIndex: "method",
              render: (data) => <span>{data ? "sell" : "buy"}</span>,
            },
            {
              title: "價格",
              dataIndex: "price",
            },
            {
              title: "數量",
              dataIndex: "quantity",
            },

            {
              title: "副類型",
              dataIndex: "subMethod",
              render: (data) => (
                <span>
                  {data ? "UPDATE" : data === null ? "NULL" : "CANCEL"}
                </span>
              ),
            },
            {
              title: "時間限制",
              dataIndex: "timeRestriction",
              render: (data) => (
                <span>{data ? "IOC" : data === 2 ? "FOK" : "ROD"}</span>
              ),
            },
          ]}
          pagination={false}
          dataSource={caseOrder}
        />
      </div>
      <Settings buttonStatus={buttonStatus} />
    </div>
  );
};

export default AutoChart;
