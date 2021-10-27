import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";

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
            if (
              originData?.fiveTickRange &&
              originData?.fiveTickRange.findIndex(
                (tick) => tick.price === data.xAxis[param.dataIndex]
              ) !== -1
            ) {
              return param.data > 0 ? "green" : "red";
            } else {
              return param.data > 0 ? "DarkSeaGreen" : "LightCoral";
            }
          },
        },
        markPoint: {
          symbol:
            "path://M479.046,283.925c-1.664-3.989-5.547-6.592-9.856-6.592H352.305V10.667C352.305,4.779,347.526,0,341.638,0H170.971 c-5.888,0-10.667,4.779-10.667,10.667v266.667H42.971c-4.309,0-8.192,2.603-9.856,6.571c-1.643,3.989-0.747,8.576,2.304,11.627 l212.8,213.504c2.005,2.005,4.715,3.136,7.552,3.136s5.547-1.131,7.552-3.115l213.419-213.504 C479.793,292.501,480.71,287.915,479.046,283.925z",
          symbolSize: 30,
          itemStyle: {
            color: "black",
          },
          data: [
            {
              coord: [`${originData.matchPrice}`, 0],
              value: originData.matchPrice,
              y: 50,
              name: "qwe",
            },
            // ...new Array(center).fill(0).map((e, index) => {
            //   return { xAxis: index + 5, yAxis: 0, symbolSize: [50, 300] };
            // }),
          ],
        },
        // markPoint:
        //   {
        //     symbol: "rect",
        //     symbolSize: 40,
        //     itemStyle: {
        //       color: "rgba(0,0,0,0.2)",
        //     },
        // data: new Array(center).fill(0).map((e, index) => {
        //   return { xAxis: index + 5, yAxis: 0, symbolSize: [50, 300] };
        // }),
        //       .push({
        //         type:'average',
        //         name:'qweqwe'
        //         // xAxis: 5,
        //         // yAxis: 0,
        //         // symbolSize: [50, 300],
        //       }),
        //   },
      },
    ],
  };
  return <ReactECharts option={options} />;
};

export default BarChart;
