import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { data } from "../mock-data";

const BarChart = ({ data, splitNumber = 5 }) => {
  const [yAxis, setYAxis] = useState({
    min: 0,
    max: 0,
  });
  useEffect(() => {
    if (data?.series?.length) {
      setYAxis({
        max: Math.ceil(Math.max(...data.series)),
        min: Math.ceil(Math.min(...data.series)),
      });
    }
  }, [data]);
  const options = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
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
        splitNumber: splitNumber,
        axisLabel: {
          formatter: (value) => {
            return Math.abs(value);
          },
        },
      },
    ],
    series: [
      {
        name: "成交量",
        type: "bar",
        data: data.series,
        itemStyle: {
          color: function (p) {
            return p.value < 0 ? "red" : "green";
          },
        },
      },
    ],
  };
  return <ReactECharts option={options} />;
};

export default BarChart;
