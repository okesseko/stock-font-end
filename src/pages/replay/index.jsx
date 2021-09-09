import React, { useEffect, useRef, useState } from "react";
import BarChart from "../echart-example/bar";
import { defaultAxios, api } from "../../environment/api";
import { Button, Input, Select, DatePicker, Table } from "antd";
import BarLineChart from "../echart-example/bar-line";
import fakeData from "../../fake";
import dayjs from "dayjs";

const ReplayChart = () => {
  const chartRecord = useRef();
  const getChartRender = useRef();
  const [originData, setOriginData] = useState({});
  const [restData, setResetdata] = useState([]);
  const [restDataIndex, setResetdataIndex] = useState(-1);
  const [buttonStatus, setButtonStatus] = useState("stop");
  const [showType, setShowType] = useState("all");
  const [frequency, setFrequency] = useState(1000);
  const [chartRender, setChartRender] = useState(1);
  const [startTime, setStartTime] = useState();
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
          stockId: restData[0].stockId,
          isGetLatest: true,
        },
      }),
      defaultAxios({
        url: api.getDisplayChart.url,
        method: api.getDisplayChart.method,
        params: {
          stockId: restData[0].stockId,
          dateFormat: 3,
        },
      }),
    ]).then((val) => {
      setOriginData(() => val[0].data);
      console.log(val);
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
  useEffect(() => {
    if (buttonStatus === "select") {
      defaultAxios({
        url: api.resetStock.url,
        method: api.resetStock.method,
        data: {
          id: 1,
          createdTime: startTime,
          isReset: false,
        },
      }).then((res) => {
        setResetdata(res.data.orders);
        setOriginData({});
        setTimeChart({
          xAxis: [],
          price: [],
          quantity: [],
          buy: [],
          sell: [],
        });
        setFrequency(1000);
        setResetdataIndex(-1);
      });
    } else if (buttonStatus === "real") {
      setResetdata(fakeData);
      setOriginData({});
      setResetdataIndex(-1);
    } else if (buttonStatus === "start") {
      clearInterval(chartRecord.current);
      clearInterval(getChartRender.current);
      chartRecord.current = setInterval(
        () => {
          setResetdataIndex((index) => {
            return index + 1 < restData.length ? index + 1 : index;
          });
        },
        frequency < 100 ? 100 : frequency
      );
      getChartRender.current = setInterval(renderData, 1000 * chartRender);
    } else if (buttonStatus === "stop") {
      console.log("qweqweq");
      clearInterval(chartRecord.current);
      clearInterval(getChartRender.current);
    }
  }, [buttonStatus]);

  useEffect(() => {
    const nowStep = restData[restDataIndex];
    const nextStep = restData[restDataIndex + 1];
    if (nowStep && nextStep) {
      setFrequency(
        dayjs(nextStep.createdTime).diff(nowStep.createdTime, "millisecond")
      );
    }
    if (nowStep) {
      console.log("order");
      defaultAxios({
        url: api.postOrder.url,
        method: api.postOrder.method,
        data: nowStep,
      });
    }
    if (restDataIndex === restData.length - 1) {
      setButtonStatus("stop");
    }
  }, [restDataIndex]);

  useEffect(() => {
    if (buttonStatus === "start") {
      clearInterval(chartRecord.current);
      chartRecord.current = setInterval(
        () => {
          setResetdataIndex((index) => {
            return index + 1;
          });
        },
        frequency < 100 ? 100 : frequency
      );
    }
  }, [frequency]);
  useEffect(() => {
    if (buttonStatus === "start") {
      clearInterval(getChartRender.current);
      getChartRender.current = setInterval(renderData, 1000 * chartRender);
    }
  }, [chartRender]);
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
      <div className="flex justify-around my-6 items-end">
        <DatePicker
          showTime
          placeholder="選擇重播開始時間"
          disabledDate={(current) => current && current > dayjs()}
          onChange={(time) => {
            if (time) setStartTime(dayjs(time).toISOString());
            else setStartTime(time);
          }}
        />
        <Button
          type="primary"
          disabled={!startTime}
          onClick={() => setButtonStatus("select")}
        >
          選擇時間
        </Button>
        {/* <Button
          type="primary"
          onClick={() => setButtonStatus("real")}
        >
          使用證交所資料
        </Button> */}
        <Button
          type="primary"
          danger
          disabled={!restData.length}
          onClick={() => setButtonStatus("start")}
        >
          開始重播
        </Button>
        <Button
          style={{ background: "#91A194", color: "white" }}
          onClick={() => setButtonStatus("stop")}
        >
          暫停重播
        </Button>
        <div>
          多久刷新圖表
          <Select
            className="w-20"
            value={chartRender}
            options={[
              { value: 10, label: "10s" },
              { value: 5, label: "5s" },
              { value: 2, label: "2s" },
              { value: 1, label: "1s" },
            ]}
            onChange={(val) => {
              setChartRender(val);
            }}
          />
        </div>
        <Button
          disabled={buttonStatus === "start" || !restData.length}
          onClick={() => {
            setButtonStatus("next");
            if (restDataIndex + 1 < restData.length)
              setResetdataIndex(restDataIndex + 1);
          }}
        >
          手動下一步
        </Button>
      </div>
      <div>
        下步狀態({restDataIndex} / {restData.length - 1} )
        {!!restData.length && (
          <Table
            rowKey="id"
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

              // {
              //   title: "狀態",
              //   dataIndex: "status",
              //   render: (data) => <span>{data ? "FAIL" : "SUCCESS"}</span>,
              // },
              {
                title: "時間限制",
                dataIndex: "timeRestriction",
                render: (data) => (
                  <span>{data ? "IOC" : data === 2 ? "FOK" : "ROD"}</span>
                ),
              },
            ]}
            pagination={false}
            dataSource={[restData[restDataIndex + 1]]}
            sticky
          />
        )}
      </div>
    </div>
  );
};

export default ReplayChart;
