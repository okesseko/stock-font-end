import { defaultAxios, api } from "../../../environment/api";

function nextExponential(lambda) {
  if ("number" !== typeof lambda) {
    throw new TypeError("nextExponential: lambda must be number.");
  }
  if (lambda <= 0) {
    throw new TypeError("nextExponential: " + "lambda must be greater than 0.");
  }
  return -Math.log(1 - Math.random()) / lambda;
}

function lowestValueAndKey(obj) {
  let [lowestItems] = Object.entries(obj).sort(([, v1], [, v2]) => v1 - v2);
  return [lowestItems[0], lowestItems[1]];
}

function geometricDistribution(min, max, prob) {
  let q = 0;
  let p = Math.pow(prob, 1 / (max - min));
  while (true) {
    q = Math.ceil(Math.log(1 - Math.random()) / Math.log(p)) + (min - 1);
    if (q <= max) {
      return q;
    }
  }
}

function getBatches() {
  let batch_size = 10;
  let p = 0.2;
  return geometricDistribution(1, batch_size, p);
}

let default_lambda_B = 10;
let default_lambda_A = 10;
let R_B = 0.8;
let R_A = 0.8;
let default_theta_B = 10;
let default_theta_A = 10;
let R_theta_B = 0.8;
let R_theta_A = 0.8;
let mu_B = 10;
let mu_A = 10;
let lowest;
let next;
let final_price = 100;

let timer;
let method;
let price;
let quantity;
let priceType;

function renderData() {
  defaultAxios({
    url: api.getDisplay.url,
    method: api.getDisplay.method,
    params: {
      tickRange: final_price,
    },
  }).then((res) => {
    const datas = res.data;
    console.log("datas", datas);
    timer = setTimeout(function tick() {
      let T = {};

      var count = 0;
      datas.forEach(function (data) {
        let lambda_B = default_lambda_B * Math.pow(R_B, count - 1);
        let theta_B = default_theta_B * Math.pow(R_theta_B, count - 1);
        T["LB" + data] = nextExponential(lambda_B);
        T["CB" + data] = nextExponential(theta_B);
        count++;
      });
      count = 0;
      datas.forEach(function (data) {
        let lambda_A = default_lambda_A * Math.pow(R_A, count - 1);
        let theta_A = default_theta_A * Math.pow(R_theta_A, count - 1);
        T["LA" + data] = nextExponential(lambda_A);
        T["CA" + data] = nextExponential(theta_A);
        count++;
      });

      T["MB"] = nextExponential(mu_B);
      T["MS"] = nextExponential(mu_A);

      lowest = lowestValueAndKey(T);
      next = lowest[1] * 1000 * 1000;

      let kind = lowest[0].substring(0, 1);
      let type = lowest[0].substring(1, 2);

      switch (kind) {
        // 限價單
        case "L":
          if (type == "B") {
            method = 0; // BUY = 0, SELL = 1
          } else if (type == "A") {
            method = 1; // BUY = 0, SELL = 1
          }
          price = lowest[0].substring(2, 10);
          quantity = getBatches();
          priceType = 1; // MARKET = 0, LIMIT = 1

          sendOrderApi({
            investorId: 1,
            stockId: 1,
            method: method, // BUY = 0, SELL = 1
            price: price,
            quantity: quantity,
            priceType: priceType, // MARKET = 0, LIMIT = 1
            timeRestriction: 0, // ROD = 0, IOC = 1, FOK = 2
          });
          break;

        // 市價單
        case "M":
          if (type == "B") {
            method = 0; // BUY = 0, SELL = 1
          } else if (type == "S") {
            method = 1; // BUY = 0, SELL = 1
          }
          price = 0;
          quantity = getBatches();
          priceType = 1; // MARKET = 0, LIMIT = 1

          sendOrderApi({
            investorId: 1,
            stockId: 1,
            method: method, // BUY = 0, SELL = 1
            price: price,
            quantity: quantity,
            priceType: priceType, // MARKET = 0, LIMIT = 1
            timeRestriction: 0, // ROD = 0, IOC = 1, FOK = 2
          });
          break;

        // 取消單
        case "C":
          defaultAxios({
            url: api.getOrder.url,
            method: api.getOrder.method,
          }).then((res) => {
            const orderData = res.data;
            console.log("order datas", orderData);
            let randomProperty = function (obj) {
              let keys = Object.keys(obj);
              return obj[keys[(keys.length * Math.random()) << 0]];
            };
            console.log("randomProperty", randomProperty(orderData.content));
            quantity = getBatches();

            sendCancelApi({
              id: randomProperty(orderData.content).id,
              quantity: quantity,
            });
          });

          break;
      }

      timer = setTimeout(tick, next); // (*)
    }, 1000);
  });
}

function sendOrderApi(data) {
  console.log("sendData", data);
  defaultAxios({
    url: api.postOrder.url,
    method: api.postOrder.method,
    data: {
      investorId: data.investorId,
      stockId: data.stockId,
      method: data.method, // BUY = 0, SELL = 1
      price: data.price,
      quantity: data.quantity,
      priceType: data.priceType, // MARKET = 0, LIMIT = 1
      timeRestriction: data.timeRestriction, // ROD = 0, IOC = 1, FOK = 2
    },
  }).then((res) => {
    console.log(res.data);
  });

  //   fetch("http://220.141.212.175:8080/api/order", {
  //     method: "POST",
  //     mode: "cors",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       investorId: data.investorId,
  //       stockId: data.stockId,
  //       method: data.method, // BUY = 0, SELL = 1
  //       price: data.price,
  //       quantity: data.quantity,
  //       priceType: data.priceType, // MARKET = 0, LIMIT = 1
  //       timeRestriction: data.timeRestriction, // ROD = 0, IOC = 1, FOK = 2
  //     }),
  //   })
  //     .then((response) => {
  //       return response.json();
  //     })
  //     .then((data) => console.log("data", data));
}

function sendCancelApi(data) {
  console.log("cancelData", data);
  defaultAxios({
    url: api.deleteOrder.url,
    method: api.deleteOrder.method,
    data: {
      investorId: data.investorId,
      stockId: data.stockId,
      method: data.method, // BUY = 0, SELL = 1
      price: data.price,
      quantity: data.quantity,
      priceType: data.priceType, // MARKET = 0, LIMIT = 1
      timeRestriction: data.timeRestriction, // ROD = 0, IOC = 1, FOK = 2
    },
  }).then((res) => {
    console.log(res.data);
  });
  //   fetch("http://220.141.212.175:8080/api/order", {
  //     method: "DELETE",
  //     mode: "cors",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       investorId: data.investorId,
  //       stockId: data.stockId,
  //       method: data.method, // BUY = 0, SELL = 1
  //       price: data.price,
  //       quantity: data.quantity,
  //       priceType: data.priceType, // MARKET = 0, LIMIT = 1
  //       timeRestriction: data.timeRestriction, // ROD = 0, IOC = 1, FOK = 2
  //     }),
  //   })
  //     .then((response) => {
  //       return response.json();
  //     })
  //     .then((data) => console.log("data", data));
}

export const mathRenderData = renderData();
