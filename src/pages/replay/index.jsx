import React, { useEffect, useMemo, useRef, useState } from "react";
import BarChart from "../echart-example/bar";
import { defaultAxios, api } from "../../environment/api";
import { Button, Select, DatePicker, Table } from "antd";
import BarLineChart from "../echart-example/bar-line";
import dayjs from "dayjs";
import { StockSelector } from "../../component/stock-selector";
import DisplayChart from "../../component/chart";
import { OrderSender } from "../simulator";

const { RangePicker } = DatePicker;

const ReplayChart = () => {
  const [stockId, setStockId] = useState();
  const [replayStockId, setReplayStockId] = useState();
  const [restData, setRestData] = useState([]);
  const [dataTime, setDataTime] = useState({
    start: null,
    end: null,
    reply: null,
  });

  const selectCaseId = useRef();
  const [caseData, setCaseData] = useState([]);
  const [caseOrder, setCaseOrder] = useState([]);
  const [isResetButtonLoading, setIsResetButtonLoading] = useState(false);
  const latestChartTime = useRef(null);

  useEffect(() => {
    defaultAxios({
      url: api.getVirtualOrderContainer.url,
      method: api.getVirtualOrderContainer.method,
      params: {
        stockId,
      },
    }).then((res) => {
      setCaseData(
        res.data.content.map((content) => ({
          label: content.name,
          value: content.id,
        }))
      );
    });
  }, [stockId]);

  return (
    <div>
      <DisplayChart
        onStockIdChange={(e) => {
          setStockId(e);
        }}
        stock={replayStockId ? { id: replayStockId } : {}}
      />
      <div className="m-4 flex justify-around  items-end">
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
        {/* <div className="w-1/6">
          選擇開始撥放時間
          <DatePicker
            style={{ width: "100%" }}
            showTime
            placeholder="選擇播放時間"
            disabled={!(dataTime.start || dataTime.end)}
            disabledDate={(current) =>
              !(
                current &&
                current > dayjs(dataTime.start) &&
                current < dayjs(dataTime.end).add(1, "d")
              )
            }
            disabledTime={(current) => {
              const timeArray = (time) =>
                Array.from(new Array(time), (_, index) => index);
              if (current) {
                if (dayjs(current).isSame(dataTime.start, "day")) {
                  const hour = dayjs(dataTime.start).hour();
                  const min = dayjs(dataTime.start).minute();
                  const sec = dayjs(dataTime.start).second();
                  return {
                    disabledHours: () => timeArray(hour),
                    disabledMinutes: () => timeArray(min),
                    disabledSeconds: () => timeArray(sec),
                  };
                } else if (dayjs(current).isSame(dataTime.end, "day")) {
                  const hour = dayjs(dataTime.end).hour();
                  const min = dayjs(dataTime.end).minute();
                  const sec = dayjs(dataTime.end).second();
                  return {
                    disabledHours: () => timeArray(24).splice(hour + 1, 24),
                    disabledMinutes: () => timeArray(60).splice(min + 1, 24),
                    disabledSeconds: () => timeArray(60).splice(sec + 1, 24),
                  };
                }
              }
              return {
                disabledHours: () => [],
                disabledMinutes: () => [],
                disabledSeconds: () => [],
              };
            }}
            onChange={(time) => {
              if (time)
                setDataTime({
                  ...dataTime,
                  reply: time,
                });
              else
                setDataTime({
                  ...dataTime,
                  reply: null,
                });
            }}
          />
        </div> */}
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
            }).then((res) => {
              setRestData(res.data.orders);
              setReplayStockId(res.data.display.stockId);
              setIsResetButtonLoading(false);
            });
            latestChartTime.current = null;
          }}
          loading={isResetButtonLoading}
        >
          載入重播
        </Button>
      </div>

      <div className="m-4 flex justify-around  items-end">
        <div className="w-1/6">
          選擇情境
          <Select
            className="w-full"
            options={caseData}
            onChange={(caseId) => {
              selectCaseId.current = caseId;
              defaultAxios({
                url: api.getVirtualOrder.url,
                method: api.getVirtualOrder.method,
                params: {
                  virtualOrderContainerId: caseId,
                },
              }).then((res) => {
                setCaseOrder(res.data.content);
              });
            }}
          />
        </div>

        <Button
          type="primary"
          danger
          disabled={!(caseOrder.length && replayStockId)}
          onClick={() => {
            const baseTime = Date.parse(dataTime.start);
            let accumulatedDelay = 0;
            const transferedCaseOrder = caseOrder.map(
              ({ delay, id, ...order }) => {
                accumulatedDelay += delay || 1;
                const createdTime = new Date(
                  baseTime + accumulatedDelay
                ).toISOString();
                return {
                  ...order,
                  createdTime,
                  investorId: null,
                  stockId: replayStockId,
                };
              }
            );
            setRestData(transferedCaseOrder);
          }}
        >
          匯入情境
        </Button>
      </div>
      <OrderSender orders={restData} stockId={stockId} />
    </div>
  );
};

export default ReplayChart;
