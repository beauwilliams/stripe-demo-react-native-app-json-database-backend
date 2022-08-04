import fs from "fs";
import path from "path";

import { ServerResponse, IncomingMessage } from "http";

import { PublishableKey } from "../interfaces/IPublishableKey";



const getPublishableKey = (_: IncomingMessage, res: ServerResponse) => {
   return fs.readFile(
     path.join(__dirname, "../data/publishable-key.json"),
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




export { getPublishableKey};

