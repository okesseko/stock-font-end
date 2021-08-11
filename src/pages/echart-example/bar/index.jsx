import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { data } from "../mock-data";

const BarChart = ({ originData = {}, showType }) => {
  const [yAxisMax, setYAxisMax] = useState(10);
  const [data, setData] = useState({});
  function showValue() {
    let xAxis = [],
      buySeries = [],
      sellSeries = [],
      tickRange = (originData.tickRange || []).sort(
        (a, b) => a.price - b.price
      ),
      fiveTickRange = (originData.fiveTickRange || []).sort(
        (a, b) => a.price - b.price
      );
    switch (showType) {
      case "all": {
        tickRange.forEach((obj) => {
          xAxis.push(obj.price);
          sellSeries.push(obj.sellQuantity || 0);
          buySeries.push(obj.buyQuantity ? -obj.buyQuantity : 0);
        });
        break;
      }
      case "allfive": {
        fiveTickRange.forEach((obj) => {
          xAxis.push(obj.price);
          sellSeries.push(obj.sellQuantity || 0);
          buySeries.push(obj.buyQuantity ? -obj.buyQuantity : 0);
        });
        break;
      }
      case "buyfive": {
        fiveTickRange.forEach((obj) => {
          if (obj.buyQuantity !== undefined) {
            xAxis.push(obj.price);
            buySeries.push(-obj.buyQuantity);
          }
        });
        break;
      }
      case "sellfive": {
        fiveTickRange.forEach((obj) => {
          if (obj.sellQuantity !== undefined) {
            xAxis.push(obj.price);
            sellSeries.push(obj.sellQuantity);
          }
        });
        break;
      }
      default:
        break;
    }
    return { xAxis, buySeries, sellSeries };
  }

  useEffect(() => {
    setData(showValue());
  }, [originData, showType]);

  useEffect(() => {
    if (data?.buySeries?.length) {
      let max = 10;
      data.buySeries.forEach((deta) => {
        if (Math.abs(deta) > max) max = Math.abs(deta);
      });
      data.sellSeries.forEach((deta) => {
        if (Math.abs(deta) > max) max = Math.abs(deta);
      });
      setYAxisMax(max);
    }
  }, [data]);
  const options = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: (param) => {
        console.log(param);
        return (
          "Price: " +
          param[0].name +
          "<br/>" +
          param[0].marker +
          "  " +
          param[0].seriesName +
          " : " +
          param[0].data +
          "<br/>" +
          param[1].marker +
          "  " +
          param[1].seriesName +
          " : " +
          -param[1].data
        );
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        data: data.xAxis,
      },
    ],
    yAxis: [
      {
        type: "value",
        splitNumber: 10,
        max: yAxisMax,
        min: -yAxisMax,
        axisLabel: {
          formatter: (value) => {
            return Math.abs(value);
          },
        },
      },
    ],
    series: [
      {
        name: "委託量(sell)",
        type: "bar",
        data: data.sellSeries,
        itemStyle: { color: "green" },
      },
      {
        name: "委託量(buy)",
        type: "bar",
        data: data.buySeries,
        itemStyle: { color: "red" },
      },
    ],
  };
  return <ReactECharts option={options} />;
};

export default BarChart;
