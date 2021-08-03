import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Main from "./pages/main";
import EchartExample from "./pages/echart-example";
import RouterLink from "./component/router-link";

const App = () => {
  return (
    <BrowserRouter>
      <div className="flex my-10">
        <RouterLink />
        <div className="flex-1">
          <Switch>
            <Route path="/" exact component={Main} />
            <Route path="/echart-example" component={EchartExample} />
            <Route path="/404" component={() => <div>page not find</div>} />
            <Redirect from="*" to="/404" />
          </Switch>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
