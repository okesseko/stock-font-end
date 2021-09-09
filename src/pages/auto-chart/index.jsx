import React, { useEffect, useRef, useState } from "react";
import Settings from "./settings";
import BarChart from "../echart-example/bar";
import BarLineChart from "../echart-example/bar-line";
import { defaultAxios, api } from "../../environment/api";
import { Button, Select, Typography, Table } from "antd";

const { Title } = Typography;

const AutoChart = () => {
  const chartRecord = useRef();
  const selectCaseId = useRef(undefined);
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

  function renderData() {
    Promise.all([
      defaultAxios({
        url: api.getDisplay.url,
        method: api.getDisplay.method,
        params: {
          isGetLatest: true,
        },
      }),
      defaultAxios({
        url: api.getDisplayChart.url,
        method: api.getDisplayChart.method,
        params: {
          stockId: 1,
          dateFormat: frequency === 60 ? 0 : 3,
        },
      }),
    ]).then((val) => {
      console.log(val[1].data, "123");
      setOriginData(() => val[0].data);
      // const getData =
      //   val[1].data.length - 50 < 0 ? 0 : val[1].data.length - 100;
      const xAxis = [],
        price = [],
        quantity = [],
        buy = [],
        sell = [];
      val[1].data.slice(0, val[1].data.length).forEach((deta) => {
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
    });
  }
  function resetStock(getData = false) {
    defaultAxios({
      url: api.resetStock.url,
      method: api.resetStock.method,
      data: {
        id: 1,
        isReset: true,
        virtualOrderContainerId: selectCaseId.current,
      },
    }).then(() => {
      if (getData) renderData();
    });
    setOriginData({});
    setTimeChart({
      xAxis: [],
      price: [],
      quantity: [],
      buy: [],
      sell: [],
    });
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
          圖表更新頻率
          <Select
            className="w-20 ml-2"
            value={frequency}
            options={[
              { value: 60, label: "1m" },
              { value: 10, label: "10s" },
              { value: 5, label: "5s" },
              { value: 1, label: "1s" },
              { value: 0.5, label: "0.5s" },
            ]}
            onChange={(val) => {
              setFrequency(val);
            }}
          />
        </div>
      </div>
      <Title className="m-4 mb-0" level={5}>
        使用情境
      </Title>
      <Settings buttonStatus={buttonStatus} />
    </div>
  );
};

export default AutoChart;
