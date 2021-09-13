import React, { useEffect, useMemo, useRef, useState } from "react";
import BarChart from "../echart-example/bar";
import { defaultAxios, api } from "../../environment/api";
import { Button, Select, DatePicker, Table } from "antd";
import BarLineChart from "../echart-example/bar-line";
import dayjs from "dayjs";
import { StockSelector } from "../../component/stock-selector";

const { RangePicker } = DatePicker;

const ReplayChart = () => {
  const chartRecord = useRef();
  const getChartRender = useRef();
  const [stockId, setStockId] = useState();
  const [replayStockId, setReplayStockId] = useState();
  const [originData, setOriginData] = useState({});
  const [restData, setResetdata] = useState([]);
  const [restDataIndex, setResetdataIndex] = useState(-1);
  const [buttonStatus, setButtonStatus] = useState("stop");
  const [showType, setShowType] = useState("all");
  const [frequency, setFrequency] = useState(1000);
  const [chartRender, setChartRender] = useState(1);
  const [dataTime, setDataTime] = useState({
    start: null,
    end: null,
    reply: null,
  });
  const [timeChart, setTimeChart] = useState({
    xAxis: [],
    price: [],
    quantity: [],
    buy: [],
    sell: [],
  });

  const selectCaseId = useRef();
  const [caseData, setCaseData] = useState([]);
  const [caseOrder, setCaseOrder] = useState([]);
  const [isResetButtonLoading, setIsResetButtonLoading] = useState(false);
  const latestChartTime = useRef(null);

  useEffect(() => {
    defaultAxios({
      url: api.getVirtualOrderContainer.url,
      method: api.getVirtualOrderContainer.method,
      params: {
        stockId,
      },
    }).then((res) => {
      setCaseData(
        res.data.content.map((content) => ({
          label: content.name,
          value: content.id,
        }))
      );
    });
  }, [stockId]);

  function renderData() {
    Promise.all([
      defaultAxios({
        url: api.getDisplay.url,
        method: api.getDisplay.method,
        params: {
          stockId: replayStockId,
          isGetLatest: true,
        },
      }),
      defaultAxios({
        url: api.getDisplayChart.url,
        method: api.getDisplayChart.method,
        params: {
          stockId: replayStockId,
          dateFormat: 4,
          createdTime: latestChartTime.current
            ? JSON.stringify({
                min: new Date(latestChartTime.current).toISOString(),
              })
            : undefined,
        },
      }),
    ]).then((val) => {
      setOriginData(() => val[0].data);

      const newTimeChart = { ...timeChart };
      val[1].data.forEach((data, index, arr) => {
        newTimeChart.xAxis.push(data.createdTime);
        newTimeChart.price.push(data.close);
        newTimeChart.quantity.push(data.quantity);
        newTimeChart.buy.push(data.firstOrderBuy);
        newTimeChart.sell.push(data.firstOrderSell);
        if (index === arr.length - 1) {
          const TIME_CHART = new Date(data.createdTime).getTime();
          if (
            !latestChartTime.current ||
            TIME_CHART > new Date(latestChartTime.current).getTime()
          ) {
            latestChartTime.current = TIME_CHART + 1;
            setTimeChart(newTimeChart);
          }
        }
      });
      setTimeChart(newTimeChart);
    });
  }
  useEffect(() => {
    if (buttonStatus === "select") {
      setIsResetButtonLoading(true);
      defaultAxios({
        url: api.resetStock.url,
        method: api.resetStock.method,
        data: {
          id: stockId,
          startTime: dayjs(dataTime.start).toISOString(),
          endTime: dayjs(dataTime.end).toISOString(),
          replayTime: dataTime.reply
            ? dayjs(dataTime.reply).toISOString()
            : undefined,
          isReset: false,
        },
      }).then((res) => {
        setResetdata(res.data.orders);
        setReplayStockId(res.data.display.stockId);
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
        setIsResetButtonLoading(false);
      });
    } else if (buttonStatus === "start") {
      clearInterval(chartRecord.current);
      clearInterval(getChartRender.current);
      chartRecord.current = setInterval(() => {
        setResetdataIndex((index) => {
          return index + 1 < restData.length ? index + 1 : index;
        });
      }, frequency);
      getChartRender.current = setInterval(renderData, 1000 * chartRender);
    } else if (buttonStatus === "stop") {
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
      defaultAxios({
        url: api.postOrder.url,
        method: api.postOrder.method,
        data: nowStep,
      });
    }
    if (restDataIndex === restData.length - 1) {
      setTimeout(() => {
        setButtonStatus("stop");
      }, 1000 * chartRender);
    }
  }, [restDataIndex]);

  useEffect(() => {
    if (buttonStatus === "start") {
      clearInterval(chartRecord.current);
      chartRecord.current = setInterval(() => {
        setResetdataIndex((index) => {
          return index + 1 < restData.length ? index + 1 : index;
        });
      }, frequency);
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
      {useMemo(() => {
        return <BarChart originData={originData} showType={showType} />;
      }, [originData, showType])}
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
      {useMemo(() => {
        return <BarLineChart data={timeChart} />;
      }, [timeChart])}
      <div className="flex justify-around my-6 items-end">
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
            renderData();
            setButtonStatus("next");
            if (restDataIndex + 1 < restData.length)
              setResetdataIndex(restDataIndex + 1);
          }}
        >
          手動下一步
        </Button>
      </div>
      <div className="m-4 flex justify-around  items-end">
        <div className="w-1/6">
          選擇股票
          <StockSelector
            style={{ width: "100%" }}
            onChange={(e) => {
              setStockId(e);
            }}
          />
        </div>
        <div className="w-2/6">
          選擇重播資料時間區間
          <RangePicker
            showTime
            placeholder={["開始時間", "結束時間"]}
            disabledDate={(current) => current && current > dayjs()}
            onChange={(time) => {
              if (time) {
                setDataTime({
                  ...dataTime,
                  start: time[0],
                  end: time[1],
                });
              } else {
                setDataTime({
                  ...dataTime,
                  start: null,
                  end: null,
                });
              }
            }}
          />
        </div>
        <div className="w-1/6">
          選擇開始撥放時間
          <DatePicker
            style={{ width: "100%" }}
            showTime
            placeholder="選擇播放時間"
            disabled={!(dataTime.start || dataTime.end)}
            disabledDate={(current) =>
              !(
                current &&
                current > dayjs(dataTime.start) &&
                current < dayjs(dataTime.end).add(1, "d")
              )
            }
            disabledTime={(current) => {
              const timeArray = (time) =>
                Array.from(new Array(time), (_, index) => index);
              if (current) {
                if (dayjs(current).isSame(dataTime.start, "day")) {
                  const hour = dayjs(dataTime.start).hour();
                  const min = dayjs(dataTime.start).minute();
                  const sec = dayjs(dataTime.start).second();
                  return {
                    disabledHours: () => timeArray(hour),
                    disabledMinutes: () => timeArray(min),
                    disabledSeconds: () => timeArray(sec),
                  };
                } else if (dayjs(current).isSame(dataTime.end, "day")) {
                  const hour = dayjs(dataTime.end).hour();
                  const min = dayjs(dataTime.end).minute();
                  const sec = dayjs(dataTime.end).second();
                  return {
                    disabledHours: () => timeArray(24).splice(hour + 1, 24),
                    disabledMinutes: () => timeArray(60).splice(min + 1, 24),
                    disabledSeconds: () => timeArray(60).splice(sec + 1, 24),
                  };
                }
              }
              return {
                disabledHours: () => [],
                disabledMinutes: () => [],
                disabledSeconds: () => [],
              };
            }}
            onChange={(time) => {
              if (time)
                setDataTime({
                  ...dataTime,
                  reply: time,
                });
              else
                setDataTime({
                  ...dataTime,
                  reply: null,
                });
            }}
          />
        </div>
        <Button
          type="primary"
          disabled={!(dataTime.start && dataTime.end && stockId)}
          onClick={() => {
            setButtonStatus("select");
            latestChartTime.current = null;
          }}
          loading={isResetButtonLoading}
        >
          載入重播
        </Button>
      </div>

      <div className="m-4 flex justify-around  items-end">
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
                setCaseOrder(res.data.content);
              });
            }}
          />
        </div>

        <Button
          type="primary"
          danger
          disabled={!(caseOrder.length && replayStockId)}
          onClick={() => {
            const baseTime = Date.parse(dataTime);
            let accumulatedDelay = 0;
            const transferedCaseOrder = caseOrder.map(
              ({ delay, id, ...order }) => {
                accumulatedDelay += delay || 1;
                const createdTime = new Date(
                  baseTime + accumulatedDelay
                ).toISOString();
                return {
                  ...order,
                  createdTime,
                  investorId: null,
                  stockId: replayStockId,
                };
              }
            );
            setResetdata(transferedCaseOrder);
          }}
        >
          匯入情境
        </Button>
      </div>
      <div>
        下步狀態({restDataIndex} / {restData.length - 1} )
        <Table
          rowKey="id"
          columns={[
            {
              title: "價格類型",
              dataIndex: "priceType",
              render: (data) => <span>{data ? "LIMIT" : "MARKET"}</span>,
              key: Math.random(),
            },
            {
              title: "類型",
              dataIndex: "method",
              render: (data) => <span>{data ? "sell" : "buy"}</span>,
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
              title: "副類型",
              dataIndex: "subMethod",
              render: (data) => (
                <span>
                  {data ? "UPDATE" : data === null ? "NULL" : "CANCEL"}
                </span>
              ),
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
          ]}
          pagination={false}
          dataSource={[restData[restDataIndex + 1]]}
          sticky
        />
      </div>
    </div>
  );
};

export default ReplayChart;
