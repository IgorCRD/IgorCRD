import React from "react";
import dynamic from "next/dynamic";
import { Link, Switch, Route } from "react-router-dom";
import Router from "src/App/Router";

const Home = dynamic(() => import("src/Pages/Home"));
const Dashboard = dynamic(() => import("src/Pages/Dashboard"));

class RootRouter extends React.Component {
  static async getInitialProps(context) {
    // calls page's `getInitialProps` and fills `appProps.pageProps`
    const { req } = context;

    return { url: req.url };
  }

  render() {
    const { url } = this.props;

    return (
      <Router location={url}>
        <div>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/dashboard/abc">Dashboard</Link>
            <Link to="/dashboard/def">Dashboard</Link>
          </nav>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/dashboard/:bla">
              <Dashboard />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default RootRouter;
