import React from "react";
import "src/GlobalStyles/styles.css";

const RootApp = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default RootApp;
