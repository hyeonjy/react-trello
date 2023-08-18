import { HashRouter, BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./Home";

interface IRouterProps {}

function Router({}: IRouterProps) {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
export default Router;
