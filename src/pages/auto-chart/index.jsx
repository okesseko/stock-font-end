import React, { useEffect, useRef, useState } from "react";
import Settings from "./settings";
import BarChart from "../echart-example/bar";
import BarLineChart from "../echart-example/bar-line";
import { defaultAxios, api } from "../../environment/api";
import { Button, Select, Typography, Table } from "antd";

const { Title } = Typography;

const AutoChart = () => {
  const chartRecord = useRef();
  const playCase = useRef(null);
  const selectCaseId = useRef();
  const [originData, setOriginData] = useState({});
  const [buttonStatus, setButtonStatus] = useState("stop");
  const [showType, setShowType] = useState("all");
  const [frequency, setFrequency] = useState(1);
  const [timeChart, setTimeChart] = useState({
    xAxis: [],
    price: [],
    quantity: [],
    buy: [],
    sell: [],
  });
  const [caseData, setCaseData] = useState([]);
  const [caseOrder, setCaseOrder] = useState([]);
  function renderData() {
    Promise.all([
      defaultAxios({
        url: api.getDisplay.url,
        method: api.getDisplay.method,
        params: {
          isGetLatest: true,
        },
      }),
      defaultAxios({
        url: api.getDisplayChart.url,
        method: api.getDisplayChart.method,
        params: {
          stockId: 1,
          dateFormat: frequency === 60 ? 0 : 3,
        },
      }),
    ]).then((val) => {
      console.log(val[1].data, "123");
      setOriginData(() => val[0].data);
      // const getData =
      //   val[1].data.length - 50 < 0 ? 0 : val[1].data.length - 100;
      const xAxis = [],
        price = [],
        quantity = [],
        buy = [],
        sell = [];
      val[1].data.slice(0, val[1].data.length).forEach((deta) => {
        xAxis.push(deta.createdTime);
        price.push(deta.close);
        quantity.push(deta.quantity);
        buy.push(deta.firstOrderBuy);
        sell.push(deta.firstOrderSell);
      });
      setTimeChart({
        xAxis,
        price,
        quantity,
        buy,
        sell,
      });
    });
  }
  function resetStock(getData = false) {
    defaultAxios({
      url: api.resetStock.url,
      method: api.resetStock.method,
      data: {
        id: 1,
        isReset: true,
      },
    }).then(() => {
      if (getData) renderData();
    });
    setOriginData({});
    setTimeChart({
      xAxis: [],
      price: [],
      quantity: [],
      buy: [],
      sell: [],
    });
    setButtonStatus("stop");
  }

  useEffect(() => {
    clearInterval(chartRecord.current);
    if (buttonStatus === "start") {
      chartRecord.current = setInterval(() => {
        renderData();
      }, frequency * 1000);
    }
    return () => {
      clearInterval(chartRecord.current);
    };
  }, [buttonStatus, frequency]);

  useEffect(() => {
    defaultAxios({
      url: api.getVirtualOrderContainer.url,
      method: api.getVirtualOrderContainer.method,
    }).then((res) => {
      setCaseData(
        res.data.content.map((content) => ({
          label: content.name,
          value: content.id,
        }))
      );
    });
  }, []);

  return (
    <div>
      <BarChart originData={originData} showType={showType} />
      <div className="flex justify-around my-6 items-center">
        <div>
          圖表模式
          <Select
            value={showType}
            style={{ width: 120, marginLeft: "20px" }}
            onChange={(value) => {
              setShowType(value);
            }}
            options={[
              {
                label: "全部",
                value: "all",
              },
              {
                label: "買賣五檔",
                value: "allfive",
              },
              {
                label: "買五檔",
                value: "buyfive",
              },
              {
                label: "賣五檔",
                value: "sellfive",
              },
            ]}
          />
        </div>
        目前狀態: {buttonStatus}
      </div>
      <BarLineChart data={timeChart} />
      <div className="flex justify-around my-6 items-center">
        <Button type="primary" onClick={() => setButtonStatus("start")}>
          開始模擬
        </Button>
        <Button
          style={{ background: "#91A194", color: "white" }}
          onClick={() => setButtonStatus("stop")}
        >
          暫停模擬
        </Button>
        <Button
          type="primary"
          danger
          onClick={() => {
            resetStock();
          }}
        >
          重製模擬
        </Button>
        <div>
          圖表更新頻率
          <Select
            className="w-20 ml-2"
            value={frequency}
            options={[
              { value: 60, label: "1m" },
              { value: 10, label: "10s" },
              { value: 5, label: "5s" },
              { value: 1, label: "1s" },
              { value: 0.5, label: "0.5s" },
            ]}
            onChange={(val) => {
              setFrequency(val);
            }}
          />
        </div>
      </div>
      <Title className="m-4 mb-0" level={5}>
        使用情境
      </Title>
      <div className="max-h-96 m-4 mt-1 border border-gray-200 px-4">
        <div className="my-4 flex justify-around  items-end">
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
            onClick={() => {
              if (selectCaseId.current !== null) {
                defaultAxios({
                  url: api.putStock.url,
                  method: api.putStock.method,
                  data: {
                    id: 1,
                    virtualOrderContainerId: selectCaseId.current,
                  },
                }).then(() => {
                  resetStock(true);
                });
              }
            }}
          >
            使用情境重製
          </Button>
          <Button
            type="primary"
            danger
            onClick={() => {
              if (caseOrder.length) {
                const { createdTime, id, ...other } = caseOrder[0];
                defaultAxios({
                  url: api.postOrder.url,
                  method: api.postOrder.method,
                  data: {
                    investorId: 1,
                    stockId: 1,
                    ...other,
                  },
                }).then(() => {
                  setCaseOrder(caseOrder.slice(1));
                  renderData();
                });
              }
            }}
          >
            單步執行情境
          </Button>
          <Button
            disabled={!caseOrder.length}
            onClick={() => {
              if (caseOrder.length && !playCase.current)
                playCase.current = setInterval(() => {
                  setCaseOrder((_case) => {
                    if (_case.length) {
                      const { createdTime, id, ...other } = _case[0];
                      defaultAxios({
                        url: api.postOrder.url,
                        method: api.postOrder.method,
                        data: {
                          investorId: 1,
                          stockId: 1,
                          ...other,
                        },
                      }).then(() => {
                        renderData();
                      });
                    } else {
                      clearInterval(playCase.current);
                      playCase.current = null;
                    }
                    return _case.slice(1);
                  });
                }, 1000);
            }}
          >
            自動執行 1s
          </Button>
          <Button
            disabled={!(caseOrder.length && playCase.current)}
            onClick={() => {
              clearInterval(playCase.current);
              playCase.current = null;
            }}
          >
            暫停自動執行
          </Button>
        </div>
        <Table
          rowKey="id"
          className="h-full "
          scroll={{ y: 240 }}
          columns={[
            {
              title: "價格類型",
              dataIndex: "priceType",
              render: (data) => <span>{data ? "LIMIT" : "MARKET"}</span>,
            },
            {
              title: "類型",
              dataIndex: "method",
              render: (data) => <span>{data ? "sell" : "buy"}</span>,
            },
            {
              title: "價格",
              dataIndex: "price",
            },
            {
              title: "數量",
              dataIndex: "quantity",
            },
            {
              title: "副類型",
              dataIndex: "subMethod",
              render: (data) => (
                <span>
                  {data ? "UPDATE" : data === null ? "NULL" : "CANCEL"}
                </span>
              ),
            },
            {
              title: "時間限制",
              dataIndex: "timeRestriction",
              render: (data) => (
                <span>{data ? "IOC" : data === 2 ? "FOK" : "ROD"}</span>
              ),
            },
          ]}
          pagination={false}
          dataSource={caseOrder}
        />
      </div>
      <Settings buttonStatus={buttonStatus} />
    </div>
  );
};

export default AutoChart;
