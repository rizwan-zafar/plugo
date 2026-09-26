import { createServer } from "node:http";
import { parse } from "node:url";
import next from "next";

const port = Number(process.env.PORT) || 3000;
const hostname = process.env.HOST || "127.0.0.1";
const app = next({
  dev: process.env.NODE_ENV !== "production",
  hostname,
  port,
});
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    createServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    }).listen(port, hostname, () => {
      console.log(`Plugo ready on http://${hostname}:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start Plugo server:", error);
    process.exit(1);
  });
