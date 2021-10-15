import axios from "axios";

export const defaultAxios = axios.create({
  baseURL: "http://140.118.118.173:20023/",
});

export function settingToken(token) {
  defaultAxios.defaults.headers.common["token"] = token;
}

// api

export const api = {
  login: { url: "api/investor/login", method: "POST" },
  logout: { url: "api/investor/logout", method: "POST" },

  getOrder: { url: "api/order", method: "GET" },
  postOrder: { url: "api/order", method: "POST" },
  postRealOrder: { url: "api/order/realData", method: "POST" },
  getRealOrder: { url: "api/order/realData", method: "GET" },
  deleteOrder: { url: "api/order", method: "DELETE" },
  getDisplay: { url: "api/display", method: "GET" },
  getDisplayChart: { url: "api/display/chart", method: "GET" },
  getTransaction: { url: "api/transaction", method: "GET" },
  putStock: { url: "api/stock", method: "PUT" },
  resetStock: { url: "api/stock/reset", method: "PUT" },
  getVirtualOrder: { url: "api/virtualOrder", method: "GET" },
  postVirtualOrder: { url: "api/virtualOrder", method: "POST" },
  resetVirtualOrder: { url: "api/virtualOrder", method: "PUT" },
  getVirtualOrderContainer: {
    url: "api/virtualOrder/container",
    method: "GET",
  },

  getContainer: { url: "api/virtualOrder/container", method: "GET" },
  postContainer: { url: "api/virtualOrder/container", method: "POST" },
  putContainer: { url: "api/virtualOrder/container", method: "PUT" },
  deleteContainer: {
    url: "api/virtualOrder/container",
    method: "DELETE",
  },
  getGroup: { url: "api/group", method: "GET" },
  getStock: { url: "api/stock", method: "GET" },

  getRealDataOrderContent: {
    url: "api/real-data/order/content",
    method: "GET",
  },
  getRealDataDisplayContent: {
    url: "api/real-data/display/content",
    method: "GET",
  },
  downloadRealDataDisplayContent: {
    url: "api/real-data/display/download",
    method: "GET",
  },

  getRealDataOrder: { url: "api/real-data/order", method: "GET" },
  postRealDataOrder: { url: "api/real-data/order", method: "POST" },
  putRealDataOrder: { url: "api/real-data/order", method: "PUT" },
  deleteRealDataOrder: { url: "api/real-data/order", method: "DELETE" },
  postRealDataOrderContent: {
    url: "api/real-data/order/content",
    method: "POST",
  },
  getRealDataDisplay: { url: "api/real-data/display", method: "GET" },
  postRealDataDisplay: { url: "api/real-data/display", method: "POST" },
  putRealDataDisplay: { url: "api/real-data/display", method: "PUT" },
  deleteRealDataDisplay: { url: "api/real-data/display", method: "DELETE" },
  postRealDataDisplayContent: {
    url: "api/real-data/display/content",
    method: "POST",
  },
};
