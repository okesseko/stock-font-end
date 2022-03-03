import { Button, DatePicker, Table, Slider, Tabs, Select } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { StockSelector } from "../../component/stock-selector";
import { api, defaultAxios } from "../../environment/api";
import errorNotification from "../../utils/errorNotification";
import moment from "moment";
import dayjs from "dayjs";

const { TabPane } = Tabs;

const getRealDataOrderContent = async (params) => {
  const { url, method } = api.getRealDataStockOrderContent;
  params.isSimulatedOrder = true;
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

const getOrder = (stockId, startTime, endTime) => {
  const { url, method } = api.getOrder;
  return defaultAxios({
    url,
    method,
    params: {
      stockId,
      createdTime: {
        min: startTime,
        max: endTime,
      },
      order: {
        orderBy: "createdTime",
        order: "ASC",
      },
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

const debugOrders = (orders, type) => {
  if (false) {
    console.log(type, orders);
  }
};

export const OrderSender = ({ orders, stockId, onReset }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRunning, setIsRunnung] = useState(false);
  const [speed, setSpeed] = useState(1);
  const timeOut = useRef();
  const speedRef = useRef(1);
  const sliderDelay = useRef();

  useEffect(() => {
    if (timeOut.current) {
      clearTimeout(timeOut.current);
      timeOut.current = undefined;
    }
    setCurrentIndex(0);
    setIsRunnung(false);

    return () => {
      if (sliderDelay.current) clearTimeout(sliderDelay.current);
      if (timeOut.current) clearTimeout(timeOut.current);
    };
  }, [orders]);

  const handleTimeOut = useCallback(() => {
    const currentOrder = orders[currentIndex];
    const nextOrder = orders[currentIndex + 1];
    sendOrder(currentOrder).catch((err) => {
      errorNotification(err);
    });
    if (nextOrder) {
      const delay =
        Date.parse(nextOrder.createdTime) -
        Date.parse(currentOrder.createdTime);
      timeOut.current = setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, Math.max(delay / speedRef.current, 50));
    }
  }, [currentIndex, orders]);

  useEffect(() => {
    if (isRunning) {
      handleTimeOut();
    } else if (timeOut.current) {
      clearTimeout(timeOut.current);
      timeOut.current = undefined;
    }
  }, [isRunning, handleTimeOut]);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

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
        <div style={{ width: "200px" }}>
          播放速度 {speed} 倍
          <Slider
            value={speed}
            max={10}
            disabled={!stockId || !orders.length}
            onChange={(e) => {
              setSpeed(e);
            }}
          />
        </div>
      </div>
      <div style={{ width: "100%" }}>
        狀態({orders.length ? currentIndex + 1 : 0} / {orders.length} )
        <Slider
          value={currentIndex}
          max={orders.length - 1}
          disabled={!stockId || !orders.length}
          onChange={(e) => {
            setCurrentIndex(e);
            setIsRunnung(false);
            if (sliderDelay.current) clearTimeout(sliderDelay.current);
            sliderDelay.current = setTimeout(() => {
              onReset && onReset();
              const order = orders[currentIndex];
              resetStock(
                order.stockId === stockId ? stockId : order.stockId
              ).catch((err) => {
                errorNotification(err);
              });
            }, 1000);
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

const getRealDataAvailableAPI = (marketType) => {
  switch (marketType) {
    case "stock":
      return api.getAvailableStock;
    default:
      return api.getAvailableFutures;
  }
};

const RealDataSimulator = ({ customResetStock, onReset }) => {
  // Functional state
  const [orders, setOrders] = useState([]);
  const [marketType, setMarketType] = useState("stock");
  const [isLoading, setIsLoading] = useState(false);
  const [availableDate, setAvailableDate] = useState([]);

  //Query state
  const [stockId, setStockId] = useState();
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  debugOrders(orders, "real");

  useEffect(() => {
    if (stockId) {
      setIsLoading(true);
      const { url, method } = getRealDataAvailableAPI(marketType);
      return defaultAxios({
        url: url + `/${stockId}`,
        method,
        params: {
          type: "order",
        },
      })
        .then(({ data }) => {
          setAvailableDate(data);
          setIsLoading(false);
        })
        .catch((err) => {
          errorNotification(err);
          setIsLoading(false);
        });
    }
  }, [stockId]);

  return (
    <div>
      <div className="flex justify-around my-6 items-center">
        {/* <div className="w-1/6">
          選擇資料類型
          <Select
            className="w-20 ml-2"
            value={marketType}
            options={[
              { value: "stock", label: "證交" },
              { value: "futures", label: "期交" },
            ]}
            onChange={(val) => {
              setMarketType(val);
            }}
          />
        </div> */}
        <div className="w-1/6">
          選擇商品
          <StockSelector
            style={{ width: "100%" }}
            // isRealData={{
            //   marketType,
            //   fileType: "order",
            // }}
            onChange={(e) => {
              setStockId(e);
              setStartTime(null);
              setEndTime(null);
            }}
          />
        </div>
        <div className="w-1/6">
          開始時間
          <DatePicker
            allowClear
            style={{ width: "100%" }}
            disabled={!stockId}
            placeholder="選擇開始時間"
            disabledDate={(current) => {
              const transferedCurrent = current && current.startOf("day");
              const transferedEndTime = endTime && endTime;
              return (
                (transferedCurrent && transferedCurrent > moment()) ||
                (transferedCurrent &&
                  !availableDate.includes(
                    transferedCurrent.format("YYYY-MM-DD")
                  )) ||
                (transferedEndTime && transferedCurrent > transferedEndTime) ||
                (transferedEndTime &&
                  transferedEndTime.diff(transferedCurrent) / 86400000 >= 5)
              );
            }}
            value={startTime}
            onChange={(time) => {
              setStartTime(time && time.startOf("day"));
            }}
          />
        </div>
        <div className="w-1/6">
          結束時間
          <DatePicker
            allowClear
            style={{ width: "100%" }}
            disabled={!stockId}
            placeholder="選擇結束時間"
            disabledDate={(current) => {
              const transferedCurrent = current && current.startOf("day");
              const transferedStartTime = startTime && startTime;
              return (
                (transferedCurrent && transferedCurrent > moment()) ||
                (transferedCurrent &&
                  !availableDate.includes(
                    transferedCurrent.format("YYYY-MM-DD")
                  )) ||
                (transferedStartTime &&
                  transferedCurrent < transferedStartTime) ||
                (transferedStartTime &&
                  transferedCurrent.diff(transferedStartTime) / 86400000 >= 5)
              );
            }}
            value={endTime}
            onChange={(time) => {
              setEndTime(time && time.startOf("day"));
            }}
          />
        </div>
        <Button
          type="primary"
          danger
          onClick={async () => {
            let tempStockId = stockId;
            if (customResetStock) {
              tempStockId = await customResetStock(stockId);
            } else {
              await resetStock(stockId).catch((err) => {
                errorNotification(err);
              });
            }

            getRealDataOrderContent({
              stockId,
              createdTime: {
                min: startTime.startOf("day").toISOString(),
                max: endTime.endOf("day").toISOString(),
              },
            })
              .then(({ data }) => {
                setOrders(
                  data.content.map((v) => {
                    return {
                      ...v,
                      investorId: null,
                      stockId: tempStockId,
                    };
                  })
                );
              })
              .catch((err) => {
                errorNotification(err);
              });
          }}
          disabled={!stockId || !startTime || !endTime}
        >
          載入委託
        </Button>
      </div>
      <OrderSender orders={orders} stockId={stockId} onReset={onReset} />
    </div>
  );
};

const ReplaySimulator = ({ customResetStock, onReset }) => {
  // Functional state
  const [orders, setOrders] = useState([]);

  //Query state
  const [stockId, setStockId] = useState();
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();

  debugOrders(orders, "replay");
  return (
    <div>
      <div className="flex justify-around my-6 items-center">
        <div className="w-1/6">
          選擇股票
          <StockSelector
            style={{ width: "100%" }}
            onChange={(e) => {
              setStockId(e);
              setStartTime(null);
              setEndTime(null);
            }}
          />
        </div>
        <div className="w-1/6">
          開始時間
          <DatePicker
            allowClear
            style={{ width: "100%" }}
            placeholder="選擇開始時間"
            disabledDate={(current) =>
              (current && current > dayjs()) ||
              (endTime && current.startOf("day") >= endTime.startOf("day"))
            }
            value={startTime}
            onChange={(time) => {
              setStartTime(time && time.startOf("day"));
            }}
          />
        </div>
        <div className="w-1/6">
          結束時間
          <DatePicker
            allowClear
            style={{ width: "100%" }}
            placeholder="選擇結束時間"
            disabledDate={(current) =>
              (current && current > dayjs()) ||
              (startTime && current.startOf("day") <= startTime.startOf("day"))
            }
            value={endTime}
            onChange={(time) => {
              setEndTime(time && time.startOf("day"));
            }}
          />
        </div>
        <Button
          type="primary"
          disabled={!stockId}
          onClick={async () => {
            let tempStockId = stockId;
            if (customResetStock) {
              tempStockId = await customResetStock(stockId);
            }

            getOrder(
              stockId,
              startTime && startTime.startOf("day").toISOString(),
              endTime && endTime.endOf("day").toISOString()
            )
              .then(async ({ data }) => {
                setOrders(
                  data.content.map((v) => {
                    return {
                      ...v,
                      investorId: null,
                      stockId: tempStockId,
                    };
                  })
                );
                if (!customResetStock) {
                  await resetStock(stockId).catch((err) => {
                    errorNotification(err);
                  });
                }
              })
              .catch((err) => {
                errorNotification(err);
              });
          }}
        >
          載入重播
        </Button>
      </div>
      <OrderSender orders={orders} stockId={stockId} onReset={onReset} />
    </div>
  );
};

const CaseSimulator = ({ customResetStock, onReset }) => {
  // Functional state
  const [orders, setOrders] = useState([]);
  const [caseData, setCaseData] = useState([]);
  const [selectedCaseId, setSelectedCaseId] = useState();

  //Query state
  const [stockId, setStockId] = useState();
  const [startTime, setStartTime] = useState();

  useEffect(() => {
    if (stockId) {
      defaultAxios({
        url: api.getVirtualOrderContainer.url,
        method: api.getVirtualOrderContainer.method,
        params: {
          stockId,
        },
      })
        .then((res) => {
          setCaseData(
            res.data.content.map((content) => ({
              label: content.name,
              value: content.id,
            }))
          );
        })
        .catch((err) => {
          errorNotification(err);
        });
    }
  }, [stockId]);

  debugOrders(orders, "case");
  return (
    <div>
      <div className="flex justify-around my-6 items-center">
        <div className="w-1/6">
          選擇股票
          <StockSelector
            style={{ width: "100%" }}
            onChange={(e) => {
              setStockId(e);
              setSelectedCaseId();
              setStartTime();
            }}
          />
        </div>
        <div className="w-1/6">
          選擇情境
          <Select
            className="w-full"
            options={caseData}
            value={selectedCaseId}
            onChange={(caseId) => {
              setSelectedCaseId(caseId);
            }}
          />
        </div>
        <div className="w-1/6">
          開始時間
          <DatePicker
            allowClear
            style={{ width: "100%" }}
            placeholder="選擇開始時間"
            disabledDate={(current) => current && current > dayjs()}
            value={startTime}
            onChange={(time) => {
              setStartTime(time && time.startOf("day"));
            }}
          />
        </div>
        <Button
          type="primary"
          disabled={!(stockId && selectedCaseId && startTime)}
          onClick={async () => {
            let tempStockId = stockId;
            if (customResetStock) {
              tempStockId = await customResetStock(stockId);
            } else {
              await resetStock(stockId).catch((err) => {
                errorNotification(err);
              });
            }

            defaultAxios({
              url: api.getVirtualOrder.url,
              method: api.getVirtualOrder.method,
              params: {
                virtualOrderContainerId: selectedCaseId,
              },
            })
              .then(({ data }) => {
                const baseTime = Date.parse(
                  startTime.startOf("day").toISOString()
                );
                let accumulatedDelay = 0;
                const orders = data.content.map(({ delay, id, ...order }) => {
                  accumulatedDelay += delay || 1;
                  const createdTime = new Date(
                    baseTime + accumulatedDelay
                  ).toISOString();
                  return {
                    ...order,
                    createdTime,
                    investorId: null,
                    stockId: tempStockId,
                  };
                });

                setOrders(orders);
              })
              .catch((err) => {
                errorNotification(err);
              });
          }}
        >
          載入情境
        </Button>
      </div>
      <OrderSender orders={orders} stockId={stockId} onReset={onReset} />
    </div>
  );
};

const Simulator = ({ customResetStock, onReset }) => {
  return (
    <Tabs type="card" centered>
      <TabPane tab="真實資料" key="1">
        <RealDataSimulator
          customResetStock={customResetStock}
          onReset={onReset}
        />
        ;
      </TabPane>
      <TabPane tab="重播資料" key="2">
        <ReplaySimulator
          customResetStock={customResetStock}
          onReset={onReset}
        />
        ;
      </TabPane>
      <TabPane tab="情境資料" key="3">
        <CaseSimulator customResetStock={customResetStock} onReset={onReset} />;
      </TabPane>
    </Tabs>
  );
};

export default Simulator;
