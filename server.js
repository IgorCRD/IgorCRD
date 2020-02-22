const express = require("express");
const compression = require("compression");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });

app.prepare().then(() => {
  const server = express();

  server.use(compression());

  const isStaticAssetsRegex = new RegExp(/^\/_next\/static\//);
  server.get(isStaticAssetsRegex, (_, res, nextHandler) => {
    res.setHeader("Cache-Control", "public,max-age=31536000,immutable");
    nextHandler();
  });

  server.get("*", (req, res) => app.render(req, res, "/root", req.query));

  server.listen(3000, err => {
    if (err) throw err;
    // eslint-disable-next-line no-console
    console.log("> Ready on http://localhost:3000");
  });
});
