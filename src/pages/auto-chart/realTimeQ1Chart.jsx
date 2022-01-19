import React, { useState, useRef, useEffect } from "react";
import { Slider, Typography, Table, Button, Form } from "antd";
import { api, defaultAxios } from "../../environment/api";
import errorNotification from "../../utils/errorNotification";
import dayjs from "dayjs";

const { Title } = Typography;

const RealTimeQ1Chart = ({ stockId, buttonStatus }) => {
  const [form] = Form.useForm();
  const rowBuffer = useRef({});
  const startTime = useRef("");
  const repeatTimer = useRef();
  const [q1Variable, setQ1Variable] = useState({
    s: 2,
    a: 10,
    b: 10,
    g: 2,
  });
  const [table, setTable] = useState({
    columns: [
      {
        title: "b \\ a",
        dataIndex: "name",
      },
    ],
    dataSource: [],
  });

  function columnCount() {
    const newColumn = [];
    for (let index = q1Variable.a; index > 0; index -= q1Variable.g) {
      newColumn.unshift({
        title: index,
        dataIndex: index,
        render: ({ raise, total }) => {
          console.log(raise, total);
          return (raise / total || 0).toFixed(4);
        },
      });
      rowBuffer.current = {
        ...rowBuffer.current,
        [index]: { last: 0, total: 0, raise: 0 },
      };
    }
    newColumn.unshift({
      title: "b \\ a",
      dataIndex: "name",
    });
    return newColumn;
  }

  function rowCount() {
    let newRow = {};
    for (let index = q1Variable.b; index > 0; index -= q1Variable.g) {
      newRow = {
        ...newRow,
        [index]: JSON.parse(JSON.stringify(rowBuffer.current)),
      };
    }
    return newRow;
  }
  function getData(columns, rowData) {
    defaultAxios({
      url: api.getDisplay.url,
      method: api.getDisplay.method,
      params: {
        stockId,
        createdTime: {
          min: startTime.current,
          max: dayjs().toISOString(),
        },
      },
    })
      .then((res) => {
        const filteredData = res.data.content.filter(
          (data) => data.firstOrderBuyPrice && data.firstOrderSellPrice
        );
        console.log(filteredData);

        if (filteredData.length) {
          Math.round(
            (filteredData[0].fiveTickRange[0].price -
              filteredData[0].fiveTickRange[1].price) *
              1e2
          ) / 1e2;

          for (let index = 0; index < filteredData.length; index++) {
            const targetData = filteredData[index];
            let a1 = 0;
            let b1 = 0;
            let s =
              Math.round(
                (targetData.firstOrderSellPrice -
                  targetData.firstOrderBuyPrice) *
                  1e2
              ) /
              1e2 /
              timeTicker;

            if (s !== q1Variable.s) continue;

            targetData.fiveTickRange.forEach((ticker) => {
              if (ticker.price === targetData.firstOrderBuyPrice) {
                b1 = ticker.buyQuantity;
              }
              if (ticker.price === targetData.firstOrderSellPrice) {
                a1 = ticker.sellQuantity;
              }
            });

            if (rowData[b1] && rowData[b1][a1]) {
              let m =
                (targetData.firstOrderBuyPrice +
                  targetData.firstOrderSellPrice) /
                2;
              if (
                rowData[b1][a1].last &&
                rowData[b1][a1].last !== m &&
                rowData[b1][a1].last < m
              ) {
                rowData[b1][a1].raise++;
              }
              rowData[b1][a1].total++;
              rowData[b1][a1].last = m;
            }
          }

          const dataSource = Object.entries(rowData).map(([key, val]) => ({
            name: key,
            ...val,
          }));
          setTable({ columns, dataSource });
        }
      })
      .catch((err) => {
        console.log(err);
        errorNotification(err?.response?.data);
      });
  }

  useEffect(() => {
    if (buttonStatus === "start") {
      startTime.current = dayjs().toISOString();
      repeatTimer.current = setInterval(() => {
        getData(columnCount(), rowCount());
      }, 1000);
    } else {
      clearInterval(repeatTimer.current);
    }
  }, [buttonStatus]);

  return (
    <div className="px-4">
      <Title className="mt-4 mb-3" level={5}>
        Q1 數值表格
      </Title>
      <div className="flex flex-col items-start pb-5">
        <Form
          form={form}
          className="w-full"
          initialValues={{
            s: 2,
            a: 10,
            b: 10,
            g: 2,
          }}
          onValuesChange={(_, allValues) => {
            setQ1Variable(allValues);
          }}
        >
          <Form.Item label={`s: ${q1Variable.s}`} name="s">
            <Slider min={1} max={5} step={1} />
          </Form.Item>
          <Form.Item label={`a: ${q1Variable.a}`} name="a">
            <Slider min={1} max={100} step={1} />
          </Form.Item>
          <Form.Item label={`b: ${q1Variable.b}`} name="b">
            <Slider min={1} max={100} step={1} />
          </Form.Item>
          <Form.Item label={`g: ${q1Variable.g}`} name="g">
            <Slider min={1} max={10} step={1} />
          </Form.Item>
        </Form>
      </div>
      <Table
        className="max-w-full"
        dataSource={table.dataSource}
        columns={table.columns}
        // pagination={{
        //   pageSize: 100,
        // }}
      />
    </div>
  );
};

export default RealTimeQ1Chart;
