import React from "react";
import { BrowserRouter, StaticRouter } from "react-router-dom";

const Router = ({ children, location, ...props }) => {
  let ReactRouter = BrowserRouter;
  let context;
  if (typeof window === "undefined") {
    ReactRouter = StaticRouter;
    context = {};
  }

  return (
    <ReactRouter location={location} context={context} {...props}>
      {children}
    </ReactRouter>
  );
};

export default Router;
