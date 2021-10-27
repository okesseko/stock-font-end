import { Button, DatePicker, Table, Slider } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { StockSelector } from "../../component/stock-selector";
import { api, defaultAxios } from "../../environment/api";
import dayjs from "dayjs";

const getRealDataOrderContent = async (params) => {
  const { url, method } = api.getRealDataOrderContent;
  return defaultAxios({
    url,
    method,
    params,
  });
};

const resetStock = (stockId) => {
  return defaultAxios({
    url: api.resetStock.url,
    method: api.resetStock.method,
    data: {
      id: stockId,
      isReset: true,
      isAutoDisplay: false,
    },
  });
};

const sendOrder = ({ id, realDataOrderId, ...order }) => {
  const { url, method } = api.postOrder;
  return defaultAxios({
    url,
    method,
    data: {
      ...order,
      investorId: null,
    },
  });
};

export const OrderSender = ({ orders, stockId }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRunning, setIsRunnung] = useState(false);
  const [speed, setSpeed] = useState(1);
  const timeOut = useRef();
  const speedRef = useRef(1);

  useEffect(() => {
    setCurrentIndex(0);
  }, [orders]);

  const handleTimeOut = useCallback(() => {
    const currentOrder = orders[currentIndex];
    const nextOrder = orders[currentIndex + 1];
    sendOrder(currentOrder);
    if (nextOrder) {
      const delay =
        Date.parse(nextOrder.createdTime) -
        Date.parse(currentOrder.createdTime);
      timeOut.current = setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, delay / speedRef.current);
    }
  }, [currentIndex, orders]);

  useEffect(() => {
    speedRef.current = speed;
    if (isRunning) {
      handleTimeOut();
    } else if (timeOut.current) {
      clearTimeout(timeOut.current);
      timeOut.current = undefined;
    }
  }, [isRunning, handleTimeOut, speed]);

  return (
    <div>
      <div className="flex justify-around my-6 items-center">
        <Button
          type="primary"
          onClick={() => {
            setIsRunnung(true);
          }}
          disabled={!stockId || !orders.length}
        >
          開始模擬
        </Button>
        <Button
          style={{ background: "#91A194", color: "white" }}
          onClick={() => {
            setIsRunnung(false);
          }}
          disabled={!stockId || !isRunning}
        >
          暫停模擬
        </Button>
        <Button
          type="primary"
          danger
          onClick={() => {
            resetStock(stockId);
          }}
          disabled={!stockId || !orders.length}
        >
          重製模擬
        </Button>
        <div style={{ width: "200px" }}>
          播放速度 {speed} 倍
          <Slider
            value={speed}
            max={20}
            disabled={!stockId || !orders.length}
            onChange={(e) => {
              setSpeed(e);
            }}
          />
        </div>
      </div>
      <div style={{ width: "100%" }}>
        狀態({currentIndex} / {orders.length} )
        <Slider
          value={currentIndex}
          max={orders.length - 1}
          disabled={!stockId || !orders.length}
          onChange={(e) => {
            setCurrentIndex(e);
            setIsRunnung(false);
          }}
        />
        <Table
          rowKey="id"
          columns={[
            {
              title: "價格類型",
              dataIndex: "priceType",
              render: (data) => <span>{data ? "LIMIT" : "MARKET"}</span>,
              key: Math.random(),
            },
            {
              title: "類型",
              dataIndex: "method",
              render: (data) => <span>{data ? "sell" : "buy"}</span>,
              key: Math.random(),
            },
            {
              title: "價格",
              dataIndex: "price",
              key: Math.random(),
            },
            {
              title: "數量",
              dataIndex: "quantity",
              key: Math.random(),
            },

            {
              title: "副類型",
              dataIndex: "subMethod",
              render: (data) => (
                <span>
                  {data ? "UPDATE" : data === null ? "NULL" : "CANCEL"}
                </span>
              ),
              key: Math.random(),
            },
            {
              title: "時間限制",
              dataIndex: "timeRestriction",
              render: (data) => (
                <span>{data ? "IOC" : data === 2 ? "FOK" : "ROD"}</span>
              ),
              key: Math.random(),
            },
            {
              title: "時間",
              dataIndex: "createdTime",
              render: (data) => (
                <span>{dayjs(data).format("YYYY/MM/DD HH:mm:ss")}</span>
              ),
            },
          ]}
          pagination={false}
          dataSource={
            orders.length && [{ ...orders[currentIndex], key: Math.random() }]
          }
          sticky
        />
      </div>
    </div>
  );
};

const Simulator = () => {
  // Functional state
  const [orders, setOrders] = useState([]);

  //Query state
  const [stockId, setStockId] = useState();
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();

  return (
    <div>
      <div className="flex justify-around my-6 items-center">
        <div className="w-1/6">
          選擇股票
          <StockSelector
            style={{ width: "100%" }}
            onChange={(e) => {
              setStockId(e);
            }}
          />
        </div>
        <div className="w-1/6">
          開始時間
          <DatePicker
            allowClear
            style={{ width: "100%" }}
            showTime
            placeholder="選擇開始時間"
            disabledDate={(current) => current && current > dayjs()}
            onChange={(time) => {
              if (time) setStartTime(dayjs(time).toISOString());
              else setStartTime(time);
            }}
          />
        </div>
        <div className="w-1/6">
          結束時間
          <DatePicker
            allowClear
            style={{ width: "100%" }}
            showTime
            placeholder="選擇結束時間"
            disabledDate={(current) => current && current > dayjs()}
            onChange={(time) => {
              if (time) setEndTime(dayjs(time).toISOString());
              else setEndTime(time);
            }}
          />
        </div>
        <Button
          type="primary"
          danger
          onClick={async () => {
            if (stockId) {
              await resetStock(stockId);
              getRealDataOrderContent({
                stockId,
                createdTime: { min: startTime, max: endTime },
              }).then(({ data }) => {
                setOrders(data.content);
              });
            }
          }}
          disabled={!stockId}
        >
          載入委託
        </Button>
      </div>

      <OrderSender orders={orders} stockId={stockId} />
    </div>
  );
};

export default Simulator;
