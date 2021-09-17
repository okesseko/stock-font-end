import "antd/dist/antd.css";

import { HashRouter, Redirect, Route, Switch } from "react-router-dom";

import AutoChart from "./pages/auto-chart";
import Case from "./pages/case";
import EchartExample from "./pages/echart-example";
import FrequentData from "./pages/frequent-data";
import RealDataUpload from "./pages/real-data-upload";
import Main from "./pages/main";
import OrderTable from "./pages/table/order-table";
import PriceTable from "./pages/table/price-table";
import QuickOrder from "./pages/quick-order";
import ReplayChart from "./pages/replay";
import Login from "./pages/login";
import RouterLink from "./component/router-link";
import { useEffect, useState } from "react";
import { settingToken } from "./environment/api";

const App = () => {
  const [auth, setAuth] = useState(!!localStorage.getItem("token"));
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const GuardedRoute = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={(props) =>
        auth ? (
          <Component {...props} />
        ) : (
          <Redirect to="/stock-font-end/login/" />
        )
      }
    />
  );
  useEffect(() => {
    setAuth(!!token);
    settingToken(token);
  }, [token]);
  return (
    <HashRouter>
      <div className="flex ">
        {auth && <RouterLink setToken={setToken} />}
        <div className="flex-1 my-10 ">
          <Switch>
            <Route
              path="/stock-font-end/login/"
              component={() => <Login setToken={setToken} />}
            />
            <GuardedRoute path="/stock-font-end/" exact component={Main} />
            <GuardedRoute
              path="/stock-font-end/echart-example"
              component={EchartExample}
            />
            <GuardedRoute
              path="/stock-font-end/auto-chart"
              component={AutoChart}
            />
            <GuardedRoute
              path="/stock-font-end/replay-chart"
              component={ReplayChart}
            />
            <GuardedRoute
              path="/stock-font-end/oreder-table"
              component={OrderTable}
            />
            <GuardedRoute
              path="/stock-font-end/price-table"
              component={PriceTable}
            />
            <GuardedRoute
              path="/stock-font-end/quick-order"
              component={QuickOrder}
            />
            <GuardedRoute path="/stock-font-end/case" component={Case} />
            <GuardedRoute
              path="/stock-font-end/frequent-data"
              component={FrequentData}
            />
            <GuardedRoute
              path="/stock-font-end/real-data-upload"
              component={RealDataUpload}
            />
            <Redirect
              from="*"
              to={auth ? "/stock-font-end/" : "/stock-font-end/login"}
            />
          </Switch>
        </div>
      </div>
    </HashRouter>
  );
};

export default App;
