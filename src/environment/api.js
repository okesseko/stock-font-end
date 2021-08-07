import axios from "axios";

export const defaultAxios = axios.create({
  baseURL: "http://220.141.189.242:8080/",
});

// api

export const api = {
  getOrder: { url: "api/order", method: "GET" },
  postOrder: { url: "api/order", method: "POST" },
  deleteOrder: { url: "api/order", method: "DELETE" },
  getDisplay: { url: "api/display", method: "GET" },
  getTransaction: { url: "api/transaction", method: "GET" },
};
