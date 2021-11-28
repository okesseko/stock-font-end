import { configConsumerProps } from "antd/lib/config-provider";
import React, { useEffect, useRef, useState } from "react";
import { renderData } from "./math-model";
import { defaultAxios, api } from "../../../environment/api";
import errorNotification from "../../../utils/errorNotification";
import { Slider, Tabs, Typography, Table } from "antd";

const { Title } = Typography;
const { TabPane } = Tabs;

export default function Settings({ buttonStatus = "stop", stockId }) {
  const displayData = useRef();
  const timeSet = useRef();
  const [nextTime, setNextTime] = useState(0);

  const [q, setQ] = useState({
    array_a: [],
    array_b: [],
    q1_array: [],
  });

  const [setting, setSetting] = useState({
    current_tab: 1,
    default_alpha_B: 0.52,
    default_alpha_A: 0.52,
    default_lambda_B: 10,
    default_lambda_B_K: 1.92,
    default_lambda_A: 10,
    default_lambda_A_K: 1.92,
    R_B: 0.8,
    R_A: 0.8,
    default_theta_B: 10,
    default_theta_A: 10,
    R_theta_B: 0.8,
    R_theta_A: 0.8,
    mu_B: 0.94,
    mu_A: 0.94,
    n: 10, 
    p: 0.5,
    batch_size: 10,
    s: 1,
    max_a: 13,
    max_b: 11,
    gap: 3,
  });

  const [table, setTable] = useState({
    columns: [
      {
        title: 'b \\ a',
        dataIndex: 'name',
        key: Math.random(),
      },
      {
        title: 1,
        dataIndex: 1,
        key: Math.random(),
      },
      {
        title: 4,
        dataIndex: 4,
        key: Math.random(),
      },
      {
        title: 7,
        dataIndex: 7,
        key: Math.random(),
      },
      {
        title: 10,
        dataIndex: 10,
        key: Math.random(),
      },
      {
        title: 13,
        dataIndex: 13,
        key: Math.random(),
      },
    ],
    dataSource: [
      {
        key: 2,
        name: 2,
      },
      {
        key: 5,
        name: 5,
      },
      {
        key: 8,
        name: 8,
      },
      {
        key: 11,
        name: 11,
      },
    ],
  });
  useEffect(() => {
    defaultAxios({
      url: api.getDisplay.url,
      method: api.getDisplay.method,
      params: {
        isGetLatest: true,
      },
    })
      .then((res) => {
        displayData.current = res.data;
        setNextTime(renderData(setting, q, res.data, true));
      })
      .catch((err) => {
        errorNotification(err?.response?.data);
      });
  }, []);

  useEffect(() => {
    if (nextTime && buttonStatus !== "stop") {
      setTimeout(() => {
        setNextTime(() =>
          renderData(setting, q, displayData.current, false, stockId)
        );
      }, nextTime);
    }
  }, [nextTime, buttonStatus]);

  const handleInputChangeAlphaB = (value) => {
    setSetting({ ...setting, default_alpha_B: value });
  };

  const handleInputChangeAlphaA = (value) => {
    setSetting({ ...setting, default_alpha_A: value });
  };

  const handleInputChangeLambdaB = (value) => {
    setSetting({ ...setting, default_lambda_B: value });
  };

  const handleInputChangeLambdaBK = (value) => {
    setSetting({ ...setting, default_lambda_B_K: value });
  };

  const handleInputChangeLambdaA = (value) => {
    setSetting({ ...setting, default_lambda_A: value });
  };

  const handleInputChangeLambdaAK = (value) => {
    setSetting({ ...setting, default_lambda_A_K: value });
  };

  const handleInputChangeLambdaRatioB = (value) => {
    setSetting({ ...setting, R_B: value });
  };

  const handleInputChangeLambdaRatioA = (value) => {
    setSetting({ ...setting, R_A: value });
  };

  const handleInputChangeThetaB = (value) => {
    setSetting({ ...setting, default_theta_B: value });
  };

  const handleInputChangeThetaA = (value) => {
    setSetting({ ...setting, default_theta_A: value });
  };

  const handleInputChangeThetaRatioB = (value) => {
    setSetting({ ...setting, R_theta_B: value });
  };

  const handleInputChangeThetaRatioA = (value) => {
    setSetting({ ...setting, R_theta_A: value });
  };

  const handleInputChangeMuB = (value) => {
    setSetting({ ...setting, mu_B: value });
  };

  const handleInputChangeMuA = (value) => {
    setSetting({ ...setting, mu_A: value });
  };

  const handleInputChangeN = (value) => {
    setSetting({ ...setting, n: value });
  };

  const handleInputChangeP = (value) => {
    setSetting({ ...setting, p: value });
  };

  const handleInputChangeBatchSize = (value) => {
    setSetting({ ...setting, batch_size: value });
  };

  const handleTabsChange = (key) => {
    setSetting({ ...setting, current_tab: key });
  };

  const handleInputChangeS = (key) => {
    setSetting({ ...setting, s: key });
  };

  const handleInputChangeMaxA = (key) => {
    setSetting({ ...setting, max_a: key });
    renderTable(setting.gap, key, setting.max_b);
    setQ1Array();
  };

  const handleInputChangeMaxB = (key) => {
    setSetting({ ...setting, max_b: key });
    renderTable(setting.gap, setting.max_a, key);
    setQ1Array();
  };

  const handleInputChangeGap = (key) => {
    setSetting({ ...setting, gap: key });
    renderTable(key, setting.max_a, setting.max_b);
    setQ1Array();
  };

  function setQ1Array() { 
    let array_a = [];
    let array_b = [];
    let q1_array = [];

    let start_a = (setting.max_a % setting.gap == 0) ? setting.gap : setting.max_a % setting.gap;
    for(var i=start_a; i<=setting.max_a; i=i+setting.gap) {
      array_a.push(i)
    }
    let start_b = (setting.max_b % setting.gap == 0) ? setting.gap : setting.max_b % setting.gap;
    for(var i=start_b; i<=setting.max_b; i=i+setting.gap) {
      array_b.push(i)
    }
  
    array_a.forEach(a => {
      array_b.forEach(b => {
        q1_array.push({
          [a]: false, 
          [b]: false,
          midprice: 0,
          count_up: 0, 
          count_down: 0,
        });
      });
    });  
    setQ({ ...q, array_a: array_a, array_b: array_b, q1_array, q1_array });
  }

  function renderTable(gap, max_a, max_b) {
    let columns = [
      {
        title: 'b \\ a',
        dataIndex: 'name',
        key: Math.random(),
      },
    ];
    let dataSource = [];

    let start_a = (max_a % gap == 0) ? gap : max_a % gap;
    for(var i=start_a; i<=max_a; i=i+gap) {
      columns.push({
        title: i,
        dataIndex: i,
        key: i,
      })
    }
    let start_b = (max_b % gap == 0) ? gap : max_b % gap;
    for(var i=start_b; i<=max_b; i=i+gap) {
      dataSource.push({
        key: i,
        name: i,
      })
    }
    setTable({ ...table, columns: columns, dataSource: dataSource });
  }

  return (
    <div className="card-container px-5">
      <Tabs type="card" centered onChange={handleTabsChange}>
        <TabPane tab="Model (1)" key="1">
          <div>
            <div className="flex justify-center">
              <div className="w-1/2">
                <div>batch size: {setting.batch_size}</div>
                <Slider
                  min={1}
                  max={100}
                  step={1}
                  value={setting.batch_size}
                  onChange={handleInputChangeBatchSize}
                />
              </div>
            </div>
            <div className="flex justify-center mx-5">
              <div className="mr-5 pr-5 border-r w-1/4">
                <div>
                  <div>
                    λ<sub>B</sub>: {setting.default_lambda_B}
                  </div>
                  <Slider
                    min={1}
                    max={100}
                    step={0.1}
                    value={setting.default_lambda_B}
                    onChange={handleInputChangeLambdaB}
                  />
                </div>
                <div>
                  <div>
                    R<sub>B</sub>: {setting.R_B}
                  </div>
                  <Slider
                    min={0.1}
                    max={5}
                    step={0.1}
                    value={setting.R_B}
                    onChange={handleInputChangeLambdaRatioB}
                  />
                </div>
                <hr className="my-3" />
                <div>
                  <div>
                    θ<sub>B</sub>: {setting.default_theta_B}
                  </div>
                  <Slider
                    min={1}
                    max={100}
                    step={0.1}
                    value={setting.default_theta_B}
                    onChange={handleInputChangeThetaB}
                  />
                </div>
                <div>
                  <div>
                    R<sub>B</sub>: {setting.R_theta_B}
                  </div>
                  <Slider
                    min={0.1}
                    max={5}
                    step={0.1}
                    value={setting.R_theta_B}
                    onChange={handleInputChangeThetaRatioB}
                  />
                </div>
                <hr className="my-3" />
                <div>
                  <div>
                    μ<sub>B</sub>: {setting.mu_B}
                  </div>
                  <Slider
                    min={1}
                    max={100}
                    step={0.01}
                    value={setting.mu_B}
                    onChange={handleInputChangeMuB}
                  />
                </div>
              </div>
              <div className="w-1/4">
                <div>
                  <div>
                    λ<sub>A</sub>: {setting.default_lambda_A}
                  </div>
                  <Slider
                    min={1}
                    max={100}
                    step={0.1}
                    value={setting.default_lambda_A}
                    onChange={handleInputChangeLambdaA}
                  />
                </div>
                <div>
                  <div>
                    R<sub>A</sub>: {setting.R_A}
                  </div>
                  <Slider
                    min={0.1}
                    max={5}
                    step={0.1}
                    value={setting.R_A}
                    onChange={handleInputChangeLambdaRatioA}
                  />
                </div>
                <hr className="my-3" />
                <div>
                  <div>
                    θ<sub>A</sub>: {setting.default_theta_A}
                  </div>
                  <Slider
                    min={1}
                    max={100}
                    step={0.1}
                    value={setting.default_theta_A}
                    onChange={handleInputChangeThetaA}
                  />
                </div>
                <div>
                  <div>
                    R<sub>A</sub>: {setting.R_theta_A}
                  </div>
                  <Slider
                    min={0.1}
                    max={5}
                    step={0.1}
                    value={setting.R_theta_A}
                    onChange={handleInputChangeThetaRatioA}
                  />
                </div>
                <hr className="my-3" />
                <div>
                  <div>
                    μ<sub>A</sub>: {setting.mu_A}
                  </div>
                  <Slider
                    min={1}
                    max={100}
                    step={0.01}
                    value={setting.mu_A}
                    onChange={handleInputChangeMuA}
                  />
                </div>
              </div>
            </div>
          </div>
        </TabPane>
        <TabPane tab="Model (2)" key="2">
          <div>
            <div className="flex justify-center mx-5 border-b pb-3">
              <div className="mr-5 pr-5 w-1/2">
                <div>n: {setting.n}</div>
                <Slider
                  min={1}
                  max={100}
                  step={1}
                  value={setting.n}
                  onChange={handleInputChangeN}
                />
              </div>
              <div className="w-1/2">
                <div>p: {setting.p}</div>
                <Slider
                  min={0}
                  max={1}
                  step={0.01}
                  value={setting.p}
                  onChange={handleInputChangeP}
                />
              </div>
            </div>
            <div className="flex justify-center mx-5 mt-3">
              <div className="mr-5 pr-5 border-r w-1/2">
                <div>
                  <div>
                    α<sub>B</sub>: {setting.default_alpha_B}
                  </div>
                  <Slider
                    min={1}
                    max={10}
                    step={0.01}
                    value={setting.default_alpha_B}
                    onChange={handleInputChangeAlphaB}
                  />
                </div>
                <div>
                  <div>
                    k<sub>B</sub>: {setting.default_lambda_B_K}
                  </div>
                  <Slider
                    min={1}
                    max={10}
                    step={0.01}
                    value={setting.default_lambda_B_K}
                    onChange={handleInputChangeLambdaBK}
                  />
                </div>
                {/* <div>
                  <div>
                    R<sub>B</sub>: {setting.R_B}
                  </div>
                  <Slider
                    min={0.1}
                    max={5}
                    step={0.1}
                    value={setting.R_B}
                    onChange={handleInputChangeLambdaRatioB}
                  />
                </div> */}
                <hr className="my-3" />
                <div>
                  <div>
                    θ<sub>B</sub>: {setting.default_theta_B}
                  </div>
                  <Slider
                    min={1}
                    max={100}
                    step={0.1}
                    value={setting.default_theta_B}
                    onChange={handleInputChangeThetaB}
                  />
                </div>
                <div>
                  <div>
                    R<sub>B</sub>: {setting.R_theta_B}
                  </div>
                  <Slider
                    min={0.1}
                    max={5}
                    step={0.1}
                    value={setting.R_theta_B}
                    onChange={handleInputChangeThetaRatioB}
                  />
                </div>
                <hr className="my-3" />
                <div>
                  <div>
                    μ<sub>B</sub>: {setting.mu_B}
                  </div>
                  <Slider
                    min={1}
                    max={100}
                    step={0.01}
                    value={setting.mu_B}
                    onChange={handleInputChangeMuB}
                  />
                </div>
              </div>
              <div className="w-1/2">
                <div>
                  <div>
                    α<sub>A</sub>: {setting.default_alpha_A}
                  </div>
                  <Slider
                    min={1}
                    max={10}
                    step={0.01}
                    value={setting.default_alpha_A}
                    onChange={handleInputChangeAlphaA}
                  />
                </div>
                <div>
                  <div>
                    k<sub>A</sub>: {setting.default_lambda_A_K}
                  </div>
                  <Slider
                    min={1}
                    max={10}
                    step={0.01}
                    value={setting.default_lambda_A_K}
                    onChange={handleInputChangeLambdaAK}
                  />
                </div>
                {/* <div>
                  <div>
                    R<sub>A</sub>: {setting.R_A}
                  </div>
                  <Slider
                    min={0.1}
                    max={5}
                    step={0.1}
                    value={setting.R_A}
                    onChange={handleInputChangeLambdaRatioA}
                  />
                </div> */}
                <hr className="my-3" />
                <div>
                  <div>
                    θ<sub>A</sub>: {setting.default_theta_A}
                  </div>
                  <Slider
                    min={1}
                    max={100}
                    step={0.1}
                    value={setting.default_theta_A}
                    onChange={handleInputChangeThetaA}
                  />
                </div>
                <div>
                  <div>
                    R<sub>A</sub>: {setting.R_theta_A}
                  </div>
                  <Slider
                    min={0.1}
                    max={5}
                    step={0.1}
                    value={setting.R_theta_A}
                    onChange={handleInputChangeThetaRatioA}
                  />
                </div>
                <hr className="my-3" />
                <div>
                  <div>
                    μ<sub>A</sub>: {setting.mu_A}
                  </div>
                  <Slider
                    min={1}
                    max={100}
                    step={0.01}
                    value={setting.mu_A}
                    onChange={handleInputChangeMuA}
                  />
                </div>
              </div>
            </div>
          </div>
        </TabPane>
      </Tabs>
      <hr className="my-3" />
      <div className="">
        <Title className="mt-4 mb-3" level={5}>
          Q1 數值表格
        </Title>
        <div className="flex justify-center">
          <div className="w-1/3">
            <div className="flex justify-center">
              <div className="w-3/4">
                <div>s: {setting.s}</div>
                <Slider
                  min={1}
                  max={5}
                  step={1}
                  value={setting.s}
                  onChange={handleInputChangeS}
                />
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-3/4">
                <div>max_a: {setting.max_a}</div>
                <Slider
                  min={1}
                  max={100}
                  step={1}
                  value={setting.max_a}
                  onChange={handleInputChangeMaxA}
                />
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-3/4">
                <div>max_b: {setting.max_b}</div>
                <Slider
                  min={1}
                  max={100}
                  step={1}
                  value={setting.max_b}
                  onChange={handleInputChangeMaxB}
                />
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-3/4">
                <div>gap: {setting.gap}</div>
                <Slider
                  min={1}
                  max={10}
                  step={1}
                  value={setting.gap}
                  onChange={handleInputChangeGap}
                />
              </div>
            </div>
          </div>

          <Table
            bordered
            className="w-2/3"
            dataSource={table.dataSource}
            columns={table.columns}
        // columns={[
        //   {
        //     title: "訂單 ID",
        //     dataIndex: "orderId",
        //     render: (data) => <span>{data || "NULL"}</span>,
        //     key: Math.random(),
        //   },
        //   {
        //     title: "投資 ID",
        //     dataIndex: "investorId",
        //     key: Math.random(),
        //   },
        //   {
        //     title: "股票 ID",
        //     dataIndex: "stockId",
        //     key: Math.random(),
        //   },
        //   {
        //     title: "類型",
        //     dataIndex: "method",
        //     render: (data) => <span>{data ? "sell" : "buy"}</span>,
        //     key: Math.random(),
        //   },
        //   {
        //     title: "副類型",
        //     dataIndex: "subMethod",
        //     render: (data) => (
        //       <span>{data ? "UPDATE" : data === null ? "NULL" : "CANCEL"}</span>
        //     ),
        //     key: Math.random(),
        //   },
        //   {
        //     title: "價格",
        //     dataIndex: "price",
        //     key: Math.random(),
        //   },
        //   {
        //     title: "數量",
        //     dataIndex: "quantity",
        //     key: Math.random(),
        //   },
        //   {
        //     title: "價格類型",
        //     dataIndex: "priceType",
        //     render: (data) => <span>{data ? "LIMIT" : "MARKET"}</span>,
        //     key: Math.random(),
        //   },
        //   {
        //     title: "狀態",
        //     dataIndex: "status",
        //     render: (data) => <span>{data ? "FULL" : "PARTIAL"}</span>,
        //     key: Math.random(),
        //   },
        //   {
        //     title: "時間限制",
        //     dataIndex: "timeRestriction",
        //     render: (data) => (
        //       <span>{data ? "IOC" : data === 2 ? "FOK" : "ROD"}</span>
        //     ),
        //     key: Math.random(),
        //   },
        //   {
        //     title: "委託時間",
        //     dataIndex: "createdTime",
        //     width: 200,
        //     render: (data) => (
        //       <span>{dayjs(data).format("YYYY/MM/DD HH:mm:ss")}</span>
        //     ),
        //     key: Math.random(),
        //   },
        // ]}
        // dataSource={orederData}
        // pagination={{
        //   pageSize: pageSize,
        //   total: totalSize,
        //   onChange: (page) => {
        //     setPage(page);
        //   },
        //   onShowSizeChange: (cur, size) => {
        //     setPageSize(size);
        //   },
        // }}
        sticky
      />

        </div>
      </div>
    </div>
  );
}
