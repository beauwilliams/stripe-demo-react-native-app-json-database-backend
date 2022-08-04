import fs from "fs";
import path from "path";

import { ServerResponse, IncomingMessage } from "http";

import { Transaction } from "../interfaces/ITransaction";

const getTransactions = (_: IncomingMessage, res: ServerResponse) => {
  return fs.readFile(
    path.join(__dirname, "../data/transaction-list.json"),
    "utf8",
    (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            success: false,
            error: err,
          })
        );
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            success: true,
            message: JSON.parse(data),
          })
        );
      }
    }
  );
};

const addTransaction = (req: IncomingMessage, res: ServerResponse) => {
  let data = "";

  req.on("data", (chunk) => {
    data += chunk.toString();
  });

  req.on("end", () => {
    let transaction = JSON.parse(data);

    fs.readFile(
      path.join(__dirname, "../data/transaction-list.json"),
      "utf8",
      (err, data) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              success: false,
              error: err,
            })
          );
        } else {
          let transactions: [Transaction] = JSON.parse(data);
          let latest_id = transactions.reduce(
            (max = 0, transaction: Transaction) =>
              transaction.id > max ? transaction.id : max,
            0
          );
          transaction.id = latest_id + 1;
          transactions.push(transaction);
          fs.writeFile(
            path.join(__dirname, "../data/transaction-list.json"),
            JSON.stringify(transactions),
            (err) => {
              if (err) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(
                  JSON.stringify({
                    success: false,
                    error: err,
                  })
                );
              } else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(
                  JSON.stringify({
                    success: true,
                    message: transaction,
                  })
                );
              }
            }
          );
        }
      }
    );
  });
};

const updateTransaction = (req: IncomingMessage, res: ServerResponse) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk.toString();
  });
  req.on("end", () => {
    let transaction: Transaction = JSON.parse(data);
    fs.readFile(
      path.join(__dirname, "../data/transaction-list.json"),
      "utf8",
      (err, data) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              success: false,
              error: err,
            })
          );
        } else {
          let transactions: [Transaction] = JSON.parse(data);
          let index = transactions.findIndex((t) => t.id == transaction.id);
          transactions[index] = transaction;
          fs.writeFile(
            path.join(__dirname, "../data/transaction-list.json"),
            JSON.stringify(transactions),
            (err) => {
              if (err) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(
                  JSON.stringify({
                    success: false,
                    error: err,
                  })
                );
              } else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(
                  JSON.stringify({
                    success: true,
                    message: transaction,
                  })
                );
              }
            }
          );
        }
      }
    );
  });
};

const deleteTransaction = (req: IncomingMessage, res: ServerResponse) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk.toString();
  });
  req.on("end", () => {
    let transaction: Transaction = JSON.parse(data);
    fs.readFile(
      path.join(__dirname, "../data/transaction-list.json"),
      "utf8",
      (err, data) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              success: false,
              error: err,
            })
          );
        } else {
          let transactions: [Transaction] = JSON.parse(data);
          let index = transactions.findIndex((t) => t.id == transaction.id);
          transactions.splice(index, 1);
          fs.writeFile(
            path.join(__dirname, "../data/transaction-list.json"),
            JSON.stringify(transactions),
            (err) => {
              if (err) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(
                  JSON.stringify({
                    success: false,
                    error: err,
                  })
                );
              } else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(
                  JSON.stringify({
                    success: true,
                    message: transaction,
                  })
                );
              }
            }
          );
        }
      }
    );
  });
};

export {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
};
