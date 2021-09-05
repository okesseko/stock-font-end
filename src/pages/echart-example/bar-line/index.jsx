import React, { useState } from "react";
import ReactECharts from "echarts-for-react";
import { data } from "../mock-data";
import { Select } from "antd";

const BarLineChart = ({ data = { xAxis: [], price: [], quantity: [] } }) => {
  console.log(data.xAxis.length, "len");
  const [dataZoom, setDataZoom] = useState(10);
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
        startValue: dataZoom ? data.xAxis.length - dataZoom : 0,
        endValue: data.xAxis.length - 1,
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
          color: "red",
        },
      },
      {
        name: "最佳賣價",
        type: "line",
        step: "end",
        data: data.sell,
        itemStyle: {
          color: "green",
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

  return (
    <>
      <div className="flex flex-col justify-end p-4">
        分時走勢圖顯示筆數
        <Select
        className="w-40"
          value={dataZoom}
          options={[
            { label: "顯示10筆", value: 10 },
            { label: "顯示50筆", value: 50 },
            { label: "顯示100筆", value: 100 },
            { label: "顯示全部筆", value: 0 },
          ]}
          onChange={(val) => setDataZoom(val)}
        />
      </div>
      <ReactECharts option={options} />
    </>
  );
};

export default BarLineChart;
