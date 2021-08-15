import React from "react";
import ReactECharts from "echarts-for-react";
import { data } from "../mock-data";

const BarLineChart = ({ data = { xAxis: [], price: [], quantity: [] } }) => {
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
        data: data.xAxis,
      },
    ],
    yAxis: [
      {
        type: "value",
        scale: true,
        name: "成交價",
      },
      {
        type: "value",
        scale: true,
        name: "成交量",
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
        name: "成交價",
        type: "line",
        step: "end",
        data: data.price,
      },
      {
        name: "最佳買價",
        type: "line",
        step: "end",
        data: data.buy,
      },
      {
        name: "最佳賣價",
        type: "line",
        step: "end",
        data: data.sell,
      },
      {
        name: "成交量",
        type: "bar",
        yAxisIndex: 1,
        data: data.quantity,
      },
    ],
  };

  return <ReactECharts option={options} />;
};

export default BarLineChart;
