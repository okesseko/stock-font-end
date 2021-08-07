import React, { useEffect, useRef, useState } from "react";
import Settings from "./settings";
import BarChart from "../echart-example/bar";
import { defaultAxios, api } from "../../environment/api";
import { Button, Input, Select } from "antd";

const AutoChart = () => {
  const [barData, setBarData] = useState({});
  const [buttonStatus, setButtonStatus] = useState();
  const [showType, setShowType] = useState("all");
  const [frequency, setFrequency] = useState(1);
  const barRef = useRef();
  barRef.current = barData;
  function showValue(originData) {
    let xAxis = [],
      series = [];
    switch (showType) {
      case "all": {
        originData.tickRange.reverse().forEach((obj) => {
          if (obj.price < originData.matchPrice) {
            xAxis.push(obj.price);
            series.push(-obj.buyQuantity);
          } else if (obj.price > originData.matchPrice) {
            xAxis.push(obj.price);
            series.push(obj.sellQuantity);
          }
        });
        break;
      }
      case "allfive": {
        originData.fiveTickRange.reverse().forEach((obj) => {
          if (obj.buyQuantity) {
            xAxis.push(obj.price);
            series.push(-obj.buyQuantity);
          } else if (obj.sellQuantity) {
            xAxis.push(obj.price);
            series.push(obj.sellQuantity);
          }
        });
        break;
      }
      case "buyfive": {
        originData.fiveTickRange.reverse().forEach((obj) => {
          if (obj.buyQuantity) {
            xAxis.push(obj.price);
            series.push(-obj.buyQuantity);
          }
        });
        break;
      }
      case "sellfive": {
        originData.fiveTickRange.reverse().forEach((obj) => {
          if (obj.sellQuantity) {
            xAxis.push(obj.price);
            series.push(obj.sellQuantity);
          }
        });
        break;
      }
      default:
        break;
    }
    return { xAxis, series };
  }

  useEffect(() => {
    let barLoop;
    clearInterval(barLoop);
    function renderData() {
      defaultAxios({
        url: api.getDisplay.url,
        method: api.getDisplay.method,
        params: {
          isGetLatest: true,
        },
      }).then((res) => {
        const data = res.data;
        console.log(data, "qwe");
        setBarData(() => showValue(data));
      });
    }
    if (buttonStatus === "start") {
      barLoop = setInterval(() => {
        renderData();
      }, frequency * 1000);
    }

    return () => {
      clearInterval(barLoop);
    };
  }, [buttonStatus, showType, frequency]);

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
            defaultAxios({
              url: api.resetStock.url,
              method: api.resetStock.method,
              data: {
                id: 1,
              },
            });

            setButtonStatus("stop");
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
      <Settings buttonStatus={buttonStatus} />
    </div>
  );
};

export default AutoChart;
