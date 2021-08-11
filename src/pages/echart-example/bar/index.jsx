import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { data } from "../mock-data";

const BarChart = ({ data, splitNumber = 5 }) => {
  const [yAxisMax, setYAxisMax] = useState(10);
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
        name: "委託量",
        type: "bar",
        data: data.buySeries,
        itemStyle: { color: "red" },
      },
      {
        name: "委託量",
        type: "bar",
        data: data.sellSeries,
        itemStyle: { color: "green" },
      },
    ],
  };
  return <ReactECharts option={options} />;
};

export default BarChart;
