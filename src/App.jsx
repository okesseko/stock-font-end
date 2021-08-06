import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Main from "./pages/main";
import EchartExample from "./pages/echart-example";
import AutoChart from "./pages/auto-chart";
import RouterLink from "./component/router-link";
import OrderTable from "./pages/table/order-table";
import PriceTable from "./pages/table/price-table";
import "antd/dist/antd.css";
const App = () => {
  return (
    <BrowserRouter>
      <div className="flex ">
        <RouterLink />
        <div className="flex-1 my-10 ">
          <Switch>
            <Route path="/" exact component={Main} />
            <Route path="/echart-example" component={EchartExample} />
            <Route path="/auto-chart" component={AutoChart} />
            <Route path="/oreder-table" component={OrderTable} />
            <Route path="/price-table" component={PriceTable} />
            <Route path="/404" component={() => <div>page not find</div>} />
            <Redirect from="*" to="/404" />
          </Switch>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
