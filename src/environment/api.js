import axios from "axios";

export const defaultAxios = axios.create({
  baseURL: "http://zj-lin.tw:8080/",
});

// api

export const api = {
  getOrder: { url: "api/order", method: "GET" },
  postOrder: { url: "api/order", method: "POST" },
  deleteOrder: { url: "api/order", method: "DELETE" },
  getDisplay: { url: "api/display", method: "GET" },
  getTransaction: { url: "api/transaction", method: "GET" },
  resetStock: { url: "api/stock/reset", method: "PUT" },
};
