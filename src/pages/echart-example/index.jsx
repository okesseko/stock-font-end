import React, { useEffect, useRef, useState } from "react";
import Candlestick from "./candlestick";
import BarChart from "./bar";
import BarLineChart from "./bar-line";

const EchartExample = () => {
  const [barData, setBarData] = useState({});
  const barRef = useRef();
  barRef.current=barData
  useEffect(() => {
    function renderData() {
      const random = Math.floor(Math.random() * 20 + 50);
      if (!barRef.current[random]) {
        setBarData((barData) => ({ ...barData, [random]: Math.floor(Math.random() * 20 + 1)}));
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
      {/* <Candlestick /> */}
      <BarChart data={barData} />
      {/* <BarLineChart /> */}
    </div>
  );
};

export default EchartExample;
