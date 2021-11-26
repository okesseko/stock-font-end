import React, { useEffect, useState } from "react";
import { defaultAxios, api } from "../../environment/api";
import dayjs from "dayjs";
import {
  Button,
  DatePicker,
  Select,
  Switch,
  Row,
  Col,
  InputNumber,
} from "antd";
import { StockSelector } from "../../component/stock-selector";
import errorNotification from "../../utils/errorNotification";
const { Option } = Select;
const ORDER_FIELDS = [
  "count",
  "method",
  "subMethod",
  "price",
  "quantity",
  "priceType",
  "timeRestriction",
  "stockId",
  "trdate",
  "ts",
];
const TRANSACTION_FIELDS = [
  "count",
  "stockId",
  "price",
  "quantity",
  "trdate",
  "ts",
];
const DISPLAY_FIELDS = [
  "count",
  "mthpx",
  "mthsz",
  "a1px",
  "a1sz",
  "a2px",
  "a2sz",
  "a3px",
  "a3sz",
  "a4px",
  "a4sz",
  "a5px",
  "a5sz",
  "b1px",
  "b1sz",
  "b2px",
  "b2sz",
  "b3px",
  "b3sz",
  "b4px",
  "b4sz",
  "b5px",
  "b5sz",
  "asz",
  "bsz",
  "sym",
  "trdate",
  "ts",
];

const getFileTypeFields = (fileType) => {
  switch (fileType) {
    case "transaction":
      return TRANSACTION_FIELDS;
    case "display":
      return DISPLAY_FIELDS;
    default:
      return ORDER_FIELDS;
  }
};
const getFileTypeAPI = (fileType) => {
  switch (fileType) {
    case "transaction":
      return api.getRealDataTransactionContent;
    case "display":
      return api.getRealDataDisplayContent;
    default:
      return api.getRealDataOrderContent;
  }
};

const FILET_TYPE = [
  { header: "委託檔", value: "order" },
  { header: "成交檔", value: "transaction" },
  { header: "揭示檔", value: "display" },
];
const DATE_FORMAT = [
  {
    header: "毫秒",
    value: 4,
  },
  {
    header: "秒",
    value: 3,
  },
  {
    header: "分",
    value: 0,
  },
  {
    header: "時",
    value: 1,
  },
  {
    header: "日",
    value: 2,
  },
];
const SAMPLE_MODE = [
  {
    header: "第一筆",
    value: 0,
  },
  {
    header: "成交價最大",
    value: 1,
  },
  {
    header: "成交價最小",
    value: 2,
  },
  {
    header: "平均成交價",
    value: 3,
  },
];

const FrequentData = function () {
  const [group, setGroup] = useState();
  const [stocks, setStocks] = useState();
  const [fileType, setFileType] = useState("order");
  const [unit, setUnit] = useState(1);
  const [isSample, setIsSample] = useState(true);
  const [dateFormat, setDateFormat] = useState(3);
  const [sampleMode, setSampleMode] = useState(0);
  const [fields, setFields] = useState(ORDER_FIELDS);
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();

  const [isLoading, setIsLoading] = useState(false);

  const [isGroup, setIsGroup] = useState(false);

  const [groupList, setGroupList] = useState();

  useEffect(() => {
    defaultAxios({
      url: api.getGroup.url,
      method: api.getGroup.method,
    })
      .then(({ data: { content: groupList } }) => {
        setGroupList(groupList);
      })
      .catch((err) => {
        errorNotification(err?.response?.data);
      });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <Row>
        <Col span={6}>
          {/* <Switch
            checked={isGroup}
            onChange={() => {
              setIsGroup(!isGroup);
            }}
          /> */}
          檔案類型
          <Select
            style={{ width: "100%" }}
            onChange={(e) => {
              setFileType(e);
              setFields(getFileTypeFields(e));
            }}
            value={fileType}
            placeholder="選擇檔案類型"
          >
            {FILET_TYPE.map((fileType) => {
              return (
                <Option key={Math.random()} value={fileType.value}>
                  {fileType.header}
                </Option>
              );
            })}
          </Select>
        </Col>
        <Col span={6}>
          {isGroup ? "類股" : "股票"}
          <Select
            style={{ width: "100%", display: isGroup ? undefined : "none" }}
            onChange={(e) => {
              setGroup(e);
            }}
            value={group}
            placeholder="選擇類股"
          >
            {groupList &&
              groupList.map((group, index) => {
                return (
                  <Option key={Math.random()} value={index}>
                    {group.name}
                  </Option>
                );
              })}
          </Select>
          <StockSelector
            style={{ width: "100%", display: !isGroup ? undefined : "none" }}
            onChange={(e) => {
              setStocks(e);
            }}
            mode="multiple"
          />
        </Col>
      </Row>
      <Row style={{ marginTop: "20px" }}>
        <Col span={6}>
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
        </Col>
        <Col span={6}>
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
        </Col>
      </Row>
      <Row style={{ marginTop: "20px" }}>
        <Col span={6}>
          {isSample ? "時間頻率" : "不取樣"}
          <Switch
            checked={isSample}
            onChange={() => {
              setIsSample(!isSample);
            }}
          />
          <div style={{ display: "flex", flexDirection: "row" }}>
            <InputNumber
              disabled={!isSample}
              style={{ width: "100%" }}
              value={unit}
              step={1}
              onChange={(e) => {
                setUnit(Math.floor(e));
              }}
            />
            <Select
              disabled={!isSample}
              allowClear
              style={{ width: "100%" }}
              onChange={(e) => {
                setDateFormat(e);
              }}
              value={dateFormat}
              placeholder="選擇時間頻率"
            >
              {DATE_FORMAT.map((dateFormat) => {
                return (
                  <Option key={Math.random()} value={dateFormat.value}>
                    {dateFormat.header}
                  </Option>
                );
              })}
            </Select>
          </div>
        </Col>
        <Col span={6}>
          取樣模式
          <Select
            disabled={dateFormat === undefined || !isSample}
            style={{ width: "100%" }}
            onChange={(e) => {
              setSampleMode(e);
            }}
            value={sampleMode}
            placeholder="選擇取樣模式"
          >
            {SAMPLE_MODE.map((sampleMode) => {
              return (
                <Option key={Math.random()} value={sampleMode.value}>
                  {sampleMode.header}
                </Option>
              );
            })}
          </Select>
        </Col>
      </Row>
      <Row style={{ marginTop: "20px" }}>
        <Col span={12}>
          欄位
          <Select
            style={{ width: "100%" }}
            onChange={(e) => {
              setFields(e);
            }}
            value={fields}
            mode="multiple"
            placeholder="選擇欄位"
          >
            {getFileTypeFields(fileType).map((field) => {
              return (
                <Option key={Math.random()} value={field}>
                  {field}
                </Option>
              );
            })}
          </Select>
        </Col>
      </Row>
      <Row style={{ marginTop: "20px" }}>
        <Button
          loading={isLoading}
          onClick={async () => {
            let stockIds = [];
            if (isGroup) {
              if (!isNaN(group)) {
                stockIds = groupList[group].stocks.map((stock) => stock.id);
              }
            } else {
              if (stocks) stockIds = stocks;
            }

            // console.log("stockIds", stockIds);
            // console.log("time range", startTime, endTime);
            // console.log("date format", dateFormat);
            // console.log("sample mode", sampleMode);
            // console.log("fields ", fields);
            if (stockIds.length) {
              const { url, method } = getFileTypeAPI(fileType);
              setIsLoading(true);
              const createdTime = {
                max: endTime,
                min: startTime,
              };

              await Promise.all(
                stockIds.map((stockId) => {
                  return defaultAxios({
                    url,
                    method,
                    params: {
                      createdTime,
                      unit,
                      dateFormat: isSample ? dateFormat : undefined,
                      sampleMode,
                      fields,
                      stockId,
                    },
                  })
                    .then(({ data, headers }) => {
                      const fileName = headers["filename"];
                      const header = data.length
                        ? Object.keys(data[0]).join(",") + "\n"
                        : "";
                      const transferData =
                        header +
                        data
                          .map((v) => {
                            return Object.values(v).join(",");
                          })
                          .join("\n");

                      const url = window.URL.createObjectURL(
                        new Blob([transferData])
                      );
                      const link = document.createElement("a");
                      link.href = url;
                      link.setAttribute("download", fileName);
                      document.body.appendChild(link);
                      link.click();
                      window.URL.revokeObjectURL(url);
                      setIsLoading(false);
                    })
                    .catch((err) => {
                      console.log(err);
                      errorNotification(err?.response?.data);
                    });
                })
              );
            }
          }}
        >
          DOWNLOAD CSV
        </Button>
      </Row>
    </div>
  );
};

export default FrequentData;
