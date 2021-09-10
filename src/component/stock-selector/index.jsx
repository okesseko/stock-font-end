import { Select } from "antd";
import { useEffect, useState } from "react";
import { api, defaultAxios } from "../../environment/api";
const { Option } = Select;
export const StockSelector = ({ style, mode, onChange }) => {
  const [stocks, setStocks] = useState();
  const [stockList, setStockList] = useState();

  useEffect(() => {
    defaultAxios({
      url: api.getStock.url,
      method: api.getStock.method,
    }).then(({ data: { content: stockList } }) => {
      setStockList(stockList);
    });
  }, []);
  return (
    <Select
      style={{ ...style }}
      onChange={(e) => {
        setStocks(e);
        onChange && onChange(e);
      }}
      mode={mode}
      value={stocks}
      placeholder="選擇股票"
      showSearch
    >
      {stockList &&
        stockList.map((stock) => {
          return (
            <Option key={Math.random()} value={stock.id}>
              {stock.id}
            </Option>
          );
        })}
    </Select>
  );
};
