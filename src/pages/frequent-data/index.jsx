import React, { useState } from "react";
import { defaultAxios, api } from "../../environment/api";
import dayjs from "dayjs";
import { Button, DatePicker, Input } from "antd";

const FrequentData = function () {
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [stockId, setStockId] = useState();
  return (
    <div>
      <div style={{ display: "flex", flexDirection: "row", padding: "20px" }}>
        <Input
          style={{ width: "100px" }}
          type="number"
          max={10}
          min={1}
          value={stockId}
          step={1}
          onChange={(e) => {
            setStockId(e.target.value);
          }}
        />
        <DatePicker
          showTime
          placeholder="選擇開始時間"
          disabledDate={(current) => current && current > dayjs()}
          onChange={(time) => {
            if (time) setStartTime(dayjs(time).toISOString());
            else setStartTime(time);
          }}
        />
        <DatePicker
          showTime
          placeholder="選擇結束時間"
          disabledDate={(current) => current && current > dayjs()}
          onChange={(time) => {
            if (time) setEndTime(dayjs(time).toISOString());
            else setEndTime(time);
          }}
        />
      </div>
      <div style={{ paddingLeft: "20px" }}>
        <Button
          onClick={() => {
            defaultAxios({
              url: api.getFrequentData.url,
              method: api.getFrequentData.method,
              params: {
                createdTime: JSON.stringify({ max: endTime, min: startTime }),
                stockId,
              },
            }).then(({ data }) => console.log(data));
          }}
        >
          GET JSON
        </Button>
        <Button
          onClick={() => {
            defaultAxios({
              url: api.downloadFrequentData.url,
              method: api.downloadFrequentData.method,
              params: {
                createdTime: JSON.stringify({
                  max: endTime,
                  min: startTime,
                }),
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
          }}
        >
          DOWNLOAD CSV
        </Button>
      </div>
    </div>
  );
};

export default FrequentData;
