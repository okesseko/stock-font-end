import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { data } from "../mock-data";

const BarChart = ({ data }) => {
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
        max: yAxis.max, // 可根据传入数据，动态获取最大值，且向上取整
        min: yAxis.min,
        interval: Math.round((yAxis.max - yAxis.min) / 500) * 100, // 可根据传入数据，动态获取间隔(此处除以5默认设置y轴数值间隔5段)
        axisLabel: {
          formatter: (value) => {
            return value ? value : -value;
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
