import React from "react";
import App, { Container } from "next/app";
import { ServerLocation } from "@reach/router";

class RootApp extends App {
  static async getInitialProps({ ctx: { req } }) {
    return { url: req.url };
  }

  render() {
    const { Component, url } = this.props;

    if (typeof window === "undefined") {
      return (
        <Container>
          <ServerLocation url={url}>
            <Component />
          </ServerLocation>
        </Container>
      );
    }

    return (
      <Container>
        <Component />
      </Container>
    );
  }
}

export default RootApp;
