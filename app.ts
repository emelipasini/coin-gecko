import express from "express";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";

import { authController } from "./api/auth/functions";

dotenv.config();

export const app = express();
const server = http.createServer(app);

app.use(cors());

server.listen("4200", () => {
    console.log("SERVER RUNNING IN PORT 4200...");
});

app.post("/auth/register", authController.register);
app.post("/auth/login", authController.login);

app.get("/", async (req, res) => {
    res.send("Hello world!");
});

// app.use("/auth", () => {});
