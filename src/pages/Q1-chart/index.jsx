import React, { useState, useEffect } from "react";
import {
  Slider,
  Tabs,
  Typography,
  Table,
  Button,
  DatePicker,
  Form,
} from "antd";
import { StockSelector } from "../../component/stock-selector";
import { api, defaultAxios } from "../../environment/api";
import errorNotification from "../../utils/errorNotification";
import dayjs from "dayjs";

const { Title } = Typography;

const Q1Chart = () => {
  const [q1Variable, setQ1Variable] = useState({
    stock: "",
    startTime: "",
    endTime: "",
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
      });
    }
    newColumn.unshift({
      title: "b \\ a",
      dataIndex: "name",
    });
    setTable({ ...table, columns: newColumn });
  }
  function getData() {
    defaultAxios({
      url: api.getOrder.url,
      method: api.getOrder.method,
      params: {
        stockId: q1Variable.stock,
        createdTime: { min: q1Variable.startTime, max: q1Variable.endTime },
      },
    })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        errorNotification(err?.response?.data);
      });
  }

  useEffect(() => {
    columnCount();
  }, []);

  useEffect(() => {
    columnCount();
    getData();
  }, [q1Variable]);

  return (
    <div className="px-4">
      <Title className="mt-4 mb-3" level={5}>
        Q1 數值表格
      </Title>
      <div className="flex flex-col items-center pb-5">
        <Form
          initialValues={{
            s: 2,
            a: 10,
            b: 10,
            g: 2,
          }}
          onFinish={(val) => {
            const { createdTime, ...other } = val;
            setQ1Variable({
              ...other,
              startTime: dayjs(createdTime[0]).toISOString(),
              endTime: dayjs(createdTime[1]).toISOString(),
            });
          }}
        >
          <Form.Item
            rules={[{ required: true, message: "請選擇股票" }]}
            label="選擇股票"
            name="stock"
          >
            <StockSelector style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: "請選擇時間" }]}
            label="播放時間"
            name="createdTime"
          >
            <DatePicker.RangePicker showTime className="w-full" />
          </Form.Item>
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
          <Button type="primary" htmlType="submit">
            開始計算
          </Button>
        </Form>
      </div>
      <Table
        className="max-w-full"
        dataSource={table.dataSource}
        columns={table.columns}
      />
    </div>
  );
};

export default Q1Chart;
