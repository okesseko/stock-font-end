import React, { useEffect, useRef, useState } from "react";
import Settings from "./settings";
import BarChart from "../echart-example/bar";
import BarLineChart from "../echart-example/bar-line";
import { defaultAxios, api } from "../../environment/api";
import { Button, Select, Typography } from "antd";
import { StockSelector } from "../../component/stock-selector";

const { Title } = Typography;
const { Option } = Select;

const AutoChart = () => {
  const chartRecord = useRef();
  const selectCaseId = useRef(undefined);
  const [fileName, setFileName] = useState();
  const [stockId, setStockId] = useState();
  const [originData, setOriginData] = useState({});
  const [buttonStatus, setButtonStatus] = useState("stop");
  const [showType, setShowType] = useState("all");
  const [frequency, setFrequency] = useState(1);
  const [realDataList, setRealDataList] = useState([]);
  const [isRealDataButtonLoading, setIsRealDataButtonLoading] = useState(false);
  const [timeChart, setTimeChart] = useState({
    xAxis: [],
    price: [],
    quantity: [],
    buy: [],
    sell: [],
  });

  function renderData() {
    if (stockId)
      Promise.all([
        defaultAxios({
          url: api.getDisplay.url,
          method: api.getDisplay.method,
          params: {
            stockId,
            isGetLatest: true,
          },
        }),
        defaultAxios({
          url: api.getDisplayChart.url,
          method: api.getDisplayChart.method,
          params: {
            stockId,
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
        id: stockId,
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
    if (isRealDataButtonLoading) {
      clearInterval(chartRecord.current);
    } else {
      chartRecord.current = setInterval(() => {
        renderData();
      }, frequency * 1000);
    }
    return () => {
      clearInterval(chartRecord.current);
    };
  }, [stockId, frequency, isRealDataButtonLoading]);

  useEffect(() => {
    defaultAxios({
      url: api.getRealOrder.url,
      method: api.getRealOrder.method,
    }).then(({ data }) => {
      setRealDataList(data);
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
        <div className="w-1/6">
          選擇股票
          <StockSelector
            style={{ width: "100%" }}
            onChange={(e) => {
              setStockId(e);
            }}
          />
        </div>
        <Button
          type="primary"
          onClick={() => setButtonStatus("start")}
          disabled={!stockId}
        >
          開始模擬
        </Button>
        <Button
          style={{ background: "#91A194", color: "white" }}
          onClick={() => setButtonStatus("stop")}
          disabled={!stockId}
        >
          暫停模擬
        </Button>
        <Button
          type="primary"
          danger
          onClick={() => {
            resetStock();
          }}
          disabled={!stockId}
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
      <div className="flex justify-around my-6 items-center">
        <div className="w-1/6">
          選擇證交所資料
          <Select
            style={{ width: "100%" }}
            onChange={(e) => {
              setFileName(e);
            }}
          >
            {realDataList &&
              realDataList.map((realData) => {
                return (
                  <Option key={Math.random()} value={realData}>
                    {realData}
                  </Option>
                );
              })}
          </Select>
        </div>
        <Button
          onClick={() => {
            const { url, method } = api.postRealOrder;
            setIsRealDataButtonLoading(true);
            defaultAxios({
              url,
              method,
              data: {
                stockId,
                fileName,
              },
            }).then(() => {
              setIsRealDataButtonLoading(false);
            });
          }}
          disabled={!stockId || !fileName}
          loading={isRealDataButtonLoading}
        >
          載入證交所資料
        </Button>
      </div>
      <Title className="m-4 mb-0" level={5}>
        使用情境
      </Title>
      <Settings buttonStatus={buttonStatus} />
    </div>
  );
};

export default AutoChart;
