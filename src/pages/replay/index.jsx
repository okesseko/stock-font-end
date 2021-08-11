import React, { useEffect, useRef, useState } from "react";
import BarChart from "../echart-example/bar";
import { defaultAxios, api } from "../../environment/api";
import { Button, Input, Select, DatePicker, Table } from "antd";
import dayjs from "dayjs";

const ReplayChart = () => {
  const chartRecord = useRef();
  const [barData, setBarData] = useState({});
  const [restData, setResetdata] = useState([]);
  const [restDataIndex, setResetdataIndex] = useState(0);
  const [buttonStatus, setButtonStatus] = useState("stop");
  const [showType, setShowType] = useState("all");
  const [frequency, setFrequency] = useState(1);
  const [startTime, setStartTime] = useState();
  function showValue(originData) {
    let xAxis = [],
      buySeries = [],
      sellSeries = [],
      useAbleData = [];
    originData.forEach((deta) => {
      const index = useAbleData.findIndex((key) => key.price === deta.price);
      if (index === -1) {
        useAbleData.push({
          price: deta.price,
          [deta.method ? "sell" : "buy"]: deta.quantity,
        });
      } else {
        const { price, sell = 0, buy = 0 } = useAbleData[index];
        console.log(index, useAbleData[index], deta.method);
        useAbleData[index] = {
          price,
          sell: sell + (deta.method ? deta.quantity : 0),
          buy: buy + (!deta.method ? deta.quantity : 0),
        };
      }
    });
    useAbleData = useAbleData.sort((a, b) => a.price - b.price);
    useAbleData.forEach((deta) => {
      xAxis.push(deta.price);
      sellSeries.push(deta.sell || 0);
      buySeries.push(deta.buy ? -deta.buy : 0);
    });
    // console.log(xAxis, buySeries, sellSeries, "all");
    return { xAxis, buySeries, sellSeries };
    // switch (showType) {
    //   case "all": {
    //     tickRange.forEach((obj) => {
    //       if (obj.price < originData.matchPrice) {
    //         xAxis.push(obj.price);
    //         series.push(-obj.buyQuantity);
    //       } else if (obj.price > originData.matchPrice) {
    //         xAxis.push(obj.price);
    //         series.push(obj.sellQuantity);
    //       }
    //     });
    //     break;
    //   }
    //   case "allfive": {
    //     fiveTickRange.forEach((obj) => {
    //       if (obj.buyQuantity !== undefined) {
    //         xAxis.push(obj.price);
    //         series.push(-obj.buyQuantity);
    //       } else if (obj.sellQuantity !== undefined) {
    //         xAxis.push(obj.price);
    //         series.push(obj.sellQuantity);
    //       }
    //     });
    //     break;
    //   }
    //   case "buyfive": {
    //     fiveTickRange.forEach((obj) => {
    //       if (obj.buyQuantity !== undefined) {
    //         xAxis.push(obj.price);
    //         series.push(-obj.buyQuantity);
    //       }
    //     });
    //     break;
    //   }
    //   case "sellfive": {
    //     fiveTickRange.forEach((obj) => {
    //       if (obj.sellQuantity !== undefined) {
    //         xAxis.push(obj.price);
    //         series.push(obj.sellQuantity);
    //       }
    //     });
    //     break;
    //   }
    //   default:
    //     break;
    // }
    // return { xAxis, series };
  }

  useEffect(() => {
    if (buttonStatus === "select") {
      defaultAxios({
        url: api.resetStock.url,
        method: api.resetStock.method,
        data: {
          id: 1,
          createdTime: startTime,
        },
      }).then((res) => {
        console.log(res.data.orders);
        setResetdata(res.data.orders);
      });
    } else if (buttonStatus === "start") {
      clearInterval(chartRecord.current);
      chartRecord.current = setInterval(() => {
        setResetdataIndex((index) => index + 1);
      }, 1000 * frequency);
    } else if (buttonStatus === "stop") {
      clearInterval(chartRecord.current);
    }
  }, [buttonStatus]);
  useEffect(() => {
    if (restDataIndex === restData.length) {
      clearInterval(chartRecord.current);
    } else {
      setBarData(showValue(restData.slice(0, restDataIndex)));
    }
    // setBarData(() => showValue(restData.splice(0, restDataIndex)));
  }, [restDataIndex]);
  useEffect(() => {
    if (buttonStatus === "start") {
      clearInterval(chartRecord.current);
      chartRecord.current = setInterval(() => {
        setResetdataIndex((index) => index + 1);
      }, 1000 * frequency);
    }
  }, [frequency]);
  return (
    <div>
      <BarChart data={barData} />
      <Select
        value={showType}
        style={{ width: 120, marginLeft: "20px" }}
        onChange={(value) => setShowType(value)}
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
      ></Select>
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
          幾秒一單
          <Input
            type="number"
            max={10}
            min={1}
            value={frequency}
            step={1}
            onChange={(e) => {
              setFrequency(e.target.value);
            }}
          />
        </div>
        <Button
          disabled={buttonStatus === "start" || !restData.length}
          onClick={() => {
            const nextStep = restData[restDataIndex];
            defaultAxios({
              url: api.postOrder.url,
              method: api.postOrder.method,
              data: {
                investorId: nextStep.investorId,
                stockId: nextStep.stockId,
                method: nextStep.method, // BUY = 0, SELL = 1
                price: nextStep.price,
                quantity: nextStep.quantity,
                priceType: nextStep.priceType, // MARKET = 0, LIMIT = 1
                timeRestriction: nextStep.timeRestriction, // ROD = 0, IOC = 1, FOK = 2
              },
            });
            setResetdataIndex(restDataIndex + 1);
          }}
        >
          手動下一步
        </Button>
      </div>
      <div>
        下步狀態({restDataIndex} / {restData.length} )
        {!!restData.length && (
          <Table
            columns={[
              {
                title: "訂單 ID",
                dataIndex: "orderId",
                render: (data) => <span>{data || "NULL"}</span>,
              },
              {
                title: "投資 ID",
                dataIndex: "investorId",
              },
              {
                title: "股票 ID",
                dataIndex: "stockId",
              },
              {
                title: "類型",
                dataIndex: "method",
                render: (data) => <span>{data ? "sell" : "buy"}</span>,
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
                title: "價格",
                dataIndex: "price",
              },
              {
                title: "數量",
                dataIndex: "quantity",
              },
              {
                title: "價格類型",
                dataIndex: "priceType",
                render: (data) => <span>{data ? "LIMIT" : "MARKET"}</span>,
              },
              {
                title: "狀態",
                dataIndex: "status",
                render: (data) => <span>{data ? "FULL" : "PARTIAL"}</span>,
              },
              {
                title: "時間限制",
                dataIndex: "timeRestriction",
                render: (data) => (
                  <span>{data ? "IOC" : data === 2 ? "FOK" : "ROD"}</span>
                ),
              },
              {
                title: "生成時間",
                dataIndex: "createdTime",
              },
            ]}
            pagination={false}
            dataSource={[restData[restDataIndex]]}
            sticky
          />
        )}
      </div>
    </div>
  );
};

export default ReplayChart;
