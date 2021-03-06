import { defaultAxios, api } from "../../../environment/api";

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
    },
  }).then((res) => {
    // console.log(res.data);
  });
}

function sendCancelApi(data) {
  // console.log("cancelData", data);
  defaultAxios({
    url: api.deleteOrder.url,
    method: api.deleteOrder.method,
    data: {
      id: data.id,
      quantity: data.quantity,
    },
  }).then((res) => {
    // console.log(res.data);
  });
}

export const renderData = function (params, content) {
  let default_lambda_B = params.default_lambda_B;
  let default_lambda_A = params.default_lambda_A;
  let R_B = params.R_B;
  let R_A = params.R_A;
  let default_theta_B = params.default_theta_B;
  let default_theta_A = params.default_theta_A;
  let R_theta_B = params.R_theta_B;
  let R_theta_A = params.R_theta_A;
  let mu_B = params.mu_B;
  let mu_A = params.mu_A;
  let batch_size = params.batch_size;

  let T = {};
  var count = 0;

  const firstOrderSellPrice = (content.firstOrderSellPrice == null) ? content.matchPrice : content.firstOrderSellPrice;
  const firstOrderBuyPrice = (content.firstOrderBuyPrice == null) ? content.matchPrice : content.firstOrderBuyPrice;
  let buyLeftQueue = [];
  let buyRightQueue = [];
  let sellLeftQueue = [];
  let sellRightQueue = [];
  content.tickRange.forEach(function (data) {
    if (data.price < firstOrderBuyPrice) {
      buyLeftQueue.push(data.price);
    }
    if (data.price < firstOrderSellPrice) {
      sellLeftQueue.push(data.price);
    }
  });
  let newTickRange = JSON.parse(JSON.stringify(content.tickRange))
  newTickRange = newTickRange.sort((a, b) => a.price - b.price)
  newTickRange.forEach(function (data) {
    if (data.price > firstOrderBuyPrice) {
      buyRightQueue.push(data.price);
    }
    if (data.price > firstOrderSellPrice) {
      sellRightQueue.push(data.price);
    }
  });

  count = 0;
  buyLeftQueue.forEach(function(price) {
    let lambda_B = default_lambda_B * Math.pow(R_B, count);
    let theta_B = default_theta_B * Math.pow(R_theta_B, count);
    T["LB" + price] = nextExponential(lambda_B);
    T["CB" + price] = nextExponential(theta_B);
    count++;
  })
  count = 0;
  buyRightQueue.forEach(function(price) {
    let lambda_B = default_lambda_B * Math.pow(R_B, count);
    let theta_B = default_theta_B * Math.pow(R_theta_B, count);
    T["LB" + price] = nextExponential(lambda_B);
    T["CB" + price] = nextExponential(theta_B);
    count++;
  })
  count = 0;
  sellLeftQueue.forEach(function(price) {
    let lambda_A = default_lambda_A * Math.pow(R_A, count);
    let theta_A = default_theta_A * Math.pow(R_theta_A, count);
    T["LA" + price] = nextExponential(lambda_A);
    T["CA" + price] = nextExponential(theta_A);
    count++;
  })
  count = 0;
  sellRightQueue.forEach(function(price) {
    let lambda_A = default_lambda_A * Math.pow(R_A, count);
    let theta_A = default_theta_A * Math.pow(R_theta_A, count);
    T["LA" + price] = nextExponential(lambda_A);
    T["CA" + price] = nextExponential(theta_A);
    count++;
  })
  
  T["MB"] = nextExponential(mu_B);
  T["MS"] = nextExponential(mu_A);

  let lowest = lowestValueAndKey(T);
  let next = lowest[1] * 1000 * 100;

  let kind = lowest[0].substring(0, 1);
  let type = lowest[0].substring(1, 2);

  // console.log("T", T);

  switch (kind) {
    // ?????????
    case "L":
      // console.log("Limit order");
      sendOrderApi({
        investorId: 1,
        stockId: 1,
        method: type == "B" ? 0 : 1, // BUY = 0, SELL = 1
        price: Number(lowest[0].substring(2, 10)),
        quantity: getBatches(batch_size),
        priceType: 1, // MARKET = 0, LIMIT = 1
        timeRestriction: 0, // ROD = 0, IOC = 1, FOK = 2
      });
      break;

    // ?????????
    case "M":
      // console.log("Market order");
      sendOrderApi({
        investorId: 1,
        stockId: 1,
        method: type == "B" ? 0 : 1, // BUY = 0, SELL = 1
        price: 0,
        quantity: getBatches(batch_size),
        priceType: 0, // MARKET = 0, LIMIT = 1
        timeRestriction: 0, // ROD = 0, IOC = 1, FOK = 2
      });
      break;

    // ?????????
    case "C":
      defaultAxios({
        url: api.getOrder.url,
        method: api.getOrder.method,
      }).then((res) => {
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

          sendCancelApi({
            id: random.id,
            quantity: getBatches(batch_size),
          });
        }
      });

      break;
  }
  return next;
};
