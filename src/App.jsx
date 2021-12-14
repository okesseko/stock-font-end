import "antd/dist/antd.css";

import { HashRouter, Redirect, Route, Switch } from "react-router-dom";

import AutoChart from "./pages/auto-chart";
import Case from "./pages/case";
import EchartExample from "./pages/echart-example";
import FrequentData from "./pages/frequent-data";
import RealDataUpload from "./pages/real-data-upload";
import Simulator from "./pages/simulator";
import Main from "./pages/main";
import OrderTable from "./pages/table/order-table";
import PriceTable from "./pages/table/price-table";
import QuickOrder from "./pages/quick-order";
import ReplayChart from "./pages/replay";
import Stock from "./pages/stock";
import Login from "./pages/login";
import Q1Chart from "./pages/Q1-chart";
import RoleManagement from "./pages/role-manage";
import RouterLink from "./component/router-link";
import InvestorManagement from "./pages/investor-manage";

import { useEffect, useState } from "react";
import { settingToken } from "./environment/api";
const events = require("events");

export const appEventEmitter = new events.EventEmitter();

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
    appEventEmitter.on("unauthorization", (msg) => {
      localStorage.removeItem("token");
      setAuth(false);
    });
  }, []);
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
            <GuardedRoute path="/stock-font-end/Q1-chart" component={Q1Chart} />
            <GuardedRoute
              path="/stock-font-end/order-table"
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
            <GuardedRoute
              path="/stock-font-end/simulator"
              component={Simulator}
            />
            <GuardedRoute path="/stock-font-end/stock" component={Stock} />
            <GuardedRoute
              path="/stock-font-end/role-management"
              component={RoleManagement}
            />
            <GuardedRoute
              path="/stock-font-end/investor-management"
              component={InvestorManagement}
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
