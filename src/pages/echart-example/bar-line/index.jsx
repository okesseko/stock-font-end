import React from "react";
import ReactECharts from "echarts-for-react";
import { data } from "../mock-data";

const options = {
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross",
      label: {
        backgroundColor: "#283b56",
      },
    },
  },
  grid: {
    left: "3%",
    right: "4%",
    containLabel: true,
  },
  // toolbox: {
  //   show: true,
  //   feature: {
  //     dataView: { readOnly: false },
  //     restore: {},
  //     saveAsImage: {},
  //   },
  // },
  xAxis: [
    {
      type: "category",
      boundaryGap: true,
      data: (function () {
        var now = new Date();
        var res = [];
        var len = 7;
        while (len--) {
          res.unshift(now.toLocaleTimeString().replace(/^\D*/, ""));
          now = new Date(now - 2000);
        }
        return res;
      })(),
    },
  ],
  yAxis: [
    {
      type: "value",
      scale: true,
      name: "价格",
    },
    {
      type: "value",
      scale: true,
      name: "预购量",
    },
  ],
  dataZoom: [
    {
      show: true,
      realtime: true,
      start: 0,
      end: 100,
    },
  ],
  series: [
    {
      name: "成交量",
      type: "bar",
      yAxisIndex: 1,
      data: [10, 20, 15, 30, 50, 35, 20],
    },
    {
      name: "最新成交价",
      type: "line",
      step: "end",
      data: [100, 50, 120, 87, 150, 32, 10],
    },
  ],
};
const BarLineChart = () => {
  return <ReactECharts option={options} />;
};

export default BarLineChart;
