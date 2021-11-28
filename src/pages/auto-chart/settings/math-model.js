import { defaultAxios, api } from "../../../environment/api";
import errorNotification from "../../../utils/errorNotification";

function nextExponential(lambda) {
  // if ("number" !== typeof lambda) {
  //   throw new TypeError("nextExponential: lambda must be number.");
  // }
  lambda = Number(lambda);

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

function getBatches(batch_size) {
  let p = 0.2;
  return geometricDistribution(1, batch_size, p);
}

function sendOrderApi(data) {
  // console.log("sendData", data);
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
      subMethod: data.subMethod,
    },
  }).catch((err) => {
    errorNotification(err?.response?.data);
  });
}

export const renderData = function (params, q, content, firstTime, stockId) {
  let current_tab = params.current_tab;
  let default_alpha_B = params.default_alpha_B;
  let default_alpha_A = params.default_alpha_A;
  let default_lambda_B = params.default_lambda_B;
  let default_lambda_B_K = params.default_lambda_B_K;
  let default_lambda_A = params.default_lambda_A;
  let default_lambda_A_K = params.default_lambda_A_K;
  let R_B = params.R_B;
  let R_A = params.R_A;
  let default_theta_B = params.default_theta_B;
  let default_theta_A = params.default_theta_A;
  let R_theta_B = params.R_theta_B;
  let R_theta_A = params.R_theta_A;
  let mu_B = params.mu_B;
  let mu_A = params.mu_A;
  let batch_size = params.batch_size;
  let s = params.s;
  let max_a = params.max_a;
  let max_b = params.max_b;
  let gap = params.gap;

  let array_a = q.array_a;
  let array_b = q.array_b;
  let q1_array = q.q1_array;

  let T = {};
  var count = 0;

  const firstOrderSellPrice =
    content.firstOrderSellPrice == null
      ? content.matchPrice
      : content.firstOrderSellPrice;
  const firstOrderBuyPrice =
    content.firstOrderBuyPrice == null
      ? content.matchPrice
      : content.firstOrderBuyPrice;
  let buyLeftQueue = [];
  let buyRightQueue = [];
  let sellLeftQueue = [];
  let sellRightQueue = [];
  content.tickRange.forEach(function (data) {
    if (data.price < firstOrderSellPrice) {
      buyLeftQueue.push(data.price);
    }
    if (data.price < firstOrderBuyPrice) {
      sellLeftQueue.push(data.price);
    }
  });
  let newTickRange = JSON.parse(JSON.stringify(content.tickRange));
  newTickRange = newTickRange.sort((a, b) => a.price - b.price);
  newTickRange.forEach(function (data) {
    if (data.price > firstOrderSellPrice) {
      buyRightQueue.push(data.price);
    }
    if (data.price > firstOrderBuyPrice) {
      sellRightQueue.push(data.price);
    }
  });

  count = 0;
  buyLeftQueue.forEach(function (price) {
    let lambda_B = default_lambda_B * Math.pow(R_B, count);
    let theta_B = default_theta_B * Math.pow(R_theta_B, count);
    if (current_tab == 2) {
      lambda_B = default_lambda_B_K / Math.pow(count+1, default_alpha_B);
    }
    T["LB" + price] = nextExponential(lambda_B);
    T["CB" + price] = nextExponential(theta_B);
    count++;
  });
  count = 0;
  buyRightQueue.forEach(function (price) {
    let lambda_B = default_lambda_B * Math.pow(R_B, count);
    let theta_B = default_theta_B * Math.pow(R_theta_B, count);
    if (current_tab == 2) {
      lambda_B = default_lambda_B_K / Math.pow(count+1, default_alpha_B);
    }
    T["LB" + price] = nextExponential(lambda_B);
    T["CB" + price] = nextExponential(theta_B);
    count++;
  });
  count = 0;
  sellLeftQueue.forEach(function (price) {
    let lambda_A = default_lambda_A * Math.pow(R_A, count);
    let theta_A = default_theta_A * Math.pow(R_theta_A, count);
    if (current_tab == 2) {
      lambda_A = default_lambda_A_K / Math.pow(count+1, default_alpha_A);
    }
    T["LA" + price] = nextExponential(lambda_A);
    T["CA" + price] = nextExponential(theta_A);
    count++;
  });
  count = 0;
  sellRightQueue.forEach(function (price) {
    let lambda_A = default_lambda_A * Math.pow(R_A, count);
    let theta_A = default_theta_A * Math.pow(R_theta_A, count);
    if (current_tab == 2) {
      lambda_A = default_lambda_A_K / Math.pow(count+1, default_alpha_A);
    }
    T["LA" + price] = nextExponential(lambda_A);
    T["CA" + price] = nextExponential(theta_A);
    count++;
  });

  T["MB"] = nextExponential(mu_B);
  T["MS"] = nextExponential(mu_A);

  let lowest = lowestValueAndKey(T);
  let next = lowest[1] * 1000 * 100;

  let kind = lowest[0].substring(0, 1);
  let type = lowest[0].substring(1, 2);

  function checkMidPrice() {
    q1_array.forEach((element, key) => {
      let check = true;
      for (const value of Object.entries(element)) {
        if (value == false) {
          check = false;
        }
      }
      if (check == true && q1_array[key].midprice == 0) {
        q1_array[key].midprice = (element.b_price + element.a_price) / 2;
      } else if (check == true && q1_array[key].midprice != 0) {
        
      }
    });

    console.log('q1_array', q1_array);
  }

  // console.log("T", T);

  if (!firstTime)
    switch (kind) {
      // 限價單
      case "L":
        // console.log("Limit order");
        let price = Number(lowest[0].substring(2, 10));
        let quantity = getBatches(batch_size);
        sendOrderApi({
          investorId: null,
          stockId,
          method: type == "B" ? 0 : 1, // BUY = 0, SELL = 1
          price: price,
          quantity: quantity,
          priceType: 1, // MARKET = 0, LIMIT = 1
          timeRestriction: 0, // ROD = 0, IOC = 1, FOK = 2
        });

        if (type == "B") {
          if (array_b.find(element => element == quantity) != undefined) {
            q1_array.forEach((element, key) => {
              if (Object.keys(element)[0] == quantity) {
                q1_array[key][quantity] = true;
                q1_array[key].b_price = price;
              }
            })
          }
        } else {
          if (array_a.find(element => element == quantity) != undefined) {
            q1_array.forEach((element, key) => {
              if (Object.keys(element)[1] == quantity) {
                q1_array[key][quantity] = true;
                q1_array[key].a_price = price;
              }
            })
          }
        }

        checkMidPrice();
        break;

      // 市價單
      case "M":
        // console.log("Market order");
        sendOrderApi({
          investorId: null,
          stockId,
          method: type == "B" ? 0 : 1, // BUY = 0, SELL = 1
          price: 0,
          quantity: getBatches(batch_size),
          priceType: 0, // MARKET = 0, LIMIT = 1
          timeRestriction: 0, // ROD = 0, IOC = 1, FOK = 2
        });
        break;

      // 取消單
      case "C":
        defaultAxios({
          url: api.getOrder.url,
          method: api.getOrder.method,
        })
          .then((res) => {
            const orderData = res.data;
            // console.log("order datas", orderData);
            let content = orderData.content.filter(function (data) {
              return data.price == lowest[0].substring(2, 10);
            });

            let randomProperty = function (obj) {
              let keys = Object.keys(obj);
              return obj[keys[(keys.length * Math.random()) << 0]];
            };
            let random = randomProperty(content);
            if (random) {
              // console.log("randomProperty", random);
              // console.log("random", random);
              // console.log(random.price, random.priceType);
              sendOrderApi({
                investorId: null,
                stockId,
                method: random.method, // BUY = 0, SELL = 1
                price: random.price,
                quantity: random.quantity,
                priceType: random.priceType, // MARKET = 0, LIMIT = 1
                timeRestriction: random.timeRestriction, // ROD = 0, IOC = 1, FOK = 2
                subMethod: 0,
              });
            }
          })
          .catch((err) => {
            errorNotification(err?.response?.data);
          });

        break;
    }
  return next;
};
