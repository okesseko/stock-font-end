import React, { useEffect, useRef, useState } from "react";
import Settings from "./settings";
import BarChart from "../echart-example/bar"
const AutoChart = () => {
  const [barData, setBarData] = useState({});
  const barRef = useRef();
  barRef.current = barData;
  useEffect(() => {
    function renderData() {
      const random = Math.floor(Math.random() * 20 + 50);
      if (!barRef.current[random]) {
        setBarData((barData) => ({
          ...barData,
          [random]: Math.floor(Math.random() * 20 + 1),
        }));
      } else {
        setBarData((barData) => ({
          ...barData,
          [random]: barData[random] + 1,
        }));
      }
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
