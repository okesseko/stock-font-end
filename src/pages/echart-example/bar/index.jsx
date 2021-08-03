import React from "react";
import ReactECharts from "echarts-for-react";
import { data } from "../mock-data";

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
      data: [100, 105, 106, 107, 108, 120, 130],
    },
  ],
  yAxis: [
    {
      type: "value",
    },
  ],
  series: [
    {
      name: "成交量",
      type: "bar",
      data: [10, 52, -520, 334, 390, 330, 220],
      itemStyle: {
        color: function (p) {
          return p.value < 0 ? "red" : "green";
        },
      },
    },
  ],
};
const BarChart = () => {
  return <ReactECharts option={options} />;
};

export default BarChart;
