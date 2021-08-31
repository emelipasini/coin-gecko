import { authController } from "./api/auth";

import express from "express";
import http from "http";
import dotenv from "dotenv";

dotenv.config();

export const app = express();
const server = http.createServer(app);

server.listen("4200", () => {
    console.log("SERVER RUNNING IN PORT 4200...");
});

app.post("/auth/register", authController.register);
app.post("/auth/login", authController.login);
app.patch("/auth/update", authController.updateUser);
app.delete("/auth/delete", authController.deleteUser);

app.get("/", async (req, res) => {
    res.send("Hello world!");
});

// app.use("/auth", () => {});
