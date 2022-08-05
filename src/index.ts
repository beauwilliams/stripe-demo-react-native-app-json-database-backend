import http, { IncomingMessage, ServerResponse } from "http";
import {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} from "./controllers/Transaction";
import { getPublishableKey } from "./controllers/Keys";
import { createPaymentIntent, createConnectedAccount } from "./controllers/Stripe";

const host = "0.0.0.0";
const port = 9000;

const dnplDemoBackend = http.createServer(async (req, res) => {
  if (req.method == "GET" && req.url == "/api/transactions") {
    return getTransactions(req, res);
  }

  if (req.method == "POST" && req.url == "/api/create-payment-intent") {
    return await createPaymentIntent(req, res);
  }

  if (req.method == "POST" && req.url == "/api/transactions") {
    return addTransaction(req, res);
  }

  if (req.method == "PUT" && req.url == "/api/transactions") {
    return updateTransaction(req, res);
  }

  if (req.method == "DELETE" && req.url == "/api/transactions") {
    return deleteTransaction(req, res);
  }

  if (req.method == "GET" && req.url == "/api/publishable-key") {
    return getPublishableKey(req, res);
  }

  if (req.method == "GET" && req.url == "/api/create-connected-account") {
    return createConnectedAccount(req, res);
  }

  index(res);
});

const index = (res: ServerResponse) => {
  const fs = require("fs").promises;
  fs.readFile(__dirname + "/public/index.html")
    .then((contents: any) => {
      res.setHeader("Content-Type", "text/html");
      res.writeHead(200);
      res.end(contents);
    })
    .catch((err: any) => {
      console.log(err);
    });
};

dnplDemoBackend.listen(port, host, () => {
  console.log(`DNPL Demo Backend Server is running on http://${host}:${port}`);
});
