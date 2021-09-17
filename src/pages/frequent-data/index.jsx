import React, { useEffect, useState } from "react";
import { defaultAxios, api } from "../../environment/api";
import dayjs from "dayjs";
import { Button, DatePicker, Select, Switch, Row, Col } from "antd";
import { StockSelector } from "../../component/stock-selector";
const { Option } = Select;

const FIELDS = [
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
  "tickcnt",
  "trdate",
  "ts",
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
  const [dateFormat, setDateFormat] = useState(3);
  const [sampleMode, setSampleMode] = useState(0);
  const [fields, setFields] = useState(FIELDS);
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();

  const [isGroup, setIsGroup] = useState(true);

  const [groupList, setGroupList] = useState();

  useEffect(() => {
    defaultAxios({
      url: api.getGroup.url,
      method: api.getGroup.method,
    }).then(({ data: { content: groupList } }) => {
      setGroupList(groupList);
    });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <Row>
        <Col span={6}>
          <Switch
            checked={isGroup}
            onChange={() => {
              setIsGroup(!isGroup);
            }}
          />
        </Col>
        {/* <Col span={3}>{isGroup ? "類股" : "股票"}</Col> */}
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
          時間頻率
          <Select
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
        </Col>
        <Col span={6}>
          取樣模式
          <Select
            disabled={dateFormat === undefined}
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
            {FIELDS.map((field) => {
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
          onClick={async () => {
            let stockIds = [];
            if (isGroup) {
              if (!isNaN(group)) {
                stockIds = groupList[group].stocks.map((stock) => stock.id);
              }
            } else {
              if (stocks) stockIds = stocks;
            }

            console.log("stockIds", stockIds);
            console.log("time range", startTime, endTime);
            console.log("date format", dateFormat);
            console.log("sample mode", sampleMode);
            console.log("fields ", fields);
            if (stockIds.length) {
              const { url, method } = api.downloadRealDataDisplayContent;
              await Promise.all(
                stockIds.map((stockId) => {
                  return defaultAxios({
                    url,
                    method,
                    params: {
                      createdTime: JSON.stringify({
                        max: endTime,
                        min: startTime,
                      }),
                      dateFormat,
                      sampleMode,
                      fields,
                      stockId,
                    },
                  }).then(({ data, headers }) => {
                    const fileName = headers["content-disposition"]
                      .match(/".+"/)[0]
                      .replace(/"/g, "");
                    const url = window.URL.createObjectURL(new Blob([data]));
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", fileName);
                    document.body.appendChild(link);
                    link.click();
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
