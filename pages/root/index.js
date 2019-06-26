// @flow

import React from "react";
import { Router, Link } from "@reach/router";

const Home = () => <div>Home</div>;

const Dashboard = ({ bla = "" }: { bla?: string }) => (
  <div>
    {`Dashboard ${bla}`}
    <img src="/static/img/evento.png" alt="teste" />
  </div>
);

const RootRouter = () => {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/dashboard/abc">Dashboard</Link>
        <Link to="/dashboard/def">Dashboard</Link>
      </nav>
      <Router>
        <Home path="/" />
        <Dashboard path="/dashboard/:bla" />
      </Router>
    </div>
  );
};

export default RootRouter;
