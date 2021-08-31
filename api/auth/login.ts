import jwt from "jsonwebtoken";
import { User } from "../../domain/user";

const user = new User();
user._id = "1";
jwt.sign({ id: user._id }, "test", {
    algorithm: "HS256",
    expiresIn: "7d",
});

import { Request, Response } from "express";

export function login(req: Request, res: Response) {
    res.send("Logueo exitoso");
}
