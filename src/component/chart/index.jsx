import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import BarChart from "../../pages/echart-example/bar";
import BarStatisticsChart from "../../pages/echart-example/bar-statistics";
import BarLineChart from "../../pages/echart-example/bar-line";
import { Button, Select } from "antd";
import { StockSelector } from "../stock-selector";
import { api, defaultAxios } from "../../environment/api";
import errorNotification from "../../utils/errorNotification";
import ReactECharts from "echarts-for-react";
import dayjs from "dayjs";

const getChartData = (stockId, dateFormat, latestTimeChartTime) => {
  return Promise.all([
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
        dateFormat,
        createdTime:
          latestTimeChartTime &&
          JSON.stringify({
            min: new Date(latestTimeChartTime).toISOString(),
          }),
      },
    }),
  ]);
};

const DisplayTimeChart = ({
  data = { xAxis: [], price: [], quantity: [] },
  onDateFormatChange,
}) => {
  return (
    <div>
      <BarLineChart
        data={data}
        onDateFormatChange={(v) => {
          onDateFormatChange && onDateFormatChange(v);
        }}
      />
    </div>
  );
};

const DisplayTickChart = ({ data = {} }) => {
  const [showType, setShowType] = useState("all");
  return (
    <div>
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
      </div>
      <BarChart originData={data} showType={showType} />
    </div>
  );
};

const DisplaySplitChart = ({ data = [] }) => {
  const option = {
    xAxis: {
      type: "category",
      data: data.map((v) => v.x),
      axisLabel: {
        formatter: (value, index) => {
          const day = dayjs(value).format("HH:mm:ss");
          return day;
        },
      },
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: data.map((v) => v.y),
        type: "line",
      },
    ],
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#283b56",
        },
      },
    },
  };
  return <ReactECharts option={option} />;
};

const DisplayChart = ({
  onStockIdChange,
  stock,
  isResetChart,
  setIsResetChart,
}) => {
  //chart status
  const [isRunning, setIsRunning] = useState(false);
  const [frequency, setFrequency] = useState(1);
  const interval = useRef();

  //query state
  const [stockId, setStockId] = useState();
  const [dateFormat, setDateFormat] = useState(3);
  const [latestTimeChartTime, setLatestTimeChartTime] = useState();

  // chart data
  const [tickChartData, setTickChartData] = useState({});
  const [timeChartData, setTimeChartData] = useState([]);
  const [splitChartData, setSplitChartData] = useState([]);

  const clearInterval = () => {
    if (interval.current) window.clearInterval(interval.current);
    interval.current = undefined;
  };

  function format() {
    switch (dateFormat) {
      case 4:
        return "ms";
      case 3:
        return "second";
      case 0:
        return "minute";
      case 1:
        return "hour";
      case 2:
        return "day";
    }
  }

  const resetChart = () => {
    setTickChartData({});
    setTimeChartData([]);
    setSplitChartData([]);
    setLatestTimeChartTime(undefined);
  };

  useEffect(() => {
    resetChart();
  }, [stock, stockId, dateFormat]);

  useEffect(() => {
    if (isResetChart) {
      resetChart();
      setIsResetChart(false);
    }
  }, [isResetChart, setIsResetChart]);

  const handleInterval = useCallback(() => {
    getChartData(
      (stock && stock.id) || stockId,
      dateFormat,
      latestTimeChartTime
    )
      .then(([{ data: tickChartData }, { data: _timeChartData }]) => {
        // tick chart
        setTickChartData(tickChartData);

        // time chart
        const newTimeChartData = JSON.parse(JSON.stringify(timeChartData));
        if (_timeChartData.length) {
          _timeChartData.forEach(({ originCreatedTime, ...timeChart }) => {
            const LENGTH = newTimeChartData.length;
            const lastNewTimeChartData = newTimeChartData[LENGTH - 1];

            if (
              LENGTH &&
              dayjs(lastNewTimeChartData.xAxis).isSame(
                timeChart.createdTime,
                format()
              )
            ) {
              newTimeChartData[LENGTH - 1] = {
                xAxis: timeChart.createdTime,
                price: timeChart.close,
                quantity: timeChart.quantity + lastNewTimeChartData.quantity,
                buy: timeChart.firstOrderBuy,
                sell: timeChart.firstOrderSell,
              };
            } else {
              newTimeChartData.push({
                xAxis: timeChart.createdTime,
                price: timeChart.close,
                quantity: timeChart.quantity,
                buy: timeChart.firstOrderBuy,
                sell: timeChart.firstOrderSell,
              });
            }
            if (originCreatedTime) {
              setLatestTimeChartTime(new Date(originCreatedTime).getTime() + 1);
            }
          });

          setTimeChartData(newTimeChartData);

          // split chart
          setSplitChartData(
            newTimeChartData.slice(-10).map(({ buy, sell, xAxis }) => {
              return {
                x: xAxis,
                y: sell - buy,
              };
            })
          );
        }
      })
      .catch((err) => {
        errorNotification(err);
      });
  }, [stock, stockId, dateFormat, timeChartData, latestTimeChartTime]);

  useEffect(() => {
    clearInterval();

    if (isRunning) {
      interval.current = setInterval(() => {
        handleInterval();
      }, 1000 * frequency);
    }

    return () => {
      clearInterval();
    };
  }, [handleInterval, isRunning, frequency]);

  return (
    <div>
      {useMemo(() => {
        return <DisplayTickChart data={tickChartData} />;
      }, [tickChartData])}
      {useMemo(() => {
        return (
          <DisplayTimeChart
            data={timeChartData.reduce(
              (p, v) => {
                const { xAxis, price, quantity, buy, sell } = v;
                p.xAxis.push(xAxis);
                p.price.push(price);
                p.quantity.push(quantity);
                p.buy.push(buy);
                p.sell.push(sell);
                return p;
              },
              {
                xAxis: [],
                price: [],
                quantity: [],
                buy: [],
                sell: [],
              }
            )}
            onDateFormatChange={(v) => {
              setDateFormat(v);
            }}
          />
        );
      }, [timeChartData])}

      {useMemo(() => {
        return <DisplaySplitChart data={splitChartData} />;
      }, [splitChartData])}

      <div className="flex justify-around my-6 items-center">
        <div className="w-1/6" style={{ display: stock ? "none" : undefined }}>
          選擇股票
          <StockSelector
            style={{ width: "100%" }}
            onChange={(e) => {
              onStockIdChange && onStockIdChange(e);
              setStockId(e);
            }}
          />
        </div>
        <Button
          type="primary"
          onClick={() => setIsRunning(true)}
          disabled={!stockId && !(stock && stock.id)}
        >
          開始播放
        </Button>
        <Button
          style={{ background: "#91A194", color: "white" }}
          onClick={() => setIsRunning(false)}
          disabled={!isRunning}
        >
          暫停播放
        </Button>
        <Button
          type="primary"
          danger
          onClick={() => {
            resetChart();
          }}
          disabled={!stockId && !(stock && stock.id)}
        >
          重製畫面
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
    </div>
  );
};

export default DisplayChart;
