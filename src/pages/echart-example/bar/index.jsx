import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { data } from "../mock-data";

const BarChart = ({ originData = {}, showType }) => {
  const [yAxisMax, setYAxisMax] = useState(10);
  const [data, setData] = useState({});
  const [center, setCenter] = useState(0);
  function showValue() {
    let xAxis = [],
      series = [],
      centerBuffer = 0,
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
          series.push(
            obj.sellQuantity
              ? obj.sellQuantity
              : obj.buyQuantity
              ? -obj.buyQuantity
              : 0
          );
        });
        break;
      }
      case "allfive": {
        fiveTickRange.forEach((obj, index) => {
          xAxis.push(obj.price);
          series.push(
            obj.sellQuantity
              ? obj.sellQuantity
              : obj.buyQuantity
              ? -obj.buyQuantity
              : 0
          );
          if (index === 4) {
            console.log("dec");
            let b1 = fiveTickRange[index].price,
              a1 = fiveTickRange[index + 1].price;
            while (a1 - b1 > 0.5) {
              console.log("decyes", b1, a1);
              b1 += 0.5;
              centerBuffer++;
              xAxis.push(b1);
              series.push("0");
            }
          }
        });
        break;
      }
      case "buyfive": {
        fiveTickRange.forEach((obj) => {
          if (obj.buyQuantity !== undefined) {
            xAxis.push(obj.price);
            series.push(-obj.buyQuantity);
          }
        });
        break;
      }
      case "sellfive": {
        fiveTickRange.forEach((obj) => {
          if (obj.sellQuantity !== undefined) {
            xAxis.push(obj.price);
            series.push(obj.sellQuantity);
          }
        });
        break;
      }
      default:
        break;
    }
    setCenter(centerBuffer);
    return { xAxis, series };
  }

  useEffect(() => {
    setData(showValue());
  }, [originData, showType]);

  useEffect(() => {
    if (data?.series?.length) {
      let max = 10;
      data.series.forEach((deta) => {
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
        if (typeof param[0].data === "string") return "";
        return (
          "Price: " +
          param[0].name +
          "<br/>" +
          param[0].seriesName +
          " : " +
          Math.abs(param[0].data)
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
        name: "委託量",
        type: "bar",
        data: data.series,
        itemStyle: {
          color: (param) => {
            return param.data > 0 ? "green" : "red";
          },
        },
        markPoint: {
          symbol: "rect",
          symbolSize: 40,
          itemStyle: {
            color: "rgba(0,0,0,0.2)",
          },
          data: new Array(center).fill(0).map((e, index) => {
            console.log(index,e,'dec')
            return { xAxis: index + 5, yAxis: 0, symbolSize:[50,300] };
          }),
        },
      },
      // {
      //   name: "委託量(buy)",
      //   type: "bar",
      //   data: data.buySeries,
      //   itemStyle: { color: "red" },
      // },
    ],
  };
  return <ReactECharts option={options} />;
};

export default BarChart;
