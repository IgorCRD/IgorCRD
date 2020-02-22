import React from "react";
import { useParams } from "react-router-dom";
import cssstyles from "./dashboard.module.css";

const styles = typeof window === "undefined" ? cssstyles.locals : cssstyles;

const Dashboard = () => {
  const { bla } = useParams();

  return (
    <div className={`${styles.dashboard} dashboard`}>
      {`Dashboard ${bla}`}
      <img src="/static/img/evento.png" alt="teste" />
    </div>
  );
};

export default Dashboard;
