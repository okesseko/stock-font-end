import React from "react";
import Candlestick from "./candlestick";
import BarChart from "./bar"
import BarLineChart from "./bar-line"

const EchartExample = () => {
  return (
    <div >
      <Candlestick />
      <BarChart/>
      <BarLineChart/>
    </div>
  );
};

export default EchartExample;
