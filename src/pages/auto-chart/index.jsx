import React, { useEffect, useRef, useState } from "react";
import Settings from "./settings";
import BarChart from "../echart-example/bar";
import { defaultAxios, api } from "../../environment/api";
import { Button, Input, Select } from "antd";

const AutoChart = () => {
  const chartRecord = useRef();
  const [originData, setOriginData] = useState({});
  const [buttonStatus, setButtonStatus] = useState("stop");
  const [showType, setShowType] = useState("all");
  const [frequency, setFrequency] = useState(1);

  useEffect(() => {
    clearInterval(chartRecord.current);
    function renderData() {
      console.log("ren");
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
    }
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
                isReset: true,
              },
            });
            setOriginData({});
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
