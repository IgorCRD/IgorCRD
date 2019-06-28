const express = require("express");
const compression = require("compression");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });

app.prepare().then(() => {
  const server = express();

  server.use(compression());

  server.get("*", (req, res: any) => app.render(req, res, "/root", req.query));

  server.listen(3000, (err: any) => {
    if (err) throw err;
    // eslint-disable-next-line no-console
    console.log("> Ready on http://localhost:3000");
  });
});
