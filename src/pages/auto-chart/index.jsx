import React, { useEffect, useRef, useState } from "react";
import Settings from "./settings";
import BarChart from "../echart-example/bar";
import { defaultAxios, api } from "../../environment/api";
import { obj } from "duplexify";

const AutoChart = () => {
  const [barData, setBarData] = useState({});
  const barRef = useRef();
  barRef.current = barData;
  useEffect(() => {
    function renderData() {
      defaultAxios({
        url: api.getDisplay.url,
        method: api.getDisplay.method,
        params: {
          isGetLatest: true,
        },
      }).then((res) => {
        const data = res.data;
        console.log("chart data", data);

        let xAxis = [],
          series = [];
        data.tickRange.reverse().map(function (obj) {
          if (obj.price < data.matchPrice) {
            xAxis.push(obj.price);
            series.push(-obj.buyQuantity);
          } else if (obj.price > data.matchPrice) {
            xAxis.push(obj.price);
            series.push(obj.sellQuantity);
          }
        });

        console.log({ xAxis, series });
        // const ordered = Object.keys(chartData)
        //   .sort()
        //   .reduce((obj, key) => {
        //     obj[key] = chartData[key];
        //     return obj;
        //   }, {});
        //   console.log(ordered,'qweqwe')

        setBarData(() => ({ xAxis, series }));
      });
    }
    renderData();
    const barLoop = setInterval(() => {
      renderData();
    }, 1000);
    return () => {
      clearInterval(barLoop);
    };
  }, []);

  return (
    <div>
      <BarChart data={barData} />
      <Settings />
    </div>
  );
};

export default AutoChart;
