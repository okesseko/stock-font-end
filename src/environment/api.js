import axios from "axios";

export const defaultAxios = axios.create({
  baseURL: "http://220.141.182.142:8080/",
});

// api

export const api = {
  getOrder: { url: "api/order", method: "GET" },
  postOrder: { url: "api/order", method: "POST" },
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
  getFrequentData: { url: "api/frequentData", method: "GET" },
  downloadFrequentData: { url: "api/frequentData/download", method: "GET" },
};
