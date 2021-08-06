import React from "react";
import Candlestick from "./candlestick";
import BarChart from "./bar"
import BarLineChart from "./bar-line"
import Settings from "./settings"

const EchartExample = () => {
  return (
    <div>
      <Candlestick />
      <BarChart/>
      <BarLineChart/>
      <Settings />
    </div>
  );
};

export default EchartExample;
