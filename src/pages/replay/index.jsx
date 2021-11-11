import React, { useState } from "react";
import { defaultAxios, api } from "../../environment/api";
import DisplayChart from "../../component/chart";
import Simulator from "../simulator";

const ReplayChart = () => {
  const [replayStockId, setReplayStockId] = useState();

  return (
    <div>
      <DisplayChart stock={replayStockId ? { id: replayStockId } : {}} />
      {/*       <div className="m-4 flex justify-around  items-end">
        <div className="w-1/6">
          選擇股票
          <StockSelector
            style={{ width: "100%" }}
            onChange={(e) => {
              setStockId(e);
            }}
          />
        </div>
        <div className="w-2/6">
          選擇重播資料時間區間
          <RangePicker
            showTime
            placeholder={["開始時間", "結束時間"]}
            disabledDate={(current) => current && current > dayjs()}
            onChange={(time) => {
              if (time) {
                setDataTime({
                  ...dataTime,
                  start: time[0],
                  end: time[1],
                });
              } else {
                setDataTime({
                  ...dataTime,
                  start: null,
                  end: null,
                });
              }
            }}
          />
        </div>
        <Button
          type="primary"
          disabled={!(dataTime.start && dataTime.end && stockId)}
          onClick={() => {
            setIsResetButtonLoading(true);
            defaultAxios({
              url: api.resetStock.url,
              method: api.resetStock.method,
              data: {
                id: stockId,
                startTime: dayjs(dataTime.start).toISOString(),
                endTime: dayjs(dataTime.end).toISOString(),
                replayTime: dataTime.reply
                  ? dayjs(dataTime.reply).toISOString()
                  : undefined,
                isReset: false,
              },
            })
              .then((res) => {
                setRestData(res.data.orders);
                setReplayStockId(res.data.display.stockId);
                setIsResetButtonLoading(false);
              })
              .catch((err) => {
                errorNotification(err?.response?.data);
              });
            latestChartTime.current = null;
          }}
          loading={isResetButtonLoading}
        >
          載入重播
        </Button>
      </div> */}
      <Simulator
        customResetStock={async (stockId) => {
          const { url, method } = api.resetStock;
          return await defaultAxios({
            url,
            method,
            data: { id: stockId, isReset: false },
          }).then(({ data }) => {
            setReplayStockId(data.display.stockId);
            return data.display.stockId;
          });
        }}
      />
    </div>
  );
};

export default ReplayChart;
