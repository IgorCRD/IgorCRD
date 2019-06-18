import React from "react";
import { Router, Link } from "@reach/router";

const Home = () => <div>Home</div>;

const Dashboard = () => (
  <div>
    Dashboard
    <img src="/static/img/evento.png" alt="teste" />
  </div>
);

const RootRouter = () => {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
      </nav>
      <Router>
        <Home path="/" />
        <Dashboard path="/dashboard" />
      </Router>
    </div>
  );
};

export default RootRouter;
