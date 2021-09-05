import React, { useEffect, useRef, useState } from "react";
import BarChart from "../echart-example/bar";
import { defaultAxios, api } from "../../environment/api";
import { Button, Input, Select, DatePicker, Table } from "antd";
import fakeData from '../../fake'
import dayjs from "dayjs";

const ReplayChart = () => {
  const chartRecord = useRef();
  const [originData, setOriginData] = useState({});
  const [restData, setResetdata] = useState([]);
  const [restDataIndex, setResetdataIndex] = useState(-1);
  const [buttonStatus, setButtonStatus] = useState("stop");
  const [showType, setShowType] = useState("all");
  const [frequency, setFrequency] = useState(1);
  const [startTime, setStartTime] = useState();

  useEffect(() => {
    if (buttonStatus === "select") {
      defaultAxios({
        url: api.resetStock.url,
        method: api.resetStock.method,
        data: {
          id: 1,
          createdTime: startTime,
          isReset: false,
        },
      }).then((res) => {
        console.log(res.data.orders);
        setResetdata(res.data.orders);
        setOriginData({});
        setResetdataIndex(-1);
      });
    } else if (buttonStatus === "real") {
      setResetdata(fakeData);
      setOriginData({});
      setResetdataIndex(-1);
    } else if (buttonStatus === "start") {
      clearInterval(chartRecord.current);
      chartRecord.current = setInterval(() => {
        setResetdataIndex((index) => {
          return index + 1 < restData.length ? index + 1 : index;
        });
      }, 1000 * frequency);
    } else if (buttonStatus === "stop") {
      clearInterval(chartRecord.current);
    }
  }, [buttonStatus]);

  useEffect(() => {
    if (restDataIndex === restData.length) {
      clearInterval(chartRecord.current);
    } else {
      const nextStep = restData[restDataIndex];
      if (nextStep)
        defaultAxios({
          url: api.postOrder.url,
          method: api.postOrder.method,
          data: nextStep,
        }).then((res) => {
          const data = res.data;
          if (data) setOriginData(data);
          console.log(data, "return");
        });
    }
  }, [restDataIndex]);

  useEffect(() => {
    if (buttonStatus === "start") {
      clearInterval(chartRecord.current);
      chartRecord.current = setInterval(() => {
        setResetdataIndex((index) => {
          return index + 1 < restData.length ? index + 1 : index;
        });
      }, 1000 * frequency);
    }
  }, [frequency]);
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
      <div className="flex justify-around my-6 items-end">
        <DatePicker
          showTime
          placeholder="選擇重播開始時間"
          disabledDate={(current) => current && current > dayjs()}
          onChange={(time) => {
            if (time) setStartTime(dayjs(time).toISOString());
            else setStartTime(time);
          }}
        />
        <Button
          type="primary"
          disabled={!startTime}
          onClick={() => setButtonStatus("select")}
        >
          選擇時間
        </Button>
        {/* <Button
          type="primary"
          onClick={() => setButtonStatus("real")}
        >
          使用證交所資料
        </Button> */}
        <Button
          type="primary"
          danger
          disabled={!restData.length}
          onClick={() => setButtonStatus("start")}
        >
          開始重播
        </Button>
        <Button
          style={{ background: "#91A194", color: "white" }}
          onClick={() => setButtonStatus("stop")}
        >
          暫停重播
        </Button>
        <div>
          幾秒一單
          <Select
            className="w-20"
            value={frequency}
            options={[
              { value: 10, label: "10s" },
              { value: 5, label: "5s" },
              { value: 2, label: "2s" },
              { value: 1, label: "1s" },
            ]}
            onChange={(val) => {
              setFrequency(val);
            }}
          />
        </div>
        <Button
          disabled={buttonStatus === "start" || !restData.length}
          onClick={() => {
            setButtonStatus("next");
            if (restDataIndex + 1 < restData.length)
              setResetdataIndex(restDataIndex + 1);
          }}
        >
          手動下一步
        </Button>
      </div>
      <div>
        下步狀態({restDataIndex} / {restData.length - 1} )
        {!!restData.length && (
          <Table
            rowKey="id"
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

              // {
              //   title: "狀態",
              //   dataIndex: "status",
              //   render: (data) => <span>{data ? "FAIL" : "SUCCESS"}</span>,
              // },
              {
                title: "時間限制",
                dataIndex: "timeRestriction",
                render: (data) => (
                  <span>{data ? "IOC" : data === 2 ? "FOK" : "ROD"}</span>
                ),
              },
            ]}
            pagination={false}
            dataSource={[restData[restDataIndex + 1]]}
            sticky
          />
        )}
      </div>
    </div>
  );
};

export default ReplayChart;
