import { MongoClient } from "mongodb";
import express from "express";
import cors from "cors";
import http from "http";
import config from "config";

import usersDB from "./src/database/users";
import coinsDB from "./src/database/coins";

import { authController } from "./src/api/auth/functions";
import { coinsController } from "./src/api/coins/functions";
import { authMiddleware } from "./src/middlewares/auth";

export const app = express();
const server = http.createServer(app);

app.use(cors());

app.post("/auth/register", authController.register);
app.post("/auth/login", authController.login);
app.post("/auth/logout", authMiddleware, authController.logout);

app.get("/coins/:page?", authMiddleware, coinsController.getCoins);
app.get("/coins/top/:number?", authMiddleware, coinsController.getTop);
app.post("/coins/favorites/:id", authMiddleware, coinsController.addFavorite);

MongoClient.connect(config.get("dbURI"))
    .catch((err) => {
        console.error(err.stack);
        process.exit(1);
    })
    .then(async (client) => {
        await usersDB.injectDB(client);
        await coinsDB.injectDB(client);
        server.listen("4200", () => {
            console.log("SERVER RUNNING IN PORT 4200...");
        });
    });
