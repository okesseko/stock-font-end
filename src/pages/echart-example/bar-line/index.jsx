import React, { useState } from "react";
import ReactECharts from "echarts-for-react";
import { data } from "../mock-data";

const BarLineChart = ({ data = { xAxis: [], price: [], quantity: [] } }) => {
  const [dataZoom, setDataZoom] = useState({ start: 0, end: 100 });
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
    legend: {
      data: ["成交價", "最佳買價", "最佳賣價", "成交量"],
    },
    // backgroundColor: "black",
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
        // ...dataZoom,
        onChange: (val) => {
          console.log(val);
        },
      },
    ],
    series: [
      {
        name: "成交價",
        type: "line",
        step: "end",
        data: data.price,
        itemStyle: {
          color: "black",
        },
      },
      {
        name: "最佳買價",
        type: "line",
        step: "end",
        data: data.buy,
        itemStyle: {
          color: "green",
        },
      },
      {
        name: "最佳賣價",
        type: "line",
        step: "end",
        data: data.sell,
        itemStyle: {
          color: "red",
        },
      },
      {
        name: "成交量",
        type: "bar",
        yAxisIndex: 1,
        data: data.quantity,
        itemStyle: {
          color: "yellow",
        },
      },
    ],
  };

  return <ReactECharts option={options} />;
};

export default BarLineChart;
