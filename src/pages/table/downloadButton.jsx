import { Button } from "antd";
import React from "react";
import { api, defaultAxios } from "../../environment/api";

const DownloadButton = ({ type }) => {
  function download() {
    const apiName = type === "order" ? "getOrder" : "getTransaction";
    defaultAxios({
      url: api[apiName].url,
      method: api[apiName].method,
    }).then((res) => {
      const content = res.data.content;
      const key = Object.keys(content[0]).join(",") + "\n";
      const csvFile = content.reduce(
        (pre, cur) => pre + Object.values(cur).join(",") + "\n",
        key
      );
      const fileName = `${type}_` + new Date().getTime() + ".csv";
      const link = document.createElement("a");
      link.setAttribute(
        "href",
        "data:text/csv;charset=utf-8,%EF%BB%BF" + encodeURI(csvFile)
      );
      link.setAttribute("download", fileName);
      link.click();
    });
  }

  return (
    <Button type="primary" onClick={download}>
      Download CSV
    </Button>
  );
};

export default DownloadButton;
