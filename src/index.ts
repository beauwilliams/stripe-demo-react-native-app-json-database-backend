import http, { IncomingMessage, ServerResponse } from "http";
import { getTransactions, addTransaction, updateTransaction, deleteTransaction } from "./controllers/Transaction";
import {getPublishableKey} from "./controllers/Keys";

const host = "localhost";
const port = 9000;

const dnplDemoBackend = http.createServer((req, res) => {
  // get transactions
  if (req.method == "GET" && req.url == "/api/transactions") {
    return getTransactions(req, res);
  }

  // Creating a transaction
  if (req.method == "POST" && req.url == "/api/transactions") {
    return addTransaction(req, res);
  }

  // Updating a transaction
  if (req.method == "PUT" && req.url == "/api/transactions") {
    return updateTransaction(req, res);
  }

  // Deleting a transaction
  if (req.method == "DELETE" && req.url == "/api/transactions") {
    return deleteTransaction(req, res);
  }

  if (req.method == "GET" && req.url == "/api/publishable-key") {
    return getPublishableKey(req, res);
  }

  index(res);
});


  //NOTE: crappy way to return index.html for this example project
const index = (res: ServerResponse) => {
  const fs = require("fs").promises;
  fs.readFile(__dirname + "/public/index.html")
  .then((contents: any) => {
  res.setHeader("Content-Type", "text/html");
  res.writeHead(200);
  res.end(contents)
  })
  .catch((err: any) => {
  console.log(err);

    });
};

dnplDemoBackend.listen(port, host, () => {
  console.log(`DNPL Demo Backend Server is running on http://${host}:${port}`);
});
