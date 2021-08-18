import axios from "axios";

export const defaultAxios = axios.create({
  baseURL: "http://220.141.191.40:8080/",
});

// api

export const api = {
  getOrder: { url: "api/order", method: "GET" },
  postOrder: { url: "api/order", method: "POST" },
  deleteOrder: { url: "api/order", method: "DELETE" },
  getDisplay: { url: "api/display", method: "GET" },
  getDisplayChart: { url: "api/display/chart", method: "GET" },
  getTransaction: { url: "api/transaction", method: "GET" },
  resetStock: { url: "api/stock/reset", method: "PUT" },
  getFrequentData: { url: "api/frequentData", method: "GET" },
  downloadFrequentData: { url: "api/frequentData/download", method: "GET" },
};
