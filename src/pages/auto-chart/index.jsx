import React, { useEffect, useRef, useState } from "react";
import Settings from "./settings";
import BarChart from "../echart-example/bar"
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
      }).then((res) => {
        const data = res.data;
        console.log('chart data', data);

        let chartData = {};
        data.tickRange.reverse().map(function(obj) {
          if (obj.price < data.matchPrice) {
            chartData[obj.price] = -obj.buyQuantity;
          } else if (obj.price > data.matchPrice) {
            chartData[obj.price] = obj.sellQuantity;
          }
          console.log(obj.price);
        })

        const ordered = Object.keys(chartData).sort().reduce(
          (obj, key) => { 
            obj[key] = chartData[key]; 
            return obj;
          }, 
          {}
        );

        console.log('chart data 2 ', chartData, ordered);

        setBarData(() => (
          ordered
        ));
      });
    }
    const barLoop = setInterval(() => {
      renderData();
    }, 200);
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
