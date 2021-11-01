import React, { useState } from "react";
import Settings from "./settings";
import { defaultAxios, api } from "../../environment/api";
import { Button, Typography } from "antd";
import DisplayChart from "../../component/chart";
import errorNotification from "../../utils/errorNotification";

const { Title } = Typography;

const AutoChart = () => {
  const [stockId, setStockId] = useState();
  const [buttonStatus, setButtonStatus] = useState("stop");

  function resetStock() {
    defaultAxios({
      url: api.resetStock.url,
      method: api.resetStock.method,
      data: {
        id: stockId,
        isReset: true,
      },
    }).catch((err) => {
      errorNotification(err.response.data);
    });

    setButtonStatus("stop");
  }

  return (
    <div>
      <DisplayChart
        onStockIdChange={(e) => {
          setStockId(e);
        }}
      />
      <div className="flex justify-around my-6 items-center">
        <Button
          type="primary"
          onClick={() => setButtonStatus("start")}
          disabled={!stockId}
        >
          開始模擬
        </Button>
        <Button
          style={{ background: "#91A194", color: "white" }}
          onClick={() => setButtonStatus("stop")}
          disabled={!stockId}
        >
          暫停模擬
        </Button>
        <Button
          type="primary"
          danger
          onClick={() => {
            resetStock();
          }}
          disabled={!stockId}
        >
          重製模擬
        </Button>
      </div>
      <Title className="m-4 mb-0" level={5}>
        使用情境
      </Title>
      <Settings buttonStatus={buttonStatus} />
    </div>
  );
};

export default AutoChart;
