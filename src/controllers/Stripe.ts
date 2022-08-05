import { IncomingMessage, ServerResponse } from "http";
import Stripe from "stripe";
import fs from "fs";
import path from "path";
import { ConnectedAccount } from "../interfaces/IConnectedAccount";

require("dotenv").config();

const stripe = new Stripe(process.env.STRIPE_API_KEY || "", {
  apiVersion: "2022-08-01",
  typescript: true,
});

export const createPaymentIntent = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  const paymentIntent = await stripe.paymentIntents
    .create({
      setup_future_usage: "off_session",
      amount: 4242,
      currency: "aud",
      transfer_data: {
        destination: "acct_1LTRLjPqJmXKUUAh",
      },
    })
    .then((paymentIntent) => {
      res.end(
        JSON.stringify({
          clientSecret: paymentIntent.client_secret,
        })
      );
    })
    .catch((error) => {
      return console.log(error);
    });
};

export const createConnectedAccount = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  const account = await stripe.accounts
    .create({
      type: "custom",
      country: "AU",
      email: "dnpl@demo.com",
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    })
    .then(async (account) => {
      const accountLink = await stripe.accountLinks
        .create({
          account: account.id,
          refresh_url: "https://example.com/refresh_url",
          return_url: "https://example.com/return_url",
          type: "account_onboarding",
        })
        .then((accountLink) => {
          fs.readFile(
            path.join(__dirname, "../data/account-list.json"),
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
                let accounts: [ConnectedAccount] = JSON.parse(data);
                let latest_id = accounts.reduce(
                  (max = 0, account: ConnectedAccount) =>
                    account.id > max ? account.id : max,
                  0
                );
                let new_account: ConnectedAccount = {
                  id: latest_id + 1,
                  account_id: account.id,
                  account_link_creation: accountLink.created || 0,
                  account_link_expiry: accountLink.expires_at,
                  url: accountLink.url,
                  display_name: "ACME CO",
                  currency: "aud",
                };
                accounts.push(new_account);
                fs.writeFile(
                  path.join(__dirname, "../data/account-list.json"),
                  JSON.stringify(accounts),
                  (err) => {
                    if (err) {
                      res.writeHead(500, {
                        "Content-Type": "application/json",
                      });
                      res.end(
                        JSON.stringify({
                          success: false,
                          error: err,
                        })
                      );
                    } else {
                      res.writeHead(200, {
                        "Content-Type": "application/json",
                      });
                      res.end(
                        JSON.stringify({
                          success: true,
                          message: new_account,
                        })
                      );
                    }
                  }
                );
              }
            }
          );
        });
    })
    .catch((error) => {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: false,
          error: error,
        })
      );
    });
};
